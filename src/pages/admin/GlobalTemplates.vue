<template>
  <q-page padding class="bg-page">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-avatar color="primary-1" text-color="primary" icon="las la-public" size="48px" class="q-mr-md" />
        <div>
          <h1 class="text-h4 text-weight-bold q-my-none">Global Master Templates</h1>
          <p class="text-body2 text-grey-6 q-mt-xs">Define the base settings that all new customer accounts will inherit.</p>
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          unelevated
          color="primary"
          icon="las la-save"
          label="Save All Changes"
          :loading="saving"
          :disable="!templateId"
          @click="saveTemplate"
          class="q-px-lg"
        />
      </div>
    </div>

    <!-- Context Selection -->
    <q-card flat bordered class="q-mb-lg shadow-sm">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedRegion"
            :options="regions"
            option-label="name"
            option-value="country_code"
            label="1. Select Global Region"
            filled
            dense
            emit-value
            map-options
            @update:model-value="loadTemplate"
          >
            <template v-slot:prepend>
              <q-icon name="las la-globe" color="primary" />
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedSupplier"
            :options="suppliers"
            option-label="name"
            option-value="id"
            label="2. Select Supplier"
            filled
            dense
            emit-value
            map-options
            @update:model-value="loadTemplate"
          >
            <template v-slot:prepend>
              <q-icon name="las la-truck" color="primary" />
            </template>
          </q-select>
        </div>
        <div v-if="templateId" class="col-12 col-md-4 text-right">
          <q-chip outline color="grey-7" icon="las la-fingerprint" size="sm">
            Group ID: {{ templateId }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Main Tabbed Interface -->
    <q-card v-else-if="templateId" flat bordered class="no-border-radius overflow-hidden shadow-1">
      <div class="row no-wrap" style="min-height: 700px">
        <!-- Vertical Sidebar Tabs (Desktop) -->
        <div class="col-auto border-right bg-grey-1 gt-sm" style="width: 240px">
          <q-tabs
            v-model="activeTab"
            vertical
            active-color="primary"
            indicator-color="primary"
            class="text-grey-7 sticky-tabs"
          >
            <q-tab name="general" icon="las la-cog" label="General Import" class="q-py-md text-left-tab" />
            <q-tab name="pricing" icon="las la-tag" label="Prices & Stock" class="q-py-md text-left-tab" />
            <q-tab name="messages" icon="las la-comment-alt" label="Auto Messages" class="q-py-md text-left-tab" />
            <q-tab name="marketing" icon="las la-bullhorn" label="Marketing" class="q-py-md text-left-tab" />
            <q-tab name="policies" icon="las la-shield-alt" label="Policies" class="q-py-md text-left-tab" />
            <q-tab name="tax" icon="las la-file-invoice-dollar" label="Taxes" class="q-py-md text-left-tab" />
          </q-tabs>
        </div>

        <!-- Horizontal Tabs (Mobile) -->
        <div class="col-12 lt-md border-bottom bg-grey-1">
          <q-tabs
            v-model="activeTab"
            active-color="primary"
            indicator-color="primary"
            class="text-grey-7"
            scrollable
          >
            <q-tab name="general" icon="las la-cog" />
            <q-tab name="pricing" icon="las la-tag" />
            <q-tab name="messages" icon="las la-comment-alt" />
            <q-tab name="marketing" icon="las la-bullhorn" />
            <q-tab name="policies" icon="las la-shield-alt" />
            <q-tab name="tax" icon="las la-file-invoice-dollar" />
          </q-tabs>
        </div>

        <!-- Scrollable Content Area -->
        <div class="col bg-white overflow-auto">
          <q-tab-panels v-model="activeTab" animated vertical class="full-height">
            <!-- 1. General Settings -->
            <q-tab-panel name="general" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h5 q-mb-md">General Import Rules</div>
                <p class="text-body2 text-grey-7 q-mb-xl">Global defaults for product discovery and import from {{ activeSupplierName }}.</p>
                
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.import_unique_only" label="Import unique products only" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.always_import_variants" label="Always import variants" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.gpsr_compliant_only" label="GPSR compliant only" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.remove_brand_from_title" label="Remove brand from title" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.smart_title_optimization" label="Smart title optimization" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.general.use_template_description" label="Use template description" color="primary" />
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

            <!-- 2. Pricing & Stock -->
            <q-tab-panel name="pricing" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h5 q-mb-md">Pricing & Inventory Monitoring</div>
                <div class="row q-col-gutter-lg q-mb-xl">
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.pricing.stock_monitoring" label="Enable Stock Monitoring" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.pricing.price_monitoring" label="Enable Price Monitoring" color="primary" />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model.number="form.pricing.default_stock" label="Default Stock" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model.number="form.pricing.max_delivery_days" label="Max Delivery Days" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input 
                      v-model="form.pricing.price_cents" 
                      label="Price Cents (Fixed)" 
                      filled 
                      dense 
                      placeholder=".99" 
                      :rules="[
                        val => !val || val.startsWith('.') || 'Must start with a dot',
                        val => !val || val.length === 3 || 'Must be like .99'
                      ]"
                    />
                  </div>
                </div>

                <profit-tiers-editor 
                  v-model="form.profit_tiers" 
                  v-model:variationType="form.pricing.variation_type"
                />
              </div>
            </q-tab-panel>

            <!-- 3. Message Settings -->
            <q-tab-panel name="messages" class="q-pa-xl">
              <div class="max-width-800">
                <message-template-editor v-model="form.messages" />
              </div>
            </q-tab-panel>

            <!-- 4. Marketing Settings -->
            <q-tab-panel name="marketing" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h5 q-mb-md">Global Marketing & Discounts</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.marketing.auto_sponsor" label="Auto-Sponsor Listings" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.marketing.volume_discount_status" label="Enable Volume Discounts" color="primary" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.marketing.sponsor_type" label="Sponsor Type" filled dense placeholder="COST_PER_CLICK" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.marketing.promo_discount_percent" label="Promo Discount (%)" type="number" filled dense suffix="%" />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- 5. Policies Settings -->
            <q-tab-panel name="policies" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h5 q-mb-md">Default Policies</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.policies.warehouse_city" label="Warehouse City" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.policies.warehouse_zipcode" label="Warehouse Zipcode" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.policies.handling_time" label="Handling Time (Days)" type="number" filled dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.policies.max_return_days" label="Max Return Period (Days)" type="number" filled dense />
                  </div>
                  <div class="col-12">
                    <q-toggle v-model="form.policies.use_supplier_shipping_time" label="Use supplier shipping time" color="primary" />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- 6. Tax Settings -->
            <q-tab-panel name="tax" class="q-pa-xl">
              <div class="max-width-800">
                <div class="text-h5 q-mb-md">Taxation & Invoicing</div>
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-input v-model.number="form.tax.vat_percentage" label="VAT Percentage (%)" type="number" filled dense suffix="%" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-toggle v-model="form.tax.auto_save_invoices" label="Auto-save Invoices" color="primary" />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </q-card>

    <!-- Empty State -->
    <div v-else class="row justify-center q-pa-xl">
      <q-banner class="bg-primary-1 text-primary rounded-sm shadow-1 q-pa-lg">
        <template v-slot:avatar>
          <q-icon name="las la-mouse-pointer" size="40px" />
        </template>
        <div class="text-h6 text-weight-bold">Getting Started</div>
        <div class="text-body1">Please select a <b>Global Region</b> and a <b>Supplier</b> from the dropdowns above to start configuring the Mother Template.</div>
      </q-banner>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import ProfitTiersEditor from 'components/admin/ProfitTiersEditor.vue';
