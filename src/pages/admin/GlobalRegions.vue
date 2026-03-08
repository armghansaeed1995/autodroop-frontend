<template>
  <q-page padding>
    <!-- Header Row -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">Global Region Templates</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">Manage default settings, pricing rules, and policies for different countries.</p>
      </div>
      <q-btn
        unelevated
        color="primary"
        icon="las la-plus"
        label="Add New Region"
        @click="openCreate"
      />
    </div>

    <!-- Regions Table -->
    <q-card flat bordered class="q-pa-none">
      <q-table
        :rows="regions"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        binary-state-sort
      >
        <!-- Custom slot for Country Code -->
        <template v-slot:body-cell-country_code="props">
          <q-td :props="props">
            <q-chip outline color="primary" size="sm" class="text-weight-bold">
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <!-- Custom slot for eBay Region toggle -->
        <template v-slot:body-cell-is_ebay_region="props">
          <q-td :props="props">
            <q-icon
              :name="props.value ? 'las la-check-circle' : 'las la-times-circle'"
              :color="props.value ? 'positive' : 'grey-5'"
              size="sm"
            />
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              unelevated
              size="sm"
              color="primary"
              icon="las la-layer-group"
              label="Templates"
              @click="manageTemplates(props.row)"
            >
              <q-tooltip>Manage Global Templates for this Region</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              size="sm"
              color="primary"
              icon="las la-edit"
              @click="openEdit(props.row)"
            >
              <q-tooltip>Edit Region Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              size="sm"
              color="negative"
              icon="las la-trash"
              @click="deleteRegion(props.row.id)"
            >
              <q-tooltip>Delete Region</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw">
        <!-- Dialog Header -->
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">
            {{ isEdit ? 'Edit Region Details' : 'Add New Global Region' }}
          </div>
          <q-space />
          <q-btn icon="las la-times" flat round dense v-close-popup />
        </q-card-section>

        <!-- Form Content -->
        <q-card-section class="q-pt-lg">
          <q-form @submit="saveRegion" class="row q-col-gutter-md">
            <div class="col-12">
              <q-input 
                v-model="editForm.name" 
                label="Region Name" 
                filled 
                dense 
                placeholder="e.g., United States" 
                :rules="[val => !!val || 'Name is required']"
              />
            </div>
            <div class="col-6">
              <q-input 
                v-model="editForm.country_code" 
                label="ISO Country Code" 
                filled 
                dense 
                mask="AA" 
                placeholder="US" 
                :readonly="isEdit" 
                :rules="[
                  val => !!val || 'Code is required',
                  val => val.length === 2 || 'Must be 2 characters'
                ]"
                style="text-transform: uppercase"
              />
            </div>
            <div class="col-6">
              <q-input 
                v-model="editForm.currency" 
                label="Currency (ISO)" 
                filled 
                dense 
                mask="AAA" 
                placeholder="USD" 
                :rules="[
                  val => !!val || 'Currency is required',
                  val => val.length === 3 || 'Must be 3 characters'
                ]"
                style="text-transform: uppercase"
              />
            </div>
            <div class="col-12">
              <q-input v-model="editForm.default_language" label="Default Language" filled dense placeholder="en-US" />
            </div>
            <div class="col-12">
              <q-item tag="label" v-ripple class="border rounded-sm q-pa-sm">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Status</q-item-label>
                  <q-item-label caption>Allow this region to be used in the system</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="editForm.is_active" color="primary" />
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12">
              <q-item tag="label" v-ripple class="border rounded-sm q-pa-sm">
                <q-item-section>
                  <q-item-label class="text-weight-bold">eBay Integration</q-item-label>
                  <q-item-label caption>Mark as an official eBay marketplace</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="editForm.is_ebay_region" color="primary" />
                </q-item-section>
              </q-item>
            </div>
          </q-form>
        </q-card-section>

        <!-- Action Footer -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn 
            unelevated 
            icon="las la-save" 
            label="Save Region" 
            color="primary" 
            @click="saveRegion"
            class="q-px-md"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <!-- Removed manual delete dialog as we now use $q.dialog in the script -->
  </q-page>
</template>

