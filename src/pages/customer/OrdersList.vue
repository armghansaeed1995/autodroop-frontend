<template>
  <q-page padding>
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Orders List</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">View and manage all customer orders.</p>
    </div>

    <q-card flat>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="pending" label="Pending">
          <q-badge v-if="pendingCount > 0" color="red" floating>{{ pendingCount }}</q-badge>
        </q-tab>
        <q-tab name="ordered" label="Ordered" />
        <q-tab name="shipped" label="Shipped" />
        <q-tab name="archived" label="Archived" />
      </q-tabs>

      <q-separator />

      <q-table
        :rows="orders"
        :columns="columns"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        @request="onRequest"
        flat
        class="admin-table"
      >
        <template v-slot:body-cell-external_order_id="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.external_order_id }}</div>
            <div class="text-caption text-grey-6">eBay</div>
          </q-td>
        </template>

        <template v-slot:body-cell-buyer_info="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.buyer_full_name }}</div>
            <div class="text-caption text-grey-6">{{ props.row.buyer_phone }}</div>
          </q-td>
        </template>

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
          </q-td>
        </template>

        <template v-slot:body-cell-total_sale_amount="props">
          <q-td :props="props">
            <div class="text-weight-medium">${{ parseFloat(props.row.total_sale_amount).toFixed(2) }}</div>
            <div v-if="props.row.total_purchase_cost" class="text-caption text-grey-6">
              Cost: ${{ parseFloat(props.row.total_purchase_cost).toFixed(2) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-order_received_date="props">
          <q-td :props="props">
            {{ formatDate(props.row.order_received_date) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn flat round dense color="primary" icon="las la-eye" @click="openOrderModal(props.row)">
              <q-tooltip>View Order</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'OrdersListPage',
  data() {
    return {
      activeTab: 'pending',
      orders: [],
      pendingCount: 0,
      loading: false,
      filter: '', // For general table filtering, not used for status tabs
      pagination: {
        sortBy: 'order_received_date',
        descending: true,
        page: 1,
        rowsPerPage: 20, // Default rows per page
        rowsNumber: 0 // Total rows from backend
      },
      columns: [
        { name: 'external_order_id', label: 'Order ID', align: 'left', field: 'external_order_id', sortable: true },
        { name: 'buyer_info', label: 'Buyer', align: 'left', field: 'buyer_full_name', sortable: true },
        { name: 'status', label: 'Status', align: 'center', field: 'status', sortable: true },
        { name: 'total_sale_amount', label: 'Sale Amount', align: 'right', field: 'total_sale_amount', sortable: true },
        { name: 'order_received_date', label: 'Received Date', align: 'left', field: 'order_received_date', sortable: true },
        { name: 'actions', label: 'Actions', align: 'right', field: 'actions' }
      ]
    };
  },
  watch: {
    activeTab(newTab, oldTab) {
      if (newTab !== oldTab) {
        this.pagination.page = 1; // Reset to first page when tab changes
        this.fetchOrders();
      }
    }
  },
  async mounted() {
    await this.fetchPendingCount();
    await this.fetchOrders(); // Initial fetch for the active tab
  },
  methods: {
    async fetchPendingCount() {
      try {
        const response = await this.$api.get('/orders/count/pending');
        this.pendingCount = response.data.count;
      } catch (error) {
        console.error('Failed to fetch pending order count:', error);
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
            tab: this.activeTab
          }
        });
        this.orders = response.data.data;
        this.pagination.rowsNumber = response.data.total;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to fetch orders.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching orders:', error);
      } finally {
        this.loading = false;
      }
    },
    onRequest(props) {
      // This is triggered by q-table when pagination or sorting changes
      this.pagination.page = props.pagination.page;
      this.pagination.rowsPerPage = props.pagination.rowsPerPage;
      // You can also handle sorting: this.pagination.sortBy = props.pagination.sortBy;
      // this.pagination.descending = props.pagination.descending;
      this.fetchOrders();
    },
    getOrderStatusColor(status) {
      switch (status) {
        case 'pending':
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
          return 'grey';
        default:
          return 'primary';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const locale = this.$i18n ? this.$i18n.locale : 'en-US';
      return new Date(dateStr).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    openOrderModal(order) {
      // Placeholder for opening a detailed order modal
      this.$q.notify({
        type: 'info',
        message: `Viewing order details for: ${order.external_order_id}`,
        icon: 'las la-eye',
        position: 'top-right'
      });
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
