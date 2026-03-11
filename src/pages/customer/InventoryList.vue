<template>
  <q-page padding class="bg-page">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none tracking-tight">Inventory Management</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">Monitor performance, optimize listings, and manage sponsorships.</p>
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          outline
          color="primary"
          icon="las la-filter"
          label="Advanced Filters"
          @click="showFilters = !showFilters"
        />
        <q-btn
          color="primary"
          icon="las la-sync"
          label="Refresh Performance"
          @click="fetchInventory"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="text-grey-7 text-caption text-uppercase text-weight-bold">Total Listings</div>
            <div class="text-h4 text-weight-bolder">{{ pagination.rowsNumber }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="stat-card border-orange">
          <q-card-section>
            <div class="text-orange-9 text-caption text-uppercase text-weight-bold">High DWS (>30)</div>
            <div class="text-h4 text-weight-bolder text-orange-9">{{ highDwsCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="stat-card border-green">
          <q-card-section>
            <div class="text-green-9 text-caption text-uppercase text-weight-bold">Sponsored Items</div>
            <div class="text-h4 text-weight-bolder text-green-9">{{ sponsoredCount }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="stat-card border-blue">
          <q-card-section>
            <div class="text-blue-9 text-caption text-uppercase text-weight-bold">Monthly Views</div>
            <div class="text-h4 text-weight-bolder text-blue-9">{{ totalViews }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters Section -->
    <q-slide-transition>
      <div v-if="showFilters" class="q-mb-lg">
        <q-card flat bordered class="filter-card">
          <q-card-section class="row q-col-gutter-md items-end">
             <div class="col-12 col-md-4">
              <q-input
                v-model="filters.search"
                placeholder="Search Title, Listing ID..."
                outlined
                dense
                clearable
                @keyup.enter="fetchInventory"
              >
                <template v-slot:prepend>
                  <q-icon name="las la-search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.region"
                :options="['IT', 'UK', 'US', 'DE', 'FR']"
                label="Region"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="filters.status"
                :options="['active', 'error', 'publishing']"
                label="Status"
                outlined
                dense
                clearable
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                v-model.number="filters.min_views"
                type="number"
                label="Min Views"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                v-model.number="filters.max_dws"
                type="number"
                label="Max DWS"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-2">
              <q-toggle
                v-model="filters.is_sponsored"
                label="Sponsored Only"
                color="primary"
                keep-color
              />
            </div>
            <div class="col-12 row justify-end q-gutter-sm">
              <q-btn flat label="Reset" color="grey-7" @click="resetFilters" />
              <q-btn unelevated label="Apply Filters" color="primary" @click="fetchInventory" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-slide-transition>

    <!-- Inventory Table -->
    <q-card flat bordered class="table-card" :class="isDark ? 'bg-surface-dark' : 'bg-white'">
      <q-table
        :rows="inventory"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        flat
        class="admin-table inventory-table"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <!-- Product Cell -->
        <template v-slot:body-cell-product="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar rounded size="56px" class="q-mr-md border shadow-sm bg-grey-2">
                <img :src="props.row.image?.url || 'https://cdn.quasar.dev/img/placeholder.png'" />
              </q-avatar>
              <div class="column">
                <div class="text-weight-bold text-primary ellipsis-2-lines text-body2" style="max-width: 250px">
                  {{ props.row.title }}
                </div>
                <div class="row items-center q-gutter-xs q-mt-xs">
                  <q-badge outline color="blue-7" size="sm" class="cursor-pointer" @click="openExternalLink('https://www.ebay.it/itm/' + props.row.ebay_listing_id)">
                    SELL: {{ props.row.ebay_listing_id || 'PENDING' }}
                    <q-icon name="las la-external-link-alt" class="q-ml-xs" />
                  </q-badge>
                  <q-chip dense outline size="xs" color="grey-6" class="q-ma-none">
                    {{ props.row.supplier }} • {{ props.row.region }}
                  </q-chip>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Performance Metrics -->
        <template v-slot:body-cell-performance="props">
          <q-td :props="props">
            <div class="column items-center">
              <div class="row items-center q-gutter-sm">
                <div class="column items-center">
                  <span class="text-caption text-grey-7">DWS</span>
                  <q-badge :color="props.row.dws > 30 ? 'negative' : 'grey-8'" class="text-weight-bold">
                    {{ props.row.dws }}
                  </q-badge>
                </div>
                <q-separator vertical inset />
                <div class="column items-center">
                  <span class="text-caption text-grey-7">Views</span>
                  <span class="text-weight-bold text-blue-9">{{ props.row.views }}</span>
                </div>
                <q-separator vertical inset />
                <div class="column items-center">
                  <span class="text-caption text-grey-7">Imp.</span>
                  <span class="text-weight-bold text-purple-9">{{ props.row.impressions }}</span>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Profit Cell -->
        <template v-slot:body-cell-profit="props">
          <q-td :props="props">
            <div class="column items-end">
              <div class="row items-center q-gutter-xs">
                <span class="text-caption text-grey-7">NET:</span>
                <span class="text-weight-bold" :class="props.row.profit > 0 ? 'text-positive' : 'text-negative'">
                  {{ formatCurrency(props.row.profit) }}
                </span>
              </div>
              <div class="row items-center q-gutter-xs" v-if="props.row.is_sponsored">
                <span class="text-caption text-grey-7 text-weight-bold text-green-8">ADV:</span>
                <span class="text-weight-bolder text-green-9">
                  {{ formatCurrency(props.row.adv_profit) }}
                </span>
              </div>
              <div v-else class="text-caption text-grey-5">No Sponsorship</div>
            </div>
          </q-td>
        </template>

        <!-- Status Cell -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div class="column items-center">
              <q-chip
                :color="getStatusColor(props.row.status) + '-1'"
                :text-color="getStatusColor(props.row.status)"
                dense
                class="text-weight-bold text-uppercase text-caption q-px-sm"
              >
                {{ props.row.status }}
              </q-chip>
              <div v-if="props.row.is_sponsored" class="q-mt-xs">
                <q-badge color="green-2" text-color="green-9" label="SPONSORED" size="sm" class="text-weight-bolder" />
              </div>
            </div>
          </q-td>
        </template>

        <!-- Actions Cell -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs justify-end">
              <q-btn flat round dense color="green-8" icon="las la-bullhorn" @click="sponsorListing(props.row)">
                <q-tooltip>Sponsor Listing</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="primary" icon="las la-pen" @click="editListing(props.row)">
                <q-tooltip>Edit Details</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteListing(props.row)">
                <q-tooltip>Delete Listing</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Bulk Actions Floating Bar -->
    <q-page-sticky position="bottom" :offset="[0, 20]" v-if="selected.length > 0">
      <q-card class="bulk-bar shadow-10 bg-primary text-white">
        <q-card-section class="q-py-sm q-px-lg">
          <div class="row items-center no-wrap">
            <div class="row items-center q-mr-xl">
              <q-avatar size="28px" color="white" text-color="primary" class="text-weight-bold q-mr-sm">
                {{ selected.length }}
              </q-avatar>
              <div class="text-subtitle2">Items Selected</div>
            </div>

            <q-separator vertical dark class="q-mx-md opacity-20" />

            <div class="row items-center q-gutter-md">
              <q-btn flat no-caps icon="las la-bullhorn" label="Bulk Sponsor" @click="bulkSponsor" />
              <q-btn flat no-caps icon="las la-pen" label="Bulk Edit" @click="bulkEdit" />
              <q-btn flat no-caps icon="las la-trash-alt" label="Bulk Delete" color="red-2" @click="bulkDelete" />
              <q-btn flat no-caps icon="las la-times-circle" label="Remove Sponsorship" @click="bulkRemoveSponsor" />
            </div>

            <q-space />
            <q-btn flat round icon="close" @click="selected = []" />
          </div>
        </q-card-section>
      </q-card>
    </q-page-sticky>

    <!-- Sponsorship Dialog -->
    <q-dialog v-model="showSponsorDialog">
      <q-card style="width: 400px; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Sponsor Listing</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body2 text-grey-6">Set your eBay Promoted Listings ad rate. This percentage will be deducted from your sale price upon successful sale via promotion.</p>
          <q-input
            v-model.number="sponsorData.ad_rate"
            type="number"
            label="Ad Rate (%)"
            outlined
            suffix="%"
            hint="Recommended: 2.0% - 10.0%"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated label="Apply Sponsorship" color="green-8" @click="applySponsorship" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Listing Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="width: 600px; max-width: 90vw; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Edit Listing Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="editData.title" label="Title" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model.number="editData.price" type="number" label="Selling Price" outlined dense prefix="€" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model.number="editData.stock" type="number" label="Stock Quantity" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model.number="editData.ad_rate" type="number" label="Ad Rate (%)" outlined dense suffix="%" />
          </div>
          <div class="col-12">
            <q-input v-model="editData.description" type="textarea" label="Description" outlined dense rows="5" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated label="Save Changes" color="primary" @click="saveListingEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Bulk Edit Dialog -->
    <q-dialog v-model="showBulkEditDialog">
      <q-card style="width: 450px; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Bulk Price Adjustment</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body2 text-grey-6">Adjust the selling price of {{ selected.length }} items by a percentage or fixed amount.</p>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="bulkEditData.price_change_type"
                :options="[{label: 'Percentage (%)', value: 'PERCENT'}, {label: 'Fixed Amount (€)', value: 'FIXED'}]"
                label="Adjustment Type"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12">
              <q-input
                v-model.number="bulkEditData.price_change_value"
                type="number"
                label="Value"
                outlined
                dense
                :hint="bulkEditData.price_change_type === 'PERCENT' ? 'e.g., 5 for +5%, -3 for -3%' : 'e.g., 2 for +2€, -1.5 for -1.5€'"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated label="Apply Bulk Changes" color="primary" @click="saveBulkEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted, computed, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

export default {
  name: 'InventoryListPage',
  setup() {
    const $q = useQuasar();
    const inventory = ref([]);
    const selected = ref([]);
    const loading = ref(false);
    const showFilters = ref(false);
    const showSponsorDialog = ref(false);
    const showEditDialog = ref(false);
    const showBulkEditDialog = ref(false);

    const filters = reactive({
      region: null,
      status: null,
      min_views: null,
      max_dws: null,
      is_sponsored: false,
      search: ''
    });

    const sponsorData = reactive({
      groupIds: [],
      ad_rate: 2.0
    });

    const editData = reactive({
      id: null,
      title: '',
      price: 0,
      stock: 0,
      ad_rate: 0,
      description: ''
    });

    const bulkEditData = reactive({
      groupIds: [],
      price_change_type: 'PERCENT',
      price_change_value: 0
    });

    const pagination = ref({
      sortBy: 'upload_date',
      descending: true,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0
    });

    const isDark = computed(() => $q.dark.isActive);

    // Derived stats
    const highDwsCount = computed(() => inventory.value.filter(i => i.dws > 30).length);
    const sponsoredCount = computed(() => inventory.value.filter(i => i.is_sponsored).length);
    const totalViews = computed(() => inventory.value.reduce((sum, i) => sum + i.views, 0));

    const columns = [
      { name: 'product', align: 'left', label: 'Product & Store', field: 'title', sortable: true },
      { name: 'performance', align: 'center', label: 'Performance (Monthly)', field: 'views', sortable: true },
      { name: 'stock', align: 'center', label: 'Stock', field: 'stock', sortable: true },
      { name: 'price', align: 'right', label: 'Price (SELL)', field: 'price', sortable: true },
      { name: 'profit', align: 'right', label: 'Profit (Net/ADV)', field: 'profit', sortable: true },
      { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
      { name: 'actions', align: 'right', label: 'Actions' }
    ];

    const fetchInventory = async (props) => {
      loading.value = true;
      try {
        const { page, rowsPerPage } = props?.pagination || pagination.value;
        
        const res = await api.get('/products/inventory', {
          params: {
            page,
            page_size: rowsPerPage,
            ...filters
          }
        });

        inventory.value = res.data.data.items;
        pagination.value.rowsNumber = res.data.data.total_count;
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;

      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to fetch inventory' });
      } finally {
        loading.value = false;
      }
    };

    const onRequest = (props) => {
      fetchInventory(props);
    };

    const resetFilters = () => {
      Object.assign(filters, {
        region: null,
        status: null,
        min_views: null,
        max_dws: null,
        is_sponsored: false,
        search: ''
      });
      fetchInventory();
    };

    const sponsorListing = (row) => {
      sponsorData.groupIds = [row.id];
      sponsorData.ad_rate = row.ad_rate || 2.0;
      showSponsorDialog.value = true;
    };

    const bulkSponsor = () => {
      sponsorData.groupIds = selected.value.map(s => s.id);
      sponsorData.ad_rate = 2.0;
      showSponsorDialog.value = true;
    };

    const applySponsorship = async () => {
      try {
        $q.loading.show({ message: 'Applying sponsorship on eBay...' });
        await api.post('/products/inventory/sponsor', {
          groupIds: sponsorData.groupIds,
          ad_rate: sponsorData.ad_rate
        });
        
        $q.notify({ color: 'positive', message: `Successfully sponsored ${sponsorData.groupIds.length} listings.` });
        showSponsorDialog.value = false;
        selected.value = [];
        fetchInventory();
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to apply sponsorship.' });
      } finally {
        $q.loading.hide();
      }
    };

    const deleteListing = (row) => {
      $q.dialog({
        title: 'Delete Listing',
        message: `Are you sure you want to delete "${row.title}"? This will attempt to remove the listing from eBay.`,
        cancel: true,
        ok: { color: 'negative', label: 'Delete' }
      }).onOk(async () => {
        try {
          await api.post('/products/inventory/delete', { groupIds: [row.id] });
          $q.notify({ color: 'positive', message: 'Listing deletion queued.' });
          fetchInventory();
        } catch (e) {
          console.error(e);
          $q.notify({ color: 'negative', message: 'Failed to delete listing.' });
        }
      });
    };

    const bulkDelete = () => {
      $q.dialog({
        title: 'Bulk Delete',
        message: `Delete ${selected.value.length} listings from inventory and eBay?`,
        cancel: true,
        ok: { color: 'negative', label: 'Delete All' }
      }).onOk(async () => {
        try {
          await api.post('/products/inventory/delete', { groupIds: selected.value.map(s => s.id) });
          $q.notify({ color: 'positive', message: 'Bulk deletion queued.' });
          selected.value = [];
          fetchInventory();
        } catch (e) {
          console.error(e);
          $q.notify({ color: 'negative', message: 'Bulk deletion failed.' });
        }
      });
    };

    const editListing = (row) => {
      Object.assign(editData, {
        id: row.id,
        title: row.title,
        price: row.price,
        stock: row.stock,
        ad_rate: row.ad_rate,
        description: row.description || ''
      });
      showEditDialog.value = true;
    };

    const saveListingEdit = async () => {
      try {
        $q.loading.show({ message: 'Saving changes and syncing with eBay...' });
        await api.patch(`/products/inventory/${editData.id}`, editData);
        $q.notify({ color: 'positive', message: 'Listing updated successfully.' });
        showEditDialog.value = false;
        fetchInventory();
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to update listing.' });
      } finally {
        $q.loading.hide();
      }
    };

    const bulkEdit = () => {
      bulkEditData.groupIds = selected.value.map(s => s.id);
      bulkEditData.price_change_value = 0;
      showBulkEditDialog.value = true;
    };

    const saveBulkEdit = async () => {
      try {
        $q.loading.show({ message: 'Applying bulk updates...' });
        await api.post('/products/inventory/bulk-update', bulkEditData);
        $q.notify({ color: 'positive', message: `Bulk updated ${selected.value.length} listings.` });
        showBulkEditDialog.value = false;
        selected.value = [];
        fetchInventory();
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Bulk update failed.' });
      } finally {
        $q.loading.hide();
      }
    };

    const bulkRemoveSponsor = () => {
      $q.dialog({
        title: 'Remove Sponsorship',
        message: `Remove Promoted Listings sponsorship from ${selected.value.length} items?`,
        cancel: true,
        ok: { color: 'warning', label: 'Remove' }
      }).onOk(async () => {
        try {
          await api.post('/products/inventory/sponsor', {
            groupIds: selected.value.map(s => s.id),
            is_sponsored: false
          });
          $q.notify({ color: 'positive', message: 'Sponsorship removal queued.' });
          selected.value = [];
          fetchInventory();
        } catch (e) {
          console.error(e);
          $q.notify({ color: 'negative', message: 'Failed to remove sponsorship.' });
        }
      });
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'positive';
        case 'error': return 'negative';
        case 'publishing': return 'info';
        default: return 'grey';
      }
    };

    const formatCurrency = (val) => {
      return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);
    };

    const openExternalLink = (url) => {
      window.open(url, '_blank');
    };

    onMounted(() => {
      fetchInventory();
    });

    return {
      inventory,
      columns,
      loading,
      selected,
      isDark,
      pagination,
      filters,
      showFilters,
      fetchInventory,
      onRequest,
      resetFilters,
      // Actions
      sponsorListing,
      bulkSponsor,
      showSponsorDialog,
      sponsorData,
      applySponsorship,
      deleteListing,
      bulkDelete,
      editListing,
      showEditDialog,
      editData,
      saveListingEdit,
      bulkEdit,
      showBulkEditDialog,
      bulkEditData,
      saveBulkEdit,
      bulkRemoveSponsor,
      // Helpers
      getStatusColor,
      formatCurrency,
      highDwsCount,
      sponsoredCount,
      totalViews,
      openExternalLink
    };
  }
};
</script>

<style lang="scss" scoped>
.table-card {
  border-radius: 16px;
  overflow: hidden;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
}

.border-orange { border-left: 4px solid $orange-9; }
.border-green { border-left: 4px solid $green-9; }
.border-blue { border-left: 4px solid $blue-9; }

.filter-card {
  border-radius: 12px;
  background: rgba($primary, 0.02);
}

.bulk-bar {
  border-radius: 50px;
  min-width: 800px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.inventory-table {
  :deep(th) {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: $grey-7;
  }
}

.opacity-20 { opacity: 0.2; }
</style>