<script>
export default {
  name: 'GlobalRegions',
  data() {
    return {
      loading: false,
      activeTab: 'general',
      regions: [],
      columns: [
        { name: 'name', label: 'Region Name', field: 'name', align: 'left', sortable: true },
        { name: 'country_code', label: 'Code', field: 'country_code', align: 'center', sortable: true },
        { name: 'currency', label: 'Currency', field: 'currency', align: 'center' },
        { name: 'is_ebay_region', label: 'eBay', field: 'is_ebay_region', align: 'center' },
        { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
      ],
      showDialog: false,
      isEdit: false,
      editForm: {
        id: null,
        name: '',
        country_code: '',
        currency: '',
        default_language: 'en',
        is_ebay_region: true,
        default_messages: {
          shipped: '',
          delivered: '',
          out_of_stock: ''
        },
        default_pricing_rules: {
          min_margin: 0,
          target_margin: 0
        },
        default_policies: {
          handling_time: 2,
          warehouse_city: '',
          warehouse_zipcode: '',
          max_return_days: 30
        }
      }
    }
  },
  mounted() {
    this.fetchRegions();
  },
  methods: {
    fetchRegions() {
      this.loading = true;
      this.$api.get('/admin/global-regions')
        .then(response => {
          this.regions = response.data;
        })
        .catch(error => {
          console.error('Error fetching regions:', error);
          this.$q.notify({
            color: 'negative',
            message: 'Failed to load regions',
            icon: 'las la-exclamation-circle'
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    manageTemplates(row) {
      this.$router.push({
        path: '/admin/global-templates',
        query: { region: row.country_code }
      });
    },

    openCreate() {
      this.isEdit = false;
      this.activeTab = 'general';
      this.editForm = {
        id: null,
        name: '',
        country_code: '',
        currency: '',
        default_language: 'en',
        is_ebay_region: true,
        default_messages: { shipped: '', delivered: '', out_of_stock: '' },
        default_pricing_rules: { min_margin: 0, target_margin: 0 },
        default_policies: { handling_time: 2, warehouse_city: '', warehouse_zipcode: '', max_return_days: 30 }
      };
      this.showDialog = true;
    },

    openEdit(row) {
      this.isEdit = true;
      this.activeTab = 'general';
      // Deep copy the data to avoid direct mutation
      this.editForm = JSON.parse(JSON.stringify(row));

      // Ensure JSON fields are initialized if they come back null from API
      if (!this.editForm.default_messages) this.editForm.default_messages = { shipped: '', delivered: '', out_of_stock: '' };
      if (!this.editForm.default_pricing_rules) this.editForm.default_pricing_rules = { min_margin: 0, target_margin: 0 };
      if (!this.editForm.default_policies) this.editForm.default_policies = { handling_time: 2, warehouse_city: '', warehouse_zipcode: '', max_return_days: 30 };

      this.showDialog = true;
    },

    async saveRegion() {
      try {
        this.loading = true;
        if (this.isEdit) {
          await this.$api.put(`/admin/global-regions/${this.editForm.id}`, this.editForm);
          this.$q.notify({ color: 'positive', message: 'Region updated successfully', icon: 'las la-check' });
        } else {
          await this.$api.post('/admin/global-regions', this.editForm);
          this.$q.notify({ color: 'positive', message: 'Region created successfully', icon: 'las la-check' });
        }
        this.showDialog = false;
        await this.fetchRegions();
      } catch (error) {
        console.log(error)
        const errorMsg = error.response?.data?.error || 'Error saving region';
        this.$q.notify({ color: 'negative', message: errorMsg, icon: 'las la-exclamation-circle' });
      } finally {
        this.loading = false;
      }
    },

    deleteRegion(id) {
      this.$q.dialog({
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this region template? This action cannot be undone.',
        cancel: true,
        persistent: true,
        ok: {
          color: 'negative',
          label: 'Delete'
        }
      }).onOk(async () => {
        try {
          await this.$api.delete(`/admin/global-regions/${id}`);
          this.$q.notify({ color: 'positive', message: 'Region deleted successfully', icon: 'las la-trash' });
          await this.fetchRegions();
        } catch (error) {
          console.log(error)
          this.$q.notify({ color: 'negative', message: 'Failed to delete region', icon: 'las la-exclamation-circle' });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.line-height-1 {
  line-height: 1.2;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  body.body--dark & {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.bg-page {
  background-color: #F8FAFC;
  body.body--dark & {
    background-color: #0c0c0e;
  }
}

.rounded-sm {
  border-radius: 8px;
}

.border {
  border: 1px solid rgba(0, 0, 0, 0.08);
  body.body--dark & {
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.max-width-container {
  max-width: 800px;
  margin: 0 auto;
}

.bg-primary-1 {
  background-color: rgba($primary, 0.05);
  body.body--dark & {
    background-color: rgba($primary, 0.1);
  }
}

.no-border-radius {
  border-radius: 0 !important;
}
</style>
