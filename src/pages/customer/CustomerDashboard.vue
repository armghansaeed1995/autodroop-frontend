<template>
  <div class="q-pa-md q-pa-md-xl">

    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">{{ $t('customerDashboard.welcome') }}, {{ user.firstName }}!</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">{{ $t('customerDashboard.subtitle') }}</p>
      </div>
      <q-btn
        color="primary"
        icon="las la-life-ring"
        :label="$t('common.support')"
        unelevated
        class="hidden sm-and-up"
      />
      <q-btn
        color="primary"
        icon="las la-life-ring"
        round
        dense
        unelevated
        class="sm-hide md-hide lg-hide xl-hide"
      />
    </div>

    <q-inner-loading :showing="loading" :label="$t('customerDashboard.fetchingData')" label-class="text-teal" label-style="font-size: 1.1em">
      <q-spinner-gears size="50px" color="teal" />
    </q-inner-loading>

    <div class="row q-col-gutter-lg" :class="{ 'q-card--hidden': loading }">

      <div class="col-12 col-md-8">

        <q-card flat class="plan-card bg-primary text-white q-mb-lg q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-uppercase opacity-80">{{ $t('customerDashboard.currentPlan') }}</div>
              <div class="text-h4 text-weight-bold q-mt-xs">{{ subscription.planName }}</div>
              <div class="text-body2 q-mt-sm opacity-80">
                {{ $t('customerDashboard.renewsOn') }}: {{ formatDate(subscription.renewalDate) }}
              </div>
            </div>
            <div class="text-right">
              <q-icon name="las la-medal" size="64px" class="opacity-80" />
            </div>
          </div>
          <q-card-actions align="left" class="q-px-none q-pt-md q-pb-none">
            <q-btn color="white" text-color="primary" :label="$t('customerDashboard.upgradePlan')" unelevated />
            <q-btn flat color="white" :label="$t('customerDashboard.manageBilling')" class="q-ml-sm" />
          </q-card-actions>
        </q-card>

        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="q-pa-md h-100">
              <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ $t('customerDashboard.totalSales') }}</div>
              <div class="text-h5 text-weight-bold text-primary">${{ stats.totalSales.toFixed(2) }}</div>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="q-pa-md h-100">
              <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ $t('customerDashboard.totalOrders') }}</div>
              <div class="text-h5 text-weight-bold text-secondary">{{ stats.orderCount }}</div>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-card flat class="q-pa-md h-100">
              <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ $t('customerDashboard.activeListings') }}</div>
              <div class="text-h5 text-weight-bold text-info">{{ stats.activeListings }}</div>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div v-for="(stat, index) in usageStats" :key="index" class="col-12 col-sm-6">
            <q-card flat class="q-pa-md h-100">
              <div class="row items-center q-mb-md">
                <q-avatar :color="stat.color + '-1'" :text-color="stat.color" size="40px" class="q-mr-sm">
                  <q-icon :name="stat.icon" size="24px" />
                </q-avatar>
                <div class="text-subtitle1 text-weight-medium">{{ $t(stat.titleKey) }}</div>
              </div>
              <q-linear-progress :value="stat.used / stat.total" :color="stat.color" size="8px" class="rounded-borders q-mb-sm" />
              <div class="row justify-between text-caption text-grey-6">
                <span>{{ stat.used }} {{ $t('common.used') }}</span>
                <span>{{ stat.total }} {{ $t('common.total') }}</span>
              </div>
            </q-card>
          </div>
        </div>

      </div>

      <div class="col-12 col-md-4">

        <q-card flat class="q-pa-md q-mb-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-weight-medium">{{ $t('customerDashboard.recentInvoices') }}</div>
            <q-btn flat dense color="primary" :label="$t('common.viewAll')" />
          </div>

          <q-list separator>
            <q-item v-for="invoice in recentInvoices" :key="invoice.id" class="q-px-none">
              <q-item-section avatar>
                <q-avatar color="grey-2" text-color="dark" icon="las la-file-invoice-dollar" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ invoice.id }}</q-item-label>
                <q-item-label caption>{{ formatDate(invoice.date) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-weight-bold text-dark">${{ invoice.amount }}</q-item-label>
                <q-chip
                  :color="invoice.status === 'Paid' ? 'positive-1' : 'warning-1'"
                  :text-color="invoice.status === 'Paid' ? 'positive' : 'warning'"
                  dense size="sm" class="text-weight-bold"
                >
                  {{ $t(`common.statuses.${invoice.status.toLowerCase()}`) }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card flat class="q-pa-md">
          <div class="text-h6 text-weight-medium q-mb-md">{{ $t('customerDashboard.quickLinks') }}</div>
          <div class="row q-gutter-sm">
            <q-btn outline color="secondary" icon="las la-book" :label="$t('common.documentation')" class="col-grow" />
            <q-btn outline color="secondary" icon="las la-video" :label="$t('common.tutorials')" class="col-grow" />
            <q-btn outline color="secondary" icon="las la-users" :label="$t('common.community')" class="col-grow" />
          </div>
        </q-card>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageCustomerDashboard',
  data() {
    return {
      user: {
        firstName: '',
        email: '',
        role: '',
        customerId: '',
        customerStatus: ''
      },
      subscription: {
        planName: 'No Active Plan',
        renewalDate: null,
        price: 0
      },
      usageStats: [
        { titleKey: 'customerDashboard.storageUsed', icon: 'las la-hdd', color: 'primary', used: 0, total: 0 },
        { titleKey: 'customerDashboard.apiCalls', icon: 'las la-exchange-alt', color: 'secondary', used: 0, total: 0 }
      ],
      recentInvoices: [], // Will be fetched later
      loading: true, // Set to true initially for overall dashboard loading
      stats: { // New: for dashboard analytics stats
        totalSales: 0,
        orderCount: 0,
        activeListings: 0
      }
    }
  },
  async created() {
    this.loadUserData();
    console.log('User Data:', this.user);

    if (this.user.customerStatus !== 'active') {
      // If customer is not active, redirect to buy-package page
      this.$router.push('/buy-package');
      this.$q.notify({
        type: 'info',
        message: this.$t('customerDashboard.notifications.accountPending'),
        icon: 'las la-exclamation-triangle',
        position: 'top-right'
      });
    } else {
      // Fetch more detailed customer/package info if active
      await this.fetchCustomerDetails();
      await this.fetchStats(); // New: Fetch dashboard stats
    }
  },
  methods: {
    loadUserData() {
      const storedUser = this.$q.localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = storedUser;
        this.user.firstName = parsedUser.first_name || parsedUser.email.split('@')[0];
        this.user.email = parsedUser.email;
        this.user.role = parsedUser.role;
        this.user.customerId = parsedUser.customer_id;
        this.user.customerStatus = parsedUser.customer_status;
      } else {
        // Redirect to login if no user data found
        this.$router.push('/customer/login');
        this.$q.notify({
          type: 'negative',
          message: this.$t('customerDashboard.notifications.sessionExpired'),
          icon: 'las la-user-circle',
          position: 'top-right'
        });
      }
    },
    async fetchCustomerDetails() {
      // this.loading = true; // Overall loading is now managed by fetchStats
      try {
        const response = await this.$api.get(`/customers/${this.user.customerId}`);
        const customerData = response.data;
        if (customerData.Package) {
          this.subscription.planName = customerData.Package.name;
          this.subscription.price = customerData.Package.price;
          this.subscription.renewalDate = customerData.renew_date;
          this.usageStats[0].total = customerData.Package.max_products; // Example mapping
          this.usageStats[1].total = customerData.Package.max_ebay_accounts * 1000; // Example mapping
        }
        // Assuming usageStats.used would come from another API or be part of customerData
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: this.$t('customerDashboard.notifications.fetchCustomerError'),
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching customer details:', error);
      } finally {
        // this.loading = false; // Overall loading is now managed by fetchStats
      }
    },
    async fetchStats() { // New method to fetch analytics
      this.loading = true;
      try {
        const response = await this.$api.get('/analytics/dashboard-stats');
        this.stats.totalSales = response.data.totalSales;
        this.stats.orderCount = response.data.orderCount;
        this.stats.activeListings = response.data.activeListings;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || this.$t('customerDashboard.notifications.fetchStatsError'),
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching dashboard stats:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const locale = this.$i18n ? this.$i18n.locale : 'en-US';
      return new Date(dateStr).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-card {
  background: linear-gradient(135deg, $primary 0%, darken($primary, 15%) 100%);
  border-radius: $radius-base;

  .opacity-80 {
    opacity: 0.8;
  }
}

.h-100 {
  height: 100%;
}

// Ensure invoice chips scale well in dark mode
body.body--dark {
  .plan-card {
    background: linear-gradient(135deg, darken($primary, 20%) 0%, darken($primary, 40%) 100%);
    border: none;
  }

  .q-item__section--side .text-dark {
    color: white !important;
  }
}
</style>
