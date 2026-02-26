<template>
  <div class="q-pa-md q-pa-md-xl">

    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Customer Management</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">View, search, and manage your platform's customer base.</p>
    </div>

    <q-card flat class="table-card">
      <q-table
        :rows="customers"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        :grid="$q.screen.xs"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Customers</div>

            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="filter"
                dense
                filled
                placeholder="Search customers..."
                debounce="300"
                class="search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="las la-search" />
                </template>
                <template v-slot:append v-if="filter">
                  <q-icon name="las la-times" class="cursor-pointer" @click="filter = ''" />
                </template>
              </q-input>

              <q-btn
                color="primary"
                icon="las la-plus"
                label="Add Customer"
                unelevated
                @click="addCustomer"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-company_name="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" color="primary-1" text-color="primary" class="q-mr-sm">
                <span class="text-weight-bold">{{ props.row.company_name ? props.row.company_name.charAt(0).toUpperCase() : 'N/A' }}</span>
              </q-avatar>
              <div class="text-weight-medium">{{ props.row.company_name || 'N/A' }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.email }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-package_name="props">
          <q-td :props="props">
            <q-chip
              color="primary-1"
              text-color="primary"
              dense
              class="text-weight-bold text-uppercase text-caption q-px-sm"
            >
              {{ props.row.Package ? props.row.Package.name : 'N/A' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status === 'active' ? 'positive-1' : (props.row.status === 'pending' ? 'warning-1' : 'negative-1')"
              :text-color="props.row.status === 'active' ? 'positive' : (props.row.status === 'pending' ? 'warning' : 'negative')"
              dense
              class="text-weight-bold text-uppercase text-caption q-px-sm"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-renew_date="props">
          <q-td :props="props">
            {{ props.row.renew_date ? formatDate(props.row.renew_date) : 'N/A' }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="secondary" icon="las la-pen" @click="editCustomer(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteCustomer(props.row)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>


      </q-table>
    </q-card>

    <q-dialog v-model="customerDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editedCustomer.id ? 'Edit Customer' : 'Add New Customer' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveCustomer" class="q-gutter-md">
            <q-input
              filled
              v-model="editedCustomer.company_name"
              label="Company Name"
              lazy-rules
              :rules="[(val) => (val === null || val.length === 0 || val.length >= 2) || 'Company name must be at least 2 characters']"
            />
            <q-input
              filled
              v-model="editedCustomer.vat_tax_id"
              label="VAT/Tax ID"
              lazy-rules
              :rules="[(val) => (val === null || val.length === 0 || val.length >= 2) || 'VAT/Tax ID must be at least 2 characters']"
            />
            <q-input
              filled
              type="email"
              v-model="editedCustomer.email"
              label="Primary Email *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Email must be valid'
              ]"
            />

            <!-- Package Selection -->
            <q-select
              filled
              v-model="editedCustomer.package_id"
              :options="packages"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              label="Package *"
              lazy-rules
              :rules="[(val) => val !== null || 'Package is required']"
            />

            <!-- Status Selection -->
            <q-select
              filled
              v-model="editedCustomer.status"
              :options="statusOptions"
              label="Status *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Status is required']"
            />

            <!-- Renew Date -->
            <q-input filled v-model="editedCustomer.renew_date" label="Renew Date (YYYY-MM-DD)">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="editedCustomer.renew_date" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <div class="text-subtitle1 q-mt-md">Current Package Limits</div>
            <q-input
              filled
              type="number"
              v-model="editedCustomer.current_max_ebay_accounts"
              label="Max eBay Accounts"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedCustomer.current_max_suppliers"
              label="Max Suppliers"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedCustomer.current_max_products"
              label="Max Products"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              step="0.01"
              v-model="editedCustomer.current_max_track_credits"
              label="Max Track Credits"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Required and must be non-negative']"
            />

            <!-- User Creation Fields (only for new customers) -->
            <template v-if="!editedCustomer.id">
              <div class="text-subtitle1 q-mt-md">Primary User Details</div>
              <q-input
                filled
                v-model="editedCustomer.user_first_name"
                label="User First Name *"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'User first name is required']"
              />
              <q-input
                filled
                v-model="editedCustomer.user_last_name"
                label="User Last Name *"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'User last name is required']"
              />
              <q-input
                filled
                type="password"
                v-model="editedCustomer.user_password"
                label="User Password *"
                lazy-rules
                :rules="[(val) => (val && val.length >= 6) || 'Password must be at least 6 characters']"
              />
              <q-input
                filled
                type="password"
                v-model="editedCustomer.user_confirm_password"
                label="Confirm User Password *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length >= 6) || 'Confirm password is required',
                  (val) => val === editedCustomer.user_password || 'Passwords do not match'
                ]"
              />
            </template>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Save Customer" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageCustomerManagement',
  data() {
    return {
      customers: [],
      packages: [], // To populate package dropdown
      loading: true,
      filter: '',
      columns: [
        { name: 'company_name', required: false, label: 'Company Name', align: 'left', field: 'company_name', sortable: true },
        { name: 'vat_tax_id', required: false, label: 'VAT/Tax ID', align: 'left', field: 'vat_tax_id', sortable: true },
        { name: 'email', align: 'left', label: 'Primary Email', field: 'email', sortable: true },
        { name: 'package_name', align: 'left', label: 'Package', field: row => row.Package ? row.Package.name : 'N/A', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'renew_date', align: 'center', label: 'Renew Date', field: 'renew_date', format: val => this.formatDate(val), sortable: true },
        { name: 'current_max_ebay_accounts', label: 'Max eBay Acc.', align: 'center', field: 'current_max_ebay_accounts', sortable: true },
        { name: 'current_max_suppliers', label: 'Max Suppliers', align: 'center', field: 'current_max_suppliers', sortable: true },
        { name: 'current_max_products', label: 'Max Products', align: 'center', field: 'current_max_products', sortable: true },
        { name: 'current_max_track_credits', label: 'Track Credits', align: 'center', field: 'current_max_track_credits', sortable: true, format: val => parseFloat(val).toFixed(2) },
        { name: 'createdAt', label: 'Created At', align: 'right', field: 'createdAt', format: val => this.formatDate(val), sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ],
      customerDialog: false,
      editedCustomer: {
        id: null,
        company_name: '',
        vat_tax_id: '',
        email: '',
        package_id: null,
        status: 'active',
        renew_date: null,
        current_max_ebay_accounts: 1,
        current_max_suppliers: 1,
        current_max_products: 1,
        current_max_track_credits: 1,
        // Fields for creating a primary user (only for new customers)
        user_first_name: '',
        user_last_name: '',
        user_password: '',
        user_confirm_password: ''
      },
      defaultCustomer: {
        id: null,
        company_name: '',
        vat_tax_id: '',
        email: '',
        package_id: null,
        status: 'active',
        renew_date: null,
        current_max_ebay_accounts: 1,
        current_max_suppliers: 1,
        current_max_products: 1,
        current_max_track_credits: 1,
        user_first_name: '',
        user_last_name: '',
        user_password: '',
        user_confirm_password: ''
      },
      statusOptions: ['active', 'pending', 'suspended', 'cancelled']
    }
  },
  async created() {
    await this.fetchCustomers();
    await this.fetchPackages();
  },
  methods: {
    formatDate(dateVal) {
      if (!dateVal) return '-';
      const locale = this.$i18n ? this.$i18n.locale : 'en-US';
      return new Date(dateVal).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    async fetchCustomers() {
      this.loading = true;
      try {
        const response = await this.$api.get('/admin/customers');
        this.customers = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to load customers.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching customers:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchPackages() {
      try {
        const response = await this.$api.get('/packages');
        this.packages = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to load packages for dropdown.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching packages:', error);
      }
    },
    addCustomer() {
      this.editedCustomer = { ...this.defaultCustomer };
      this.customerDialog = true;
    },
          editCustomer(customer) {
          // Deep copy customer data to editedCustomer, handle package_id for q-select
          this.editedCustomer = {
            ...customer,
            package_id: customer.Package ? customer.Package.id : null,
            renew_date: customer.renew_date ? new Date(customer.renew_date).toISOString().substr(0, 10) : null, // Format for date picker
            current_max_ebay_accounts: customer.current_max_ebay_accounts,
            current_max_suppliers: customer.current_max_suppliers,
            current_max_products: customer.current_max_products,
            current_max_track_credits: parseFloat(customer.current_max_track_credits) // Ensure it's a number
          };
          this.customerDialog = true;
        },    async saveCustomer() {
      this.loading = true;
      try {
        const payload = { ...this.editedCustomer };
        delete payload.Package; // Remove nested Package object if present

        if (this.editedCustomer.id) {
          // Update existing customer
          await this.$api.put(`/admin/customers/${this.editedCustomer.id}`, payload);
          this.$q.notify({
            type: 'positive',
            message: 'Customer updated successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        } else {
          // Create new customer
          delete payload.id; // Remove id from payload for new customer creation

          // For create, we also need to register a user
          await this.$api.post('/admin/customers', payload);
          this.$q.notify({
            type: 'positive',
            message: 'Customer created successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        }
        this.customerDialog = false;
        await this.fetchCustomers(); // Reload list
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to save customer.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error saving customer:', error);
      } finally {
        this.loading = false;
      }
    },
    deleteCustomer(customer) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete customer "${customer.company_name}"? This action cannot be undone.`,
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        this.loading = true;
        try {
          await this.$api.delete(`/admin/customers/${customer.id}`);
          this.$q.notify({
            type: 'positive',
            message: 'Customer successfully deleted.',
            icon: 'las la-check',
            position: 'top-right'
          });
          await this.fetchCustomers(); // Reload list
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Failed to delete customer.',
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error deleting customer:', error);
        } finally {
          this.loading = false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  min-width: 250px;

  @media (max-width: $breakpoint-xs-max) {
    min-width: 100%; // Full width on mobile
  }
}

.admin-table {
  /* Enforce flat table header styling */
  :deep(.q-table__top) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  body.body--dark & :deep(.q-table__top) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* Make header typography clean and readable */
  :deep(th) {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: $grey-6;
  }
}
</style>
