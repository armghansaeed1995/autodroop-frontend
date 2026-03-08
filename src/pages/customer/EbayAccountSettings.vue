<template>
  <q-page padding class="bg-page">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-btn flat round icon="las la-arrow-left" color="grey-7" @click="$router.back()" class="q-mr-sm" />
        <div>
          <h1 class="text-h4 text-weight-bold q-my-none">Account Settings</h1>
          <p class="text-body2 text-grey-6 q-mt-xs">
            Manage settings for <span class="text-primary text-weight-bold">{{ region }}</span> 
            on <span class="text-primary text-weight-bold">{{ supplierName }}</span>
          </p>
        </div>
      </div>
      <div>
        <q-btn
          unelevated
          color="primary"
          icon="las la-save"
          label="Save Settings"
          :loading="saving"
          @click="saveSettings"
          class="q-px-lg"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-card v-else flat bordered class="no-border-radius overflow-hidden shadow-1">
      <div class="row no-wrap" style="min-height: 700px">
        <!-- Sidebar Tabs -->
        <div class="col-auto border-right bg-grey-1" style="width: 220px">
          <q-tabs
            v-model="activeTab"
            vertical
            active-color="primary"
            indicator-color="primary"
            class="text-grey-7"
          >
            <q-tab name="general" icon="las la-cog" label="General Import" class="q-py-md text-left" />
            <q-tab name="pricing" icon="las la-tag" label="Pricing & Stock" class="q-py-md text-left" />
            <q-tab name="messages" icon="las la-comment-alt" label="Auto Messages" class="q-py-md text-left" />
            <q-tab name="marketing" icon="las la-bullhorn" label="eBay Marketing" class="q-py-md text-left" />
            <q-tab name="policies" icon="las la-shield-alt" label="Shipping & Returns" class="q-py-md text-left" />
            <q-tab name="tax" icon="las la-file-invoice-dollar" label="Tax & VAT" class="q-py-md text-left" />
          </q-tabs>
        </div>

        <!-- Tab Content -->
        <div class="col bg-white">
          <q-tab-panels v-model="activeTab" animated vertical class="full-height">
            <!-- General Settings -->
            <q-tab-panel name="general" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">General Import Rules</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Unique Imports Only</q-item-label>
                        <q-item-label caption>Do not import products already in your store</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.import_unique_only" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Always Import Variants</q-item-label>
                        <q-item-label caption>Include all size/color variations</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.always_import_variants" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">GPSR Compliant Only</q-item-label>
                        <q-item-label caption>Only import verified compliant products</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.gpsr_compliant_only" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Remove Brand Title</q-item-label>
                        <q-item-label caption>Strip original brand names from titles</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.remove_brand_from_title" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Title Optimization</q-item-label>
                        <q-item-label caption>Apply AI-driven title improvements</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.smart_title_optimization" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Template Descriptions</q-item-label>
                        <q-item-label caption>Use custom HTML description templates</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.use_template_description" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md bg-blue-1">
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-blue-9">Auto-Order Automation</q-item-label>
                        <q-item-label caption>Automatically fulfill orders on Amazon after 10 mins</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.general.auto_order_enabled" color="blue-9" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.general.min_import_price" label="Min Import Price" type="number" filled dense prefix="€" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.general.max_import_price" label="Max Import Price" type="number" filled dense prefix="€" />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Pricing Settings -->
            <q-tab-panel name="pricing" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">Pricing & Inventory Sync</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Stock Monitoring</q-item-label>
                        <q-item-label caption>Automatically update stock levels</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.pricing.stock_monitoring" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Price Monitoring</q-item-label>
                        <q-item-label caption>Reprice when supplier price changes</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.pricing.price_monitoring" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model.number="form.pricing.default_stock" label="Default Stock" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model.number="form.pricing.max_delivery_days" label="Max Delivery Days" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select v-model="form.pricing.variation_type" :options="['PERCENT', 'UNIT']" label="Variation Type" filled dense />
                  </div>
                  <div class="col-12">
                    <q-item tag="label" v-ripple class="bg-amber-1 border-amber rounded-sm q-pa-md">
                      <q-item-section side>
                        <q-checkbox v-model="form.pricing.apply_to_manual" color="amber-9" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-amber-9">Apply to all existing listings</q-item-label>
                        <q-item-label caption class="text-amber-8">Checking this will trigger a bulk update of ALL active eBay listings for this Region/Supplier combination.</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>

                <div class="text-subtitle1 q-mt-xl q-mb-md text-weight-bold">Profit Margin Tiers</div>
                <q-markup-table flat bordered dense class="q-mb-md shadow-0">
                  <thead class="bg-grey-1">
                    <tr>
                      <th class="text-left">Min Cost</th>
                      <th class="text-left">Max Cost</th>
                      <th class="text-left">Profit ({{ form.pricing.variation_type === 'PERCENT' ? '%' : '€' }})</th>
                      <th style="width: 50px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tier, index) in form.profit_tiers" :key="index">
                      <td><q-input v-model.number="tier.min_purchase_price" type="number" dense filled prefix="€" /></td>
                      <td><q-input v-model.number="tier.max_purchase_price" type="number" dense filled prefix="€" /></td>
                      <td><q-input v-model.number="tier.profit_value" type="number" dense filled :suffix="form.pricing.variation_type === 'PERCENT' ? '%' : '€'" /></td>
                      <td class="text-center">
                        <q-btn flat round color="negative" icon="las la-trash" size="sm" @click="removeTier(index)" />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-btn outline color="primary" label="Add Profit Tier" icon="las la-plus" @click="addTier" />
              </div>
            </q-tab-panel>

            <!-- Message Settings -->
            <q-tab-panel name="messages" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">Customer Notification Templates</div>
                
                <div v-for="type in messageTypes" :key="type.key" class="q-mb-xl q-pa-md border rounded-sm">
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-icon :name="type.icon" size="20px" color="primary" class="q-mr-sm" />
                      <div class="text-subtitle2 text-weight-bold">{{ type.label }}</div>
                    </div>
                    <q-toggle v-model="form.messages[type.statusKey]" color="primary" label="Enabled" />
                  </div>
                  <q-input
                    v-model="form.messages[type.key]"
                    type="textarea"
                    filled
                    dense
                    rows="3"
                    placeholder="Message content..."
                    :disable="!form.messages[type.statusKey]"
                  />
                  <div class="row q-gutter-x-sm q-mt-xs">
                    <q-chip v-for="tag in ['{customer_name}', '{order_id}', '{product_name}']" :key="tag" 
                      dense outline size="xs" color="grey-7" class="cursor-pointer" @click="addTag(type.key, tag)">
                      {{ tag }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Marketing Settings -->
            <q-tab-panel name="marketing" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">eBay Promotions & Marketing</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Auto-Sponsor</q-item-label>
                        <q-item-label caption>Automatically promote new listings</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.marketing.auto_sponsor" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Volume Discounts</q-item-label>
                        <q-item-label caption>Apply multi-buy discounts</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.marketing.volume_discount_status" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div v-if="form.marketing.volume_discount_status" class="col-12">
                    <div class="q-pa-md bg-grey-1 rounded-sm">
                      <div class="text-caption q-mb-md">Discount percentages for multiple items:</div>
                      <div class="row q-col-gutter-md">
                        <div class="col-4">
                          <q-input v-model.number="form.marketing.volume_discounts[0]" label="2 Items" type="number" filled dense suffix="%" />
                        </div>
                        <div class="col-4">
                          <q-input v-model.number="form.marketing.volume_discounts[1]" label="3 Items" type="number" filled dense suffix="%" />
                        </div>
                        <div class="col-4">
                          <q-input v-model.number="form.marketing.volume_discounts[2]" label="4+ Items" type="number" filled dense suffix="%" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Policy Settings -->
            <q-tab-panel name="policies" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">Fulfillment & Shipping Policies</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.policies.warehouse_city" label="Ship From City" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.policies.warehouse_zipcode" label="Ship From Zipcode" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.policies.handling_time" label="Handling Time (Days)" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.policies.max_return_days" label="Max Return Period (Days)" type="number" filled dense />
                  </div>
                  <div class="col-12">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Use Supplier Shipping Time</q-item-label>
                        <q-item-label caption>Dynamically adjust eBay delivery estimates based on supplier</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.policies.use_supplier_shipping_time" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Tax Settings -->
            <q-tab-panel name="tax" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h6 q-mb-md">Taxation & Invoicing</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.tax.vat_percentage" label="VAT Percentage (%)" type="number" filled dense suffix="%" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-item tag="label" v-ripple class="border rounded-sm q-pa-md">
                      <q-item-section>
                        <q-item-label class="text-weight-bold">Auto-Save Invoices</q-item-label>
                        <q-item-label caption>Automatically download and store supplier invoices</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="form.tax.auto_save_invoices" color="primary" />
                      </q-item-section>
                    </q-item>
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.tax.invoice_request_msg" type="textarea" label="Invoice Request Message" filled dense rows="3" />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

export default {
  name: 'EbayAccountSettings',
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const activeTab = ref('general');
    const loading = ref(true);
    const saving = ref(false);
    const templateId = ref(null);

    // Query Params
    const accountId = route.query.accountId;
    const region = route.query.region;
    const supplierId = route.query.supplierId;
    const supplierName = ref('Amazon'); // Default or fetch later

    const form = reactive({
      general: {},
      pricing: {},
      profit_tiers: [],
      messages: {},
      marketing: { volume_discounts: [0, 0, 0] },
      policies: {},
      tax: {}
    });

    const messageTypes = [
      { key: 'msg_pending', statusKey: 'msg_pending_status', label: 'Order Pending', icon: 'las la-hourglass-start' },
      { key: 'msg_ordered', statusKey: 'msg_ordered_status', label: 'Order Placed', icon: 'las la-shopping-cart' },
      { key: 'msg_shipped', statusKey: 'msg_shipped_status', label: 'Order Shipped', icon: 'las la-shipping-fast' },
      { key: 'msg_delivered', statusKey: 'msg_delivered_status', label: 'Order Delivered', icon: 'las la-check-circle' },
      { key: 'msg_cancelled', statusKey: 'msg_cancelled_status', label: 'Order Cancelled', icon: 'las la-times-circle' },
      { key: 'msg_feedback', statusKey: 'msg_feedback_status', label: 'Feedback Request', icon: 'las la-star' },
      { key: 'msg_offer', statusKey: 'msg_offer_status', label: 'Special Offer', icon: 'las la-percentage' }
    ];

    const loadSettings = async () => {
      if (!accountId || !region || !supplierId) {
        $q.notify({ color: 'negative', message: 'Missing context parameters' });
        return;
      }

      loading.value = true;
      try {
        // Fetch Supplier Name for display
        const supRes = await api.get('/suppliers');
        const supplier = supRes.data.find(s => s.id === supplierId);
        if (supplier) supplierName.value = supplier.name;

        const res = await api.get('/buyer-accounts/settings-group', {
          params: {
            buyer_account_id: accountId,
            region_code: region,
            supplier_id: supplierId
          }
        });

        const data = res.data;
        templateId.value = data.id;
        
        form.general = data.GeneralSettings || {};
        form.pricing = data.PricingSettings || {};
        form.profit_tiers = data.PricingSettings?.ProfitTiers || [];
        form.messages = data.MessageSettings || {};
        form.marketing = data.MarketingSettings || { volume_discounts: [0, 0, 0] };
        form.policies = data.PolicySettings || {};
        form.tax = data.TaxSettings || {};

        if (!form.marketing.volume_discounts) {
          form.marketing.volume_discounts = [0, 0, 0];
        }

      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to load account settings' });
      } finally {
        loading.value = false;
      }
    };

    const saveSettings = async () => {
      saving.value = true;
      try {
        await api.put(`/buyer-accounts/settings-group/${templateId.value}`, form);
        $q.notify({ 
          color: 'positive', 
          message: 'Settings saved successfully', 
          icon: 'las la-check',
          position: 'top'
        });
      } catch (e) {
        $q.notify({ color: 'negative', message: 'Failed to save settings' });
      } finally {
        saving.value = false;
      }
    };

    const addTier = () => {
      form.profit_tiers.push({ min_purchase_price: 0, max_purchase_price: 0, profit_value: 0 });
    };

    const removeTier = (index) => {
      form.profit_tiers.splice(index, 1);
    };

    const addTag = (field, tag) => {
      if (!form.messages[field]) form.messages[field] = '';
      form.messages[field] += ` ${tag}`;
    };

    onMounted(loadSettings);

    return {
      activeTab,
      loading,
      saving,
      templateId,
      region,
      supplierName,
      form,
      messageTypes,
      saveSettings,
      addTier,
      removeTier,
      addTag
    };
  }
}
</script>

<style lang="scss" scoped>
.max-width-800 {
  max-width: 800px;
}
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
.bg-page {
  background-color: #f8f9fb;
}
.border {
  border: 1px solid rgba(0,0,0,0.08);
}
.border-amber {
  border: 1px solid #ffc107;
}
.rounded-sm {
  border-radius: 8px;
}
.text-left {
  :deep(.q-tab__content) {
    justify-content: flex-start;
    padding-left: 20px;
  }
}
</style>