import MessageTemplateEditor from 'components/admin/MessageTemplateEditor.vue';

export default {
  name: 'GlobalTemplates',
  components: {
    ProfitTiersEditor,
    MessageTemplateEditor
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const activeTab = ref('general');
    const regions = ref([]);
    const suppliers = ref([]);
    const selectedRegion = ref(route.query.region || null);
    const selectedSupplier = ref(null);
    const loading = ref(false);
    const saving = ref(false);
    const templateId = ref(null);

    const form = reactive({
      general: {},
      pricing: {},
      profit_tiers: [],
      messages: {},
      marketing: {},
      policies: {},
      tax: {}
    });

    const activeSupplierName = computed(() => {
      const s = suppliers.value.find(x => x.id === selectedSupplier.value);
      return s ? s.name : 'Selected Supplier';
    });

    const fetchInitialData = async () => {
      try {
        const [regRes, supRes] = await Promise.all([
          api.get('/admin/global-regions'),
          api.get('/admin/suppliers')
        ]);
        regions.value = regRes.data;
        suppliers.value = supRes.data;

        // If region is in query, pre-select first supplier if available
        if (selectedRegion.value && suppliers.value.length > 0) {
          selectedSupplier.value = suppliers.value[0].id;
          loadTemplate();
        }
      } catch (e) {
        $q.notify({ color: 'negative', message: 'Failed to load configuration data' });
      }
    };

    const loadTemplate = async () => {
      if (!selectedRegion.value || !selectedSupplier.value) return;

      loading.value = true;
      try {
        // Backend now uses /api/admin/global-regions/settings?regionId=X&supplierId=Y
        // Need to find the internal region ID from the country_code
        const regionObj = regions.value.find(r => r.country_code === selectedRegion.value);
        if (!regionObj) throw new Error('Region mapping failed');

        const res = await api.get('/admin/global-regions/settings', {
          params: {
            regionId: regionObj.id,
            supplierId: selectedSupplier.value
          }
        });

        const data = res.data;
        templateId.value = data.id;
        
        form.general = data.GlobalGeneralSetting || {};
        form.pricing = data.GlobalPricingSetting || { variation_type: 'PERCENT' };
        form.profit_tiers = data.GlobalPricingSetting?.GlobalProfitTiers || [];
        form.messages = data.GlobalMessageSetting || {};
        form.marketing = data.GlobalMarketingTaxSetting || {}; // Combined logic from backend migration
        form.policies = data.GlobalPolicySetting || {};
        form.tax = data.GlobalMarketingTaxSetting || {}; // Shared model

      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Setting Group not found for this profile.' });
        templateId.value = null;
      } finally {
        loading.value = false;
      }
    };

    const saveTemplate = async () => {
      saving.value = true;
      try {
        const payload = {
          general: form.general,
          pricing: form.pricing,
          profit_tiers: form.profit_tiers,
          messages: form.messages,
          policies: form.policies,
          marketing_tax: form.marketing // Combined in backend
        };

        await api.put(`/admin/global-regions/settings/${templateId.value}`, payload);
        $q.notify({ 
          color: 'positive', 
          message: 'Master Template updated successfully', 
          icon: 'las la-check-circle',
          position: 'top'
        });
      } catch (e) {
        $q.notify({ color: 'negative', message: 'Failed to update Master Template' });
      } finally {
        saving.value = false;
      }
    };

    onMounted(fetchInitialData);

    return {
      activeTab,
      regions,
      suppliers,
      selectedRegion,
      selectedSupplier,
      loading,
      saving,
      templateId,
      form,
      activeSupplierName,
      loadTemplate,
      saveTemplate
    };
  }
}
</script>

<script setup>
// Ensuring components are registered correctly for Script Setup if needed
</script>

<style lang="scss" scoped>
.max-width-800 {
  max-width: 800px;
}
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.bg-page {
  background-color: #f8fafc;
}
.sticky-tabs {
  position: sticky;
  top: 0;
}
.text-left-tab {
  :deep(.q-tab__content) {
    justify-content: flex-start;
    padding-left: 20px;
    width: 100%;
  }
}
.primary-1 {
  background-color: rgba($primary, 0.1);
}
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.rounded-sm {
  border-radius: 8px;
}
</style>
