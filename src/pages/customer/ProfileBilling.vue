<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Profile & Billing</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your subscription, billing details, and credits.</p>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Your Plan -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card full-height">
          <q-card-section>
            <div class="row items-center justify-between q-mb-lg">
              <div class="row items-center">
                <q-icon name="las la-crown" color="primary" size="24px" class="q-mr-sm" />
                <div class="text-h6 text-weight-medium">Your Plan</div>
              </div>
              <q-chip color="primary-1" text-color="primary" class="text-weight-bold">
                {{ currentPlan.name }}
              </q-chip>
            </div>

            <div class="plan-details q-mb-xl">
              <div class="text-h3 text-weight-bold">{{ currentPlan.price }}€<span class="text-body2 text-grey-6">/month</span></div>
              <p class="text-body2 text-grey-6 q-mt-sm">Next renewal: {{ nextRenewal }}</p>
              
              <q-list dense padding class="q-mt-md">
                <q-item v-for="feat in currentPlan.features" :key="feat">
                  <q-item-section avatar min-width="24px">
                    <q-icon name="las la-check" color="positive" size="18px" />
                  </q-item-section>
                  <q-item-section class="text-grey-8">{{ feat }}</q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12"><q-btn color="primary" label="Upgrade Plan" unelevated class="full-width" /></div>
              <div class="col-12"><q-btn color="negative" flat label="Cancel Subscription" class="full-width" /></div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Credit Balance -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card full-height">
          <q-card-section>
            <div class="row items-center q-mb-lg">
              <q-icon name="las la-wallet" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Credit Balance</div>
            </div>

            <div class="row q-col-gutter-md q-mb-xl">
              <div class="col-6">
                <div class="border rounded-sm q-pa-md text-center">
                  <div class="text-h4 text-weight-bold color-primary">{{ credits.monthly }}</div>
                  <div class="text-caption text-grey-6 uppercase">Monthly Credits</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border rounded-sm q-pa-md text-center">
                  <div class="text-h4 text-weight-bold color-secondary">{{ credits.extra }}</div>
                  <div class="text-caption text-grey-6 uppercase">Extra Credits</div>
                </div>
              </div>
            </div>

            <div class="text-body2 text-grey-7 q-mb-md">
              Monthly credits reset at the end of each billing cycle. Extra credits never expire.
            </div>

            <q-btn color="secondary" label="Purchase Extra Credits" icon="las la-plus" unelevated class="full-width" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Contact Information -->
      <div class="col-12 col-md-12">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-lg">
              <q-icon name="las la-address-card" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Contact & Billing Information</div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input filled v-model="billing.company" label="Company Name" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="billing.vat" label="VAT Number" />
              </div>
              <div class="col-12 col-md-8">
                <q-input filled v-model="billing.address" label="Billing Address" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="billing.zip" label="Postal Code" />
              </div>
              <div class="col-12 col-md-12 text-right">
                <q-btn color="primary" label="Save Billing Info" unelevated @click="saveBilling" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Credit History -->
      <div class="col-12">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center justify-between q-mb-lg">
              <div class="row items-center">
                <q-icon name="las la-history" color="primary" size="24px" class="q-mr-sm" />
                <div class="text-h6 text-weight-medium">Credit Usage History</div>
              </div>
              <q-btn flat color="primary" icon="las la-file-csv" label="Export History" size="sm" />
            </div>

            <q-table
              flat
              bordered
              :rows="history"
              :columns="columns"
              row-key="id"
              class="history-table"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Export Data -->
      <div class="col-12">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-lg">
              <q-icon name="las la-download" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Export Account Data</div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-btn outline color="primary" class="full-width" icon="las la-box" label="Export Listings (.csv)" />
              </div>
              <div class="col-12 col-md-4">
                <q-btn outline color="primary" class="full-width" icon="las la-receipt" label="Export Orders (.csv)" />
              </div>
              <div class="col-12 col-md-4">
                <q-btn outline color="primary" class="full-width" icon="las la-times-circle" label="Export Cancellations (.csv)" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
  name: 'ProfileBilling',
  setup() {
    const $q = useQuasar();

    const currentPlan = reactive({
      name: 'Advanced',
      price: 49.99,
      features: [
        'Up to 1000 Products',
        'Unlimited Orders',
        'Bulk Listing Tools',
        '24/7 Priority Support'
      ]
    });

    const nextRenewal = ref('April 10, 2026');

    const credits = reactive({
      monthly: 42,
      extra: 15
    });

    const billing = reactive({
      company: 'My Store Ltd',
      vat: 'IT12345678901',
      address: 'Via Roma 123',
      zip: '00100'
    });

    const history = ref([
      { id: 1, date: '2026-03-09', action: 'Tracking Conversion', cost: 1.5, order: '#ORD-9921', status: 'Completed' },
      { id: 2, date: '2026-03-08', action: 'Tracking Conversion', cost: 1.5, order: '#ORD-9918', status: 'Completed' },
      { id: 3, date: '2026-03-05', action: 'Tracking Conversion', cost: 1.2, order: '#ORD-9855', status: 'Completed' },
    ]);

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
      { name: 'action', label: 'Action', field: 'action', align: 'left' },
      { name: 'order', label: 'Order ID', field: 'order', align: 'left' },
      { name: 'cost', label: 'Credits', field: 'cost', align: 'center' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
    ];

    const saveBilling = () => {
      $q.notify({
        message: 'Billing information updated',
        color: 'positive',
        icon: 'las la-check'
      });
    };

    return {
      currentPlan,
      nextRenewal,
      credits,
      billing,
      history,
      columns,
      saveBilling
    };
  }
};
</script>

<style lang="scss" scoped>
.settings-card {
  border-radius: $radius-base;
  box-shadow: $shadow-1;
}

.history-table {
  background: transparent;
  :deep(thead tr th) {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: $grey-6;
  }
}
</style>
