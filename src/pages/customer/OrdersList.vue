<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">{{ $t('orders.title') }}</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">{{ $t('orders.subtitle') }}</p>
    </div>

    <q-card flat class="orders-card">
      <div class="q-pa-md row items-center justify-between q-gutter-sm">
        <div class="row items-center q-gutter-md">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-7"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            no-caps
          >
            <q-tab name="all" :label="$t('orders.tabs.all')" />
            <q-tab name="pending" :label="$t('orders.tabs.pending')">
              <q-badge v-if="pendingCount > 0" color="red" floating>{{ pendingCount }}</q-badge>
            </q-tab>
            <q-tab name="ordered" :label="$t('orders.tabs.ordered')" />
            <q-tab name="shipped" :label="$t('orders.tabs.shipped')" />
            <q-tab name="delivered" :label="$t('orders.tabs.delivered')" />
            <q-tab name="cancelled" :label="$t('orders.tabs.cancelled')" />
          </q-tabs>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-input
            v-model="filter"
            :placeholder="$t('orders.filters.searchPlaceholder')"
            dense
            outlined
            class="search-input"
          >
            <template v-slot:append>
              <q-icon name="las la-search" />
            </template>
          </q-input>
          <q-btn
            outline
            color="primary"
            icon="las la-sync-alt"
            :label="$t('orders.filters.updateOrders')"
            @click="syncOrders"
            :loading="syncing"
          />
        </div>
      </div>

      <q-separator />

      <q-table
        :rows="orders"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        @request="onRequest"
        flat
        class="orders-table"
        :filter="filter"
      >
        <!-- Product Column -->
        <template v-slot:body-cell-product="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-img
                :src="props.row.main_image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
                class="rounded-borders q-mr-md"
                style="width: 50px; height: 50px"
              />
              <div class="column">
                <div class="text-weight-bold ellipsis-2-lines text-body2" style="max-width: 250px">
                  {{ props.row.main_title || $t('orders.details.noTitle') }}
                </div>
                <div class="row items-center q-gutter-xs q-mt-xs">
                  <q-badge outline color="blue-7" size="sm">
                    {{ $t('orders.details.sku') }} {{ props.row.sku || 'N/A' }}
                  </q-badge>
                  <div class="text-caption text-grey-7">
                    {{ $t('orders.details.qty') }} {{ props.row.total_quantity }}
                  </div>
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Status Column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getOrderStatusColor(props.row.status) + '-1'"
              :text-color="getOrderStatusColor(props.row.status)"
              dense
              class="text-weight-bold text-uppercase text-caption q-px-sm"
            >
              {{ props.row.status }}
            </q-chip>
            <div v-if="props.row.tracking_issue" class="text-caption text-negative text-weight-bold q-mt-xs">
              <q-icon name="las la-exclamation-circle" /> {{ $t('orders.details.trackingIssue') }}
            </div>
          </q-td>
        </template>

        <!-- Price & Profit Column -->
        <template v-slot:body-cell-price_profit="props">
          <q-td :props="props">
            <div class="column items-end">
              <div class="row items-center q-gutter-xs">
                <span class="text-caption text-grey-7">{{ $t('orders.details.sell') }}</span>
                <span class="text-weight-bold">{{ formatPrice(props.row.total_sale_amount, props.row.currency) }}</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <span class="text-caption text-grey-7">{{ $t('orders.details.buy') }}</span>
                <span class="text-grey-9">{{ formatPrice(props.row.total_purchase_cost, props.row.currency) }}</span>
              </div>
              <q-badge
                :color="parseFloat(props.row.profit) >= 0 ? 'positive' : 'negative'"
                class="q-mt-xs text-weight-bold"
                outline
              >
                {{ $t('orders.details.profit') }} {{ formatPrice(props.row.profit, props.row.currency) }}
              </q-badge>
            </div>
          </q-td>
        </template>

        <!-- Item IDs Column -->
        <template v-slot:body-cell-item_ids="props">
          <q-td :props="props">
            <div class="column q-gutter-xs">
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                color="primary"
                class="q-px-none justify-start"
                :label="$t('orders.details.sell') + ' ' + (props.row.listing_id || 'ID')"
                icon="las la-external-link-alt"
                @click.stop="openExternalLink(props.row.listing_url || '#')"
              />
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                color="orange-8"
                class="q-px-none justify-start"
                :label="$t('orders.details.buy') + ' ' + (props.row.supplier_pid || 'ASIN')"
                icon="las la-shopping-cart"
                @click.stop="openExternalLink(props.row.supplier_url || '#')"
              />
            </div>
          </q-td>
        </template>

        <!-- Dates Column -->
        <template v-slot:body-cell-dates="props">
          <q-td :props="props">
            <div class="column">
              <div class="text-weight-medium">{{ formatDate(props.row.order_received_date) }}</div>
              <div v-if="props.row.marketplace_max_estimated_delivery_date" class="text-caption text-grey-6">
                {{ $t('orders.details.est') }} {{ formatDate(props.row.marketplace_max_estimated_delivery_date) }}
              </div>
            </div>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn outline round dense color="primary" icon="las la-eye" @click="openOrderModal(props.row)">
              <q-tooltip>{{ $t('orders.details.viewDetails') }}</q-tooltip>
            </q-btn>
            <q-btn outline round dense color="secondary" icon="las la-truck" @click="fulfillOrder(props.row)" v-if="props.row.status === 'pending'">
              <q-tooltip>{{ $t('orders.details.fulfillOrder') }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>

  <!-- Order Details Modal -->
  <q-dialog v-model="orderModal.open" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="column full-height bg-grey-1">
      <q-bar class="bg-primary text-white q-py-lg">
        <div class="text-h6">{{ $t('orders.modal.orderNum', { id: orderModal.data?.external_order_id }) }}</div>
        <q-space />
        <q-btn dense flat icon="las la-times" v-close-popup>
          <q-tooltip class="bg-white text-primary">{{ $t('common.cancel') }}</q-tooltip>
        </q-btn>
      </q-bar>

      <q-scroll-area class="col q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Left Column: Order Summary & Items -->
          <div class="col-12 col-md-8">
            <q-card flat bordered class="q-mb-md">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6 text-weight-bold">{{ $t('orders.modal.items') }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip
                    :color="getOrderStatusColor(orderModal.data?.status) + '-1'"
                    :text-color="getOrderStatusColor(orderModal.data?.status)"
                    dense
                    class="text-weight-bold"
                  >
                    {{ orderModal.data?.status }}
                  </q-chip>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-card-section>
                <div v-for="item in orderModal.data?.items" :key="item.id" class="row q-mb-md no-wrap">
                  <q-img :src="orderModal.data?.main_image" class="rounded-borders" style="width: 80px; height: 80px" />
                  <div class="col q-ml-md">
                    <div class="text-subtitle1 text-weight-bold">{{ item.title }}</div>
                    <div class="text-caption text-grey-7">{{ $t('orders.modal.itemId') }} {{ item.external_item_id }}</div>
                    <div class="row items-center justify-between q-mt-sm">
                      <div class="text-body2">{{ $t('orders.modal.quantity') }} <span class="text-weight-bold">{{ item.quantity }}</span></div>
                      <div class="text-h6 text-primary">{{ formatPrice(item.sale_price, orderModal.data?.currency) }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">{{ $t('orders.modal.statusHistory') }}</div>
                <q-timeline color="primary" dense>
                  <q-timeline-entry
                    v-for="(history, index) in orderModal.data?.status_history"
                    :key="index"
                    :title="history.title"
                    :subtitle="formatDateWithTime(history.created_at)"
                  >
                    <div v-html="history.markdown_description"></div>
                  </q-timeline-entry>
                  <q-timeline-entry v-if="!orderModal.data?.status_history || orderModal.data?.status_history.length === 0" :subtitle="$t('orders.modal.noHistory')">
                    {{ $t('orders.modal.historySubtitle') }}
                  </q-timeline-entry>
                </q-timeline>
              </q-card-section>
            </q-card>
          </div>

          <!-- Right Column: Buyer Info & Financials -->
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">{{ $t('orders.modal.buyerInfo') }}</div>
                <div class="column q-gutter-xs">
                  <div class="row justify-between">
                    <span class="text-grey-7">{{ $t('orders.modal.name') }}</span>
                    <span class="text-weight-bold">{{ orderModal.data?.buyer_full_name }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-7">{{ $t('orders.modal.username') }}</span>
                    <span class="text-primary text-weight-bold">{{ orderModal.data?.marketplace_buyer_id }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-7">{{ $t('orders.modal.phone') }}</span>
                    <span>{{ orderModal.data?.buyer_phone || 'N/A' }}</span>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="text-subtitle2 text-weight-bold q-mb-sm">{{ $t('orders.modal.shippingAddress') }}</div>
                <div class="text-body2 text-grey-9">
                  {{ orderModal.data?.shipping_street1 }}<br />
                  <span v-if="orderModal.data?.shipping_street2">{{ orderModal.data?.shipping_street2 }}<br /></span>
                  {{ orderModal.data?.shipping_city }}, {{ orderModal.data?.shipping_state_province }} {{ orderModal.data?.shipping_postal_code }}<br />
                  {{ orderModal.data?.shipping_country }}
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mb-md bg-white">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">{{ $t('orders.modal.financialSummary') }}</div>
                <div class="column q-gutter-sm">
                  <div class="row justify-between">
                    <span>{{ $t('orders.modal.totalSell') }}</span>
                    <span class="text-weight-bold">{{ formatPrice(orderModal.data?.total_sale_amount, orderModal.data?.currency) }}</span>
                  </div>
                  <div class="row justify-between text-grey-8">
                    <span>{{ $t('orders.modal.costBuy') }}</span>
                    <span>-{{ formatPrice(orderModal.data?.total_purchase_cost, orderModal.data?.currency) }}</span>
                  </div>
                  
                  <q-expansion-item
                    dense
                    dense-toggle
                    :label="$t('orders.modal.ebayFees')"
                    class="text-grey-8"
                    header-class="q-px-none"
                  >
                    <div class="column q-pl-sm q-gutter-xs text-caption">
                      <div v-for="(fee, idx) in orderModal.data?.fees" :key="idx" class="row justify-between">
                        <span>{{ formatFeeName(fee.name) }} ({{ fee.fee.value }}{{ fee.fee.type === 'percentage' ? '%' : '' }})</span>
                        <span>-{{ formatPrice(fee.amount, orderModal.data?.currency) }}</span>
                      </div>
                    </div>
                  </q-expansion-item>

                  <q-separator class="q-my-sm" />

                  <div class="row justify-between text-h6 text-weight-bolder">
                    <span :class="parseFloat(orderModal.data?.profit) >= 0 ? 'text-positive' : 'text-negative'">{{ $t('orders.modal.estProfit') }}</span>
                    <span :class="parseFloat(orderModal.data?.profit) >= 0 ? 'text-positive' : 'text-negative'">
                      {{ formatPrice(orderModal.data?.profit, orderModal.data?.currency) }}
                    </span>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">{{ $t('layout.more') }}</div>
                <div class="column q-gutter-sm">
                  <q-btn color="primary" icon="las la-truck" :label="$t('orders.details.fulfillOrder')" @click="fulfillOrder(orderModal.data)" unelevated />
                  <q-btn outline color="secondary" icon="las la-comment" :label="$t('orders.details.messageBuyer')" @click="messageBuyer(orderModal.data)" />
                  <q-btn outline color="grey-7" icon="las la-times-circle" :label="$t('orders.details.cancelOrder')" @click="cancelOrder(orderModal.data)" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'OrdersListPage',
  data() {
    return {
      activeTab: 'all',
      orders: [],
      pendingCount: 0,
      loading: false,
      syncing: false,
      filter: '',
      pagination: {
        sortBy: 'order_received_date',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 0
      },
      columns: [
        { name: 'product', label: this.$t('orders.columns.product'), align: 'left', field: 'main_title', sortable: false },
        { name: 'status', label: this.$t('orders.columns.status'), align: 'center', field: 'status', sortable: true },
        { name: 'price_profit', label: this.$t('orders.columns.priceProfit'), align: 'right', field: 'total_sale_amount', sortable: true },
        { name: 'item_ids', label: this.$t('orders.columns.itemIds'), align: 'left', field: 'listing_id', sortable: false },
        { name: 'dates', label: this.$t('orders.columns.orderDate'), align: 'left', field: 'order_received_date', sortable: true },
        { name: 'actions', label: this.$t('orders.columns.actions'), align: 'right', field: 'actions' }
      ],
      orderModal: {
        open: false,
        data: null
      }
    };
  },
  watch: {
    activeTab(newTab, oldTab) {
      if (newTab !== oldTab) {
        this.pagination.page = 1;
        this.fetchOrders();
      }
    }
  },
  async mounted() {
    await this.fetchPendingCount();
    await this.fetchOrders();
  },
  methods: {
    async fetchPendingCount() {
      try {
        const response = await this.$api.get('/orders/count/pending');
        this.pendingCount = response.data.count;
      } catch (error) {
        console.error(this.$t('orders.notifications.fetchCountError'), error);
      }
    },
    async fetchOrders() {
      this.loading = true;
      try {
        const { page, rowsPerPage } = this.pagination;
        const response = await this.$api.get('/orders', {
          params: {
            page: page,
            limit: rowsPerPage,
            tab: this.activeTab === 'all' ? null : this.activeTab
          }
        });
        this.orders = response.data.data;
        this.pagination.rowsNumber = response.data.total;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || this.$t('orders.notifications.fetchOrdersError'),
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching orders:', error);
      } finally {
        this.loading = false;
      }
    },
    onRequest(props) {
      this.pagination.page = props.pagination.page;
      this.pagination.rowsPerPage = props.pagination.rowsPerPage;
      this.pagination.sortBy = props.pagination.sortBy;
      this.pagination.descending = props.pagination.descending;
      this.fetchOrders();
    },
    async syncOrders() {
      this.syncing = true;
      try {
        // Placeholder for sync action
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.fetchOrders();
        await this.fetchPendingCount();
        this.$q.notify({
          type: 'positive',
          message: this.$t('orders.notifications.syncSuccess'),
          icon: 'las la-check-circle',
          position: 'top-right'
        });
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        this.syncing = false;
      }
    },
    getOrderStatusColor(status) {
      switch (status) {
        case 'pending':
          return 'orange-9';
        case 'supplier_error':
          return 'negative';
        case 'ordered':
          return 'primary';
        case 'shipped':
          return 'info';
        case 'delivered':
          return 'positive';
        case 'cancelled':
        case 'returned':
          return 'grey-7';
        default:
          return 'primary';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatDateWithTime(dateStr) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatPrice(amount, currency = 'EUR') {
      if (amount === undefined || amount === null) return '-';
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency
      }).format(amount);
    },
    formatFeeName(name) {
      return name.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    },
    openOrderModal(order) {
      this.orderModal.data = order;
      this.orderModal.open = true;
    },
    openExternalLink(url) {
      if (url && url !== '#') {
        window.open(url, '_blank');
      }
    },
    fulfillOrder(order) {
      this.$q.notify({
        type: 'info',
        message: this.$t('orders.notifications.fulfillStarted', { id: order.external_order_id }),
        icon: 'las la-truck'
      });
    },
    messageBuyer(order) {
       this.$q.notify({
        type: 'info',
        message: this.$t('orders.notifications.openingMessenger', { id: order.marketplace_buyer_id }),
        icon: 'las la-comment'
      });
    },
    cancelOrder(order) {
      this.$q.confirm({
        title: this.$t('orders.details.cancelOrder'),
        message: this.$t('orders.notifications.cancelConfirm', { id: order.external_order_id }),
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$q.notify({
          type: 'warning',
          message: this.$t('orders.notifications.cancelSent', { id: order.external_order_id }),
          icon: 'las la-exclamation-circle'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.orders-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.search-input {
  min-width: 300px;
}

.orders-table {
  :deep(.q-table__top) {
    padding: 0;
  }

  :deep(th) {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    color: $grey-7;
    background-color: $grey-1;
  }

  :deep(td) {
    font-size: 0.875rem;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

.rounded-borders {
  border-radius: 8px;
}
</style>


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
