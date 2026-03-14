<template>
  <div class="q-pa-md q-pa-md-xl">

    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">Dashboard</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">Welcome back, here is what's happening today.</p>
      </div>
      <q-btn color="primary" icon="las la-cloud-download-alt" label="Export Report" unelevated />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(kpi, index) in kpis" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card q-pa-md" flat>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle2 text-grey-6 text-uppercase">{{ kpi.title }}</div>
            <q-avatar :color="kpi.color + '-1'" :text-color="kpi.color" size="38px" rounded>
              <q-icon :name="kpi.icon" size="20px" />
            </q-avatar>
          </div>
          <div class="text-h4 text-weight-bold">{{ kpi.value }}</div>
          <div class="text-caption q-mt-sm row items-center" :class="kpi.trendUp ? 'text-positive' : 'text-negative'">
            <q-icon :name="kpi.trendUp ? 'las la-arrow-up' : 'las la-arrow-down'" class="q-mr-xs" />
            {{ kpi.trend }} vs last month
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">

      <div class="col-12 col-lg-8">
        <q-card flat class="q-pa-md full-height">
          <div class="text-h6 q-mb-lg text-weight-medium">Revenue Overview</div>
          <base-chart
            type="area"
            height="350"
            :options="chartOptions"
            :series="chartSeries"
          />
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat class="q-pa-md full-height">
          <div class="text-h6 q-mb-lg text-weight-medium">Recent Activity</div>

          <q-list class="activity-feed">
            <q-item v-for="activity in activities" :key="activity.id" class="q-px-none q-mb-sm">
              <q-item-section avatar top>
                <q-avatar size="40px" :color="activity.color + '-1'" :text-color="activity.color">
                  <q-icon :name="activity.icon" size="20px" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ activity.title }}</q-item-label>
                <q-item-label caption lines="2" class="text-grey-6">
                  {{ activity.description }}
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{ activity.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn flat color="primary" label="View All Activity" class="full-width q-mt-md" />
        </q-card>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import BaseChart from 'src/components/base/BaseChart.vue'
import { LocalStorage, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

export default {
  name: 'PageDashboard',
  components: {
    BaseChart
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const kpis = ref([
      { title: 'Total Revenue', value: '$0', icon: 'las la-wallet', color: 'primary', trend: '+0%', trendUp: true },
      { title: 'Active Regions', value: '0', icon: 'las la-globe', color: 'secondary', trend: 'Global', trendUp: true },
      { title: 'Most Used Supplier', value: '...', icon: 'las la-truck', color: 'positive', trend: 'Live', trendUp: true },
      { title: 'Total Profiles', value: '0', icon: 'las la-layer-group', color: 'warning', trend: 'Active', trendUp: true }
    ]);

    const checkEbayConnection = async () => {
      const CACHE_KEY = 'admin_ebay_connected';
      const CACHE_EXPIRY_KEY = 'admin_ebay_connected_expiry';
      const cachedStatus = LocalStorage.getItem(CACHE_KEY);
      const expiry = LocalStorage.getItem(CACHE_EXPIRY_KEY);

      // If cached and not expired (24h), skip check
      if (cachedStatus === true && expiry && Date.now() < expiry) {
        return;
      }

      try {
        const res = await api.get('/admin/ebay/status');
        if (res.data && res.data.connected && !res.data.is_expired) {
          // Cache status for 24 hours
          LocalStorage.set(CACHE_KEY, true);
          LocalStorage.set(CACHE_EXPIRY_KEY, Date.now() + 24 * 60 * 60 * 1000);
        } else {
          LocalStorage.set(CACHE_KEY, false);
          $q.notify({
            type: 'warning',
            message: 'Admin eBay account not connected. Redirecting to settings...',
            timeout: 3000
          });
          router.push('/admin/settings');
        }
      } catch (e) {
        console.error('Failed to check eBay connection', e);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics/stats');
        const data = res.data;

        kpis.value[1].value = data.activeRegions;
        kpis.value[2].value = data.mostUsedSupplier;
        kpis.value[3].value = data.totalProfiles;
      } catch (e) {
        console.error('Failed to fetch admin stats',e);
      }
    };

    onMounted(async () => {
      await checkEbayConnection();
      fetchStats();
    });

    return {
      kpis,
      activities: [
        { id: 1, title: 'New Order #4219', description: 'Michael Scott purchased Dunder Mifflin Premium Plan.', time: '5m ago', icon: 'las la-shopping-cart', color: 'primary' },
        { id: 2, title: 'Server Reboot', description: 'Automated maintenance completed successfully.', time: '2h ago', icon: 'las la-server', color: 'positive' },
        { id: 3, title: 'User Reported Bug', description: 'Ticket #882 created regarding login issues.', time: '4h ago', icon: 'las la-bug', color: 'negative' },
        { id: 4, title: 'Daily Backup', description: 'Database backup completed to AWS S3.', time: '1d ago', icon: 'las la-database', color: 'info' }
      ],
      chartSeries: [{
        name: 'Revenue',
        data: [3100, 4000, 2800, 5100, 4200, 10900, 10000]
      }],
      chartOptions: {
        chart: { type: 'area', fontFamily: 'Inter, sans-serif' },
        colors: ['#6366F1'], // Matches our Primary token
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
          type: 'gradient',
          gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 90, 100] }
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisBorder: { show: false },
          axisTicks: { show: false }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.kpi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
  }
}

// Ensure the border radius scales cleanly down the activity feed
.activity-feed .q-avatar {
  border-radius: $radius-sm;
}
</style>
