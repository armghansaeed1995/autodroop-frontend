<template>
  <div class="q-pa-md q-pa-md-xl">

    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Packages Management</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage subscription packages, pricing, and limits.</p>
    </div>

    <q-card flat class="table-card">
      <q-table
        :rows="packages"
        :columns="columns"
        row-key="id"
        :filter="searchFilter"
        :pagination="initialPagination"
        :grid="$q.screen.xs"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Packages</div>

            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="searchFilter"
                dense
                filled
                placeholder="Search packages..."
                debounce="300"
                class="search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="las la-search" />
                </template>
                <template v-slot:append v-if="searchFilter">
                  <q-icon name="las la-times" class="cursor-pointer" @click="searchFilter = ''" />
                </template>
              </q-input>
              <q-btn
                color="primary"
                icon="las la-plus"
                round
                dense
                unelevated
                class=""
                @click="addPackage"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="secondary" icon="las la-pen" @click="editPackage(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="confirmDelete(props.row)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="packageDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">{{ editedPackage.id ? 'Edit Package' : 'Create Package' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="savePackage" class="q-gutter-md">
            <q-input
              filled
              v-model="editedPackage.name"
              label="Package Name *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Package name is required']"
            />
            <q-input
              filled
              type="number"
              v-model="editedPackage.price"
              label="Price *"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Price is required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedPackage.max_ebay_accounts"
              label="Max eBay Accounts *"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Max eBay accounts is required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedPackage.max_suppliers"
              label="Max Suppliers *"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Max suppliers is required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedPackage.max_products"
              label="Max Products *"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Max products is required and must be non-negative']"
            />
            <q-input
              filled
              type="number"
              v-model="editedPackage.max_track_credits"
              label="Max Track Credits *"
              lazy-rules
              :rules="[(val) => (val !== null && val >= 0) || 'Max track credits is required and must be non-negative']"
            />
            <q-input
              filled
              v-model="editedPackage.stripe_price_id"
              label="Stripe Price ID"
            />

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageTables',
  data() {
    return {
      searchFilter: '',
      initialPagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 7
      },
      columns: [
        { name: 'name', required: true, label: 'Package Name', align: 'left', field: 'name', sortable: true },
        { name: 'price', align: 'left', label: 'Price', field: 'price', format: val => `$${parseFloat(val).toFixed(2)}`, sortable: true },
        { name: 'max_ebay_accounts', align: 'center', label: 'Max eBay Acc.', field: 'max_ebay_accounts', sortable: true },
        { name: 'max_suppliers', align: 'center', label: 'Max Suppliers', field: 'max_suppliers', sortable: true },
        { name: 'stripe_price_id', align: 'left', label: 'Stripe ID', field: 'stripe_price_id', sortable: true },
        { name: 'max_products', align: 'center', label: 'Max Products', field: 'max_products', sortable: true },
        { name: 'max_track_credits', align: 'center', label: 'Max Track Credits', field: 'max_track_credits', sortable: true },
        { name: 'createdAt', align: 'left', label: 'Created At', field: 'createdAt', format: val => new Date(val).toLocaleString(), sortable: true },
        { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
      ],
      packages: [],
      packageDialog: false,
      editedPackage: {
        id: null,
        name: '',
        price: 0,
        max_ebay_accounts: 1,
        max_suppliers: 1,
        max_products: 1,
        max_track_credits: 1,
        stripe_price_id: ''
      },
      defaultPackage: { // Used for resetting the form
        id: null,
        name: '',
        price: 0,
        max_ebay_accounts: 1,
        max_suppliers: 1,
        max_products: 1,
        max_track_credits: 1,
        stripe_price_id: ''
      }
    }
  },
  methods: {
    async fetchPackages() {
      try {
        const token = localStorage.getItem('token');
        const response = await this.$axios.get('http://localhost:3000/api/packages', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.packages = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to fetch packages.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching packages:', error);
      }
    },
    addPackage() {
      this.editedPackage = { ...this.defaultPackage }; // Reset form
      this.packageDialog = true;
    },
    editPackage(pkg) {
      this.editedPackage = { ...pkg }; // Pre-fill form with package data
      this.packageDialog = true;
    },
    async savePackage() {
      try {
        const token = localStorage.getItem('token');
        if (this.editedPackage.id) {
          // Update existing package
          await this.$axios.put(`http://localhost:3000/api/packages/${this.editedPackage.id}`, this.editedPackage, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.$q.notify({
            type: 'positive',
            message: 'Package updated successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        } else {
          // Create new package
          await this.$axios.post('http://localhost:3000/api/packages', this.editedPackage, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.$q.notify({
            type: 'positive',
            message: 'Package created successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        }
        this.packageDialog = false;
        await this.fetchPackages(); // Reload list
      } catch (error) {
        let errorMessage = 'Failed to save package.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error saving package:', error);
      }
    },
    confirmDelete(pkg) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete package "${pkg.name}"? This action cannot be undone.`,
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        try {
          const token = localStorage.getItem('token');
          await this.$axios.delete(`http://localhost:3000/api/packages/${pkg.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.$q.notify({
            type: 'positive',
            message: 'Package successfully deleted.',
            icon: 'las la-check',
            position: 'top-right'
          });
          await this.fetchPackages(); // Reload list
        } catch (error) {
          let errorMessage = 'Failed to delete package.';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          this.$q.notify({
            type: 'negative',
            message: errorMessage,
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error deleting package:', error);
        }
      });
    }
  },
  created() {
    this.fetchPackages();
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

  /* Make header bold */
  :deep(th) {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: $grey-6;
  }
}
</style>
