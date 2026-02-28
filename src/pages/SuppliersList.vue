<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Supplier Accounts</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your connected supplier accounts for automated ordering.</p>
    </div>

    <q-card flat>
      <q-table
        :rows="suppliers"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Supplier Accounts</div>

            <q-btn
              color="primary"
              icon="las la-plus"
              label="Add Supplier"
              unelevated
              @click="openDialog()"
            />
          </div>
        </template>

        <template v-slot:body-cell-platform="props">
          <q-td :props="props">
            <q-chip color="secondary" text-color="white" dense>
              {{ props.row.platform }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="secondary" icon="las la-pen" @click="openDialog(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteSupplier(props.row.id)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Supplier Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Add/Edit Supplier Account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveSupplier" class="q-gutter-md">
            <q-input
              filled
              v-model="form.name"
              label="Account Name *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Account name is required']"
            />

            <q-select
              filled
              v-model="form.platform"
              :options="platformOptions"
              label="Platform *"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Platform is required']"
            />

            <!-- Credentials fields based on platform (example for Amazon) -->
            <div v-if="form.platform === 'Amazon'">
              <q-input filled v-model="form.credentials.email" label="Amazon Email *" type="email" />
              <q-input filled v-model="form.credentials.password" label="Amazon Password *" type="password" />
            </div>
            <!-- Add more credential fields for other platforms as needed -->

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'SuppliersListPage',
  data() {
    return {
      suppliers: [],
      loading: false,
      filter: '',
      dialogOpen: false,
      form: {
        id: null,
        name: '',
        platform: 'Amazon',
        credentials: {} // Store credentials as an object
      },
      defaultForm: {
        id: null,
        name: '',
        platform: 'Amazon',
        credentials: {}
      },
      platformOptions: ['Amazon'], // Only Amazon for now as per spec
      columns: [
        { name: 'name', label: 'Account Name', align: 'left', field: 'name', sortable: true },
        { name: 'platform', label: 'Platform', align: 'left', field: 'platform', sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ]
    };
  },
  mounted() {
    this.fetchSuppliers();
  },
  methods: {
    async fetchSuppliers() {
      this.loading = true;
      try {
        const response = await this.$api.get('/suppliers');
        // Assuming API returns actual data, not just TODO message
        if (response.data.message && response.data.message.includes("TODO")) {
          this.suppliers = []; // Clear if TODO, or add dummy data
          console.warn("Backend /suppliers endpoint is still a TODO. Displaying dummy data for now.");
          this.suppliers = [
            { id: '1', name: 'My Amazon US', platform: 'Amazon', credentials: { email: 'test@example.com' } },
            { id: '2', name: 'My Amazon DE', platform: 'Amazon', credentials: { email: 'germany@example.com' } }
          ];
        } else {
          this.suppliers = response.data;
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to fetch supplier accounts.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching suppliers:', error);
      } finally {
        this.loading = false;
      }
    },
    openDialog(supplier = null) {
      this.form = supplier ? { ...supplier, credentials: { ...supplier.credentials } } : { ...this.defaultForm, credentials: {} };
      this.dialogOpen = true;
    },
    async saveSupplier() {
      this.loading = true;
      try {
        if (this.form.id) {
          await this.$api.put(`/suppliers/${this.form.id}`, this.form);
          this.$q.notify({
            type: 'positive',
            message: 'Supplier account updated successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        } else {
          await this.$api.post('/suppliers', this.form);
          this.$q.notify({
            type: 'positive',
            message: 'Supplier account added successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
        }
        this.dialogOpen = false;
        await this.fetchSuppliers(); // Refresh list
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to save supplier account.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error saving supplier:', error);
      } finally {
        this.loading = false;
      }
    },
    deleteSupplier(id) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this supplier account? This cannot be undone.',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        this.loading = true;
        try {
          await this.$api.delete(`/suppliers/${id}`);
          this.$q.notify({
            type: 'positive',
            message: 'Supplier account deleted successfully.',
            icon: 'las la-check-circle',
            position: 'top-right'
          });
          await this.fetchSuppliers(); // Refresh list
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Failed to delete supplier account.',
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error deleting supplier:', error);
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
