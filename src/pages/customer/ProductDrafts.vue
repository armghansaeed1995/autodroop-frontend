<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Product Drafts</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your product drafts before publishing to marketplaces.</p>
    </div>

    <q-card flat class="table-card">
      <q-table
        :rows="drafts"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        :filter="filter"
        flat
        class="admin-table"
      >
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-medium">All Drafts</div>

            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="filter"
                dense
                filled
                placeholder="Search drafts..."
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
                label="New Product"
                unelevated
                @click="newProduct"
              />
              <q-btn
                color="secondary"
                icon="las la-file-upload"
                label="Import CSV"
                unelevated
                @click="showCsvImportDialog = true"
              />
            </div>
          </div>
        </template>

        <template v-slot:body-selection="props">
          <q-checkbox v-model="props.selected" />
        </template>

        <template v-slot:body-cell-cost_price="props">
          <q-td :props="props">
            ${{ parseFloat(props.row.cost_price).toFixed(2) }}
          </q-td>
        </template>

        <template v-slot:body-cell-selling_price="props">
          <q-td :props="props">
            ${{ parseFloat(props.row.selling_price).toFixed(2) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="secondary" icon="las la-pen" @click="editProduct(props.row)">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteProduct(props.row)">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- CSV Import Dialog -->
    <q-dialog v-model="showCsvImportDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Import Products from CSV</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-file
            filled
            v-model="csvFile"
            label="Select CSV File"
            accept=".csv"
            :loading="uploading"
            @update:model-value="fileSelected"
          >
            <template v-slot:prepend>
              <q-icon name="las la-file-csv" />
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup :disable="uploading" />
          <q-btn flat label="Upload" @click="uploadCsv" :disable="!csvFile || uploading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  name: 'ProductDraftsPage',
  data() {
    return {
      drafts: [],
      selected: [],
      loading: false,
      filter: '',
      showCsvImportDialog: false,
      csvFile: null,
      uploading: false,
      columns: [
        { name: 'sku', required: true, label: 'SKU', align: 'left', field: 'sku', sortable: true },
        { name: 'title', required: true, label: 'Title', align: 'left', field: 'title', sortable: true },
        { name: 'cost_price', required: true, label: 'Cost Price', align: 'right', field: 'cost_price', sortable: true },
        { name: 'selling_price', required: true, label: 'Selling Price', align: 'right', field: 'selling_price', sortable: true },
        { name: 'stock_quantity', required: true, label: 'Stock', align: 'right', field: 'stock_quantity', sortable: true },
        { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ]
    };
  },
  mounted() {
    this.fetchDrafts();
  },
  methods: {
    async fetchDrafts() {
      this.loading = true;
      try {
        const response = await this.$api.get('/products');
        this.drafts = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to fetch product drafts.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching drafts:', error);
      } finally {
        this.loading = false;
      }
    },
    newProduct() {
      // Placeholder for new product creation logic (opens a dialog/form)
      this.$q.notify({
        type: 'info',
        message: 'New Product creation coming soon!',
        icon: 'las la-plus-circle',
        position: 'top-right'
      });
    },
    editProduct(product) {
      // Placeholder for product editing logic (opens a dialog/form)
      this.$q.notify({
        type: 'info',
        message: `Editing product: ${product.title}`,
        icon: 'las la-pen',
        position: 'top-right'
      });
    },
    deleteProduct(product) {
      // Placeholder for product deletion logic (with confirmation)
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete product "${product.title}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          // Implement API call for deletion here
          this.$q.notify({
            type: 'positive',
            message: 'Product deleted successfully (simulation).',
            icon: 'las la-check',
            position: 'top-right'
          });
          this.fetchDrafts(); // Refresh list
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Failed to delete product.',
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error deleting product:', error);
        }
      });
    },
    fileSelected(file) {
      this.csvFile = file;
    },
    async uploadCsv() {
      if (!this.csvFile) {
        this.$q.notify({
          type: 'warning',
          message: 'Please select a CSV file first.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        return;
      }

      this.uploading = true;
      const formData = new FormData();
      formData.append('file', this.csvFile);

      try {
        const response = await this.$api.post('/products/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.$q.notify({
          type: 'positive',
          message: response.data.message || `${response.data.count} products imported successfully!`,
          icon: 'las la-check-circle',
          position: 'top-right'
        });
        this.showCsvImportDialog = false;
        this.csvFile = null;
        await this.fetchDrafts(); // Refresh the list of drafts
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to import products from CSV.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error importing CSV:', error);
      } finally {
        this.uploading = false;
      }
    }
  }
};
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
