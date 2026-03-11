<template>
  <q-page padding class="bg-page">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none tracking-tight">Product Drafts</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Optimize and prepare your listings before publishing to eBay.</p>
    </div>

    <!-- Table Card -->
    <q-card flat bordered class="table-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white border-light'">
      <q-table
        :rows="drafts"
        :columns="columns"
        row-key="id"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        flat
        class="admin-table"
        :pagination="pagination"
      >
        <!-- Top Controls -->
        <template v-slot:top>
          <div class="row full-width items-center justify-between q-gutter-y-md">
            <div class="text-h6 text-weight-bold">
              All Drafts
              <q-badge v-if="drafts.length > 0" color="primary" class="q-ml-sm">{{ drafts.length }}</q-badge>
            </div>

            <div class="row items-center q-gutter-sm">
              <q-btn
                color="primary"
                icon="las la-plus"
                label="Add ASIN List"
                unelevated
                @click="showAsinDialog = true"
              />
              <q-btn
                color="secondary"
                icon="las la-file-upload"
                label="Import CSV"
                unelevated
                @click="showCsvImportDialog = true"
              />
              <q-btn
                flat
                round
                dense
                icon="las la-sync"
                @click="fetchDrafts"
                :loading="loading"
              />
            </div>
          </div>
        </template>

        <!-- Product Cell -->
        <template v-slot:body-cell-product="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar rounded size="48px" class="q-mr-md border shadow-sm">
                <img :src="props.row.group.images[0]?.url || 'https://cdn.quasar.dev/img/placeholder.png'" />
              </q-avatar>
              <div class="column">
                <div class="text-weight-bold text-primary ellipsis" style="max-width: 300px">
                  {{ props.row.group.title }}
                </div>
                <div class="text-caption text-grey-6 row items-center">
                  <q-icon name="las la-warehouse" size="14px" class="q-mr-xs" />
                  {{ props.row.group.supplier }} • {{ props.row.group.region }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Price Cell -->
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <div class="column items-end">
              <div class="text-weight-bold text-dark">SELL: {{ props.row.group.price }}€</div>
              <div class="text-caption text-grey-6">BUY: {{ props.row.group.original_price }}€</div>
            </div>
          </q-td>
        </template>

        <!-- Profit Cell -->
        <template v-slot:body-cell-profit="props">
          <q-td :props="props">
            <div class="column items-center">
              <q-chip
                :color="props.row.group.profit > 0 ? 'green-1' : 'red-1'"
                :text-color="props.row.group.profit > 0 ? 'green-9' : 'red-9'"
                size="sm"
                class="text-weight-bold"
              >
                {{ props.row.group.profit }}€
              </q-chip>
            </div>
          </q-td>
        </template>

        <!-- ItemID/ASIN Cell -->
        <template v-slot:body-cell-item_id="props">
          <q-td :props="props">
            <div class="column items-center">
              <q-btn 
                flat 
                dense 
                no-caps 
                color="primary" 
                size="sm" 
                :label="props.row.group.supplier_pid"
                type="a"
                :href="props.row.group.supplier_url"
                target="_blank"
              />
              <q-btn flat dense no-caps color="grey-6" size="xs" label="See Similar" icon="las la-search" />
            </div>
          </q-td>
        </template>

        <!-- Actions Cell -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs justify-end">
              <q-btn flat round dense color="green" icon="las la-rocket" @click="publishDraft(props.row)">
                <q-tooltip>Publish to eBay</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="yellow-9" icon="las la-pen" @click="editDraft(props.row)">
                <q-tooltip>Edit Draft</q-tooltip>
              </q-btn>
              <q-btn flat round dense color="negative" icon="las la-trash-alt" @click="deleteDraft(props.row)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Bulk Actions Floating Bar -->
    <q-page-sticky position="bottom" :offset="[0, 20]" v-if="selected.length > 0">
      <q-card class="bulk-bar shadow-10" :class="isDark ? 'bg-primary-900 border-primary' : 'bg-primary text-white'">
        <q-card-section class="q-py-sm q-px-lg">
          <div class="row items-center no-wrap">
            <div class="row items-center q-mr-xl">
              <q-avatar size="28px" color="white" text-color="primary" class="text-weight-bold q-mr-sm">
                {{ selected.length }}
              </q-avatar>
              <div class="text-subtitle2">Drafts Selected</div>
            </div>

            <q-separator vertical dark class="q-mx-md opacity-20" />

            <div class="row items-center q-gutter-md">
              <q-btn flat no-caps icon="las la-rocket" label="Upload Drafts" @click="bulkPublish" />
              <q-btn flat no-caps icon="las la-trash-alt" label="Delete" color="red-2" @click="bulkDelete" />
              <q-btn flat no-caps icon="las la-calendar" label="Schedule" />
              <q-btn flat no-caps icon="lab la-ebay" label="Change eBay Account" @click="showAccountSelector = true" />
            </div>

            <q-space />
            <q-btn flat round icon="close" @click="selected = []" />
          </div>
        </q-card-section>
      </q-card>
    </q-page-sticky>

    <!-- ASIN Import Dialog -->
    <q-dialog v-model="showAsinDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 16px;">
        <q-card-section class="row items-center">
          <div class="text-h6 text-weight-bold">Import from Amazon ASINs</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body2 text-grey-6">Enter one ASIN per line. Products will be imported as drafts for the selected region.</p>
          <q-input
            v-model="asinText"
            type="textarea"
            filled
            rows="10"
            placeholder="B01LZDYR7N&#10;B01M10NQCS"
            class="q-mb-md"
          />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select 
                filled 
                v-model="importRegion" 
                label="Region" 
                :options="['IT', 'UK', 'US', 'DE']" 
                dense 
              />
            </div>
            <div class="col-6">
              <q-select 
                filled 
                v-model="selectedBuyerAccount" 
                label="Target eBay Account" 
                :options="buyerAccounts"
                option-label="account_name"
                option-value="id"
                emit-value
                map-options
                dense 
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn 
            unelevated 
            label="Start Import" 
            color="primary" 
            @click="importAsins" 
            :loading="importing"
            class="q-px-lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Account Selector Dialog (for bulk change) -->
    <q-dialog v-model="showAccountSelector">
      <q-card style="min-width: 350px">
        <q-card-section><div class="text-h6">Select eBay Account</div></q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="targetAccountId"
            :options="buyerAccounts"
            option-label="account_name"
            option-value="id"
            emit-value
            map-options
            label="eBay Account"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Apply to Selected" @click="applyAccountBulk" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

export default {
  name: 'ProductDraftsPage',
  setup() {
    const $q = useQuasar();
    const drafts = ref([]);
    const selected = ref([]);
    const loading = ref(false);
    const importing = ref(false);
    const showAsinDialog = ref(false);
    const asinText = ref('');
    const importRegion = ref('IT');
    const buyerAccounts = ref([]);
    const selectedBuyerAccount = ref(null);
    const showAccountSelector = ref(false);
    const targetAccountId = ref(null);

    const pagination = ref({
      rowsPerPage: 20
    });

    const isDark = computed(() => $q.dark.isActive);

    const columns = [
      { name: 'product', align: 'left', label: 'Product', field: row => row.group.title, sortable: true },
      { name: 'upload_date', align: 'center', label: 'Upload Date', field: row => row.group.upload_date, sortable: true },
      { name: 'region', align: 'center', label: 'Region', field: row => row.group.region },
      { name: 'stock', align: 'center', label: 'Stock', field: row => row.group.stock, sortable: true },
      { name: 'price', align: 'right', label: 'Price (BUY/SELL)', field: row => row.group.price, sortable: true },
      { name: 'profit', align: 'center', label: 'Profit', field: row => row.group.profit, sortable: true },
      { name: 'item_id', align: 'center', label: 'ItemID / ASIN', field: row => row.group.supplier_pid },
      { name: 'actions', align: 'right', label: 'Actions' }
    ];

    const fetchDrafts = async () => {
      loading.value = true;
      try {
        const res = await api.get('/products');
        drafts.value = res.data.data.items;
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to fetch drafts' });
      } finally {
        loading.value = false;
      }
    };

    const fetchAccounts = async () => {
      try {
        const res = await api.get('/buyer-accounts');
        buyerAccounts.value = res.data;
        if (buyerAccounts.value.length > 0) {
          selectedBuyerAccount.value = buyerAccounts.value[0].id;
        }
      } catch (e) {
        console.error(e);
      }
    };

    const importAsins = async () => {
      if (!asinText.value.trim()) return;
      
      const asins = asinText.value.split('\n').map(s => s.trim()).filter(s => s);
      if (asins.length === 0) return;

      importing.value = true;
      try {
        await api.post('/products/import-asins', {
          asins,
          region: importRegion.value,
          buyerAccountId: selectedBuyerAccount.value
        });
        $q.notify({ color: 'positive', message: `Successfully queued ${asins.length} ASINs for import.` });
        showAsinDialog.value = false;
        asinText.value = '';
        fetchDrafts();
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Import failed.' });
      } finally {
        importing.value = false;
      }
    };

    const publishDraft = async (row) => {
      $q.dialog({
        title: 'Publish to eBay',
        message: 'This will move the product to inventory and upload it to the live eBay store. Continue?',
        cancel: true,
        ok: { label: 'Publish', color: 'green' }
      }).onOk(async () => {
        try {
          await api.post('/products/publish', {
            groupIds: [row.id],
            buyerAccountId: row.group.myebayid
          });
          $q.notify({ color: 'positive', message: 'Publishing started.' });
          fetchDrafts();
        } catch (e) {
          console.error(e);
          $q.notify({ color: 'negative', message: 'Publish failed.' });
        }
      });
    };

    const bulkPublish = async () => {
      $q.dialog({
        title: 'Bulk Publish',
        message: `Publish ${selected.value.length} products to eBay?`,
        cancel: true,
        ok: { label: 'Publish All', color: 'green' }
      }).onOk(async () => {
        try {
          await api.post('/products/publish', {
            groupIds: selected.value.map(s => s.id)
          });
          $q.notify({ color: 'positive', message: 'Bulk publishing started.' });
          selected.value = [];
          fetchDrafts();
        } catch (e) {
          console.error(e);
        }
      });
    };

    const bulkDelete = () => {
      $q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to permanently delete ${selected.value.length} drafts?`,
        cancel: true,
        ok: { color: 'negative', label: 'Delete All' }
      }).onOk(async () => {
        try {
          await api.post('/products/delete-bulk', {
            groupIds: selected.value.map(s => s.id)
          });
          $q.notify({ color: 'positive', message: 'Drafts deleted.' });
          selected.value = [];
          fetchDrafts();
        } catch (e) {
          console.error(e);
        }
      });
    };

    const applyAccountBulk = () => {
      // Logic to change target account locally or via API
      $q.notify({ message: 'Account updated for selected drafts (Simulated)', color: 'info' });
    };

    onMounted(() => {
      fetchDrafts();
      fetchAccounts();
    });

    return {
      drafts,
      columns,
      loading,
      selected,
      isDark,
      pagination,
      fetchDrafts,
      publishDraft,
      bulkPublish,
      bulkDelete,
      // ASIN Dialog
      showAsinDialog,
      asinText,
      importRegion,
      importing,
      importAsins,
      buyerAccounts,
      selectedBuyerAccount,
      // Account Selector
      showAccountSelector,
      targetAccountId,
      applyAccountBulk
    };
  }
};
</script>

<style lang="scss" scoped>
.table-card {
  border-radius: 16px;
  overflow: hidden;
}

.bulk-bar {
  border-radius: 50px;
  min-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.opacity-20 { opacity: 0.2; }

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
