<template>
  <q-page padding class="bg-page q-pa-lg q-pa-md-xl">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round icon="las la-arrow-left" color="grey-7" @click="$router.back()" class="q-mr-sm" />
        <div class="header-icon-box q-mr-md shadow-sm" :class="isDark ? 'bg-surface-dark' : 'bg-white'">
          <q-icon name="las la-cog" color="primary" size="32px" />
        </div>
        <div>
          <h1 class="text-h4 text-weight-bold q-my-none tracking-tight">Account Settings</h1>
          <p class="text-body2 text-grey-6 q-mt-xs">
            Manage settings for <span class="text-primary text-weight-bold">{{ region }}</span>
            on <span class="text-primary text-weight-bold">{{ supplierName }}</span>
          </p>
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          unelevated
          color="primary"
          icon="las la-save"
          label="Save Settings"
          :loading="saving"
          :disable="!templateId"
          @click="saveSettings"
          class="save-btn q-px-lg"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Main Content Area -->
    <div v-else-if="templateId" class="template-main-container animate-fade">
      <div class="row q-col-gutter-lg">
        <!-- Sidebar Navigation -->
        <div class="col-12 col-md-3">
          <q-card flat class="tabs-card sticky-sidebar" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white border-light'">
            <q-tabs
              v-model="activeTab"
              vertical
              active-color="primary"
              indicator-color="primary"
              class="text-grey-7"
            >
              <q-tab name="general" icon="las la-cog" label="General Import" class="custom-tab" />
              <q-tab name="pricing" icon="las la-tag" label="Prices & Stock" class="custom-tab" />
              <q-tab name="messages" icon="las la-comment-alt" label="Auto Messages" class="custom-tab" />
              <q-tab name="marketing" icon="las la-bullhorn" label="Marketing" class="custom-tab" />
              <q-tab name="automations" icon="las la-robot" label="Automations" class="custom-tab" />
              <q-tab name="policies" icon="las la-shield-alt" label="Policies" class="custom-tab" />
              <q-tab name="tax" icon="las la-file-invoice-dollar" label="Taxes" class="custom-tab" />
              <q-tab name="untracked" icon="las la-search-minus" label="Untracked" class="custom-tab" />
            </q-tabs>
          </q-card>
        </div>

        <!-- Settings Content -->
        <div class="col-12 col-md-9">
          <q-tab-panels v-model="activeTab" animated class="bg-transparent no-shadow">
            
            <!-- 1. General Settings -->
            <q-tab-panel name="general" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-cog" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">General Import Rules</div>
                  </div>
                  
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Unique Imports Only</q-item-label>
                          <q-item-label caption>Prevent duplicates in store</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.import_unique_only" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Import Variants</q-item-label>
                          <q-item-label caption>Include all product options</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.always_import_variants" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">GPSR Compliant</q-item-label>
                          <q-item-label caption>Verified compliant items</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.gpsr_compliant_only" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Remove Brand</q-item-label>
                          <q-item-label caption>Strip brand from titles</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.remove_brand_from_title" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Title Optimization</q-item-label>
                          <q-item-label caption>Smart title formatting</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.smart_title_optimization" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Duplicate Images</q-item-label>
                          <q-item-label caption>Fill all 12 eBay slots</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.duplicate_images" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Use PID as SKU</q-item-label>
                          <q-item-label caption>Internal tracking</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.use_pid_as_sku" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Use Template Description</q-item-label>
                          <q-item-label caption>HTML templates</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.general.use_template_description" color="primary" />
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
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 2. Pricing & Stock -->
            <q-tab-panel name="pricing" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-tag" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">Pricing & Inventory Monitoring</div>
                  </div>
                  
                  <div class="row q-col-gutter-lg q-mb-xl">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Stock Monitoring</q-item-label>
                          <q-item-label caption>Automatic inventory sync</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.pricing.stock_monitoring" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Price Monitoring</q-item-label>
                          <q-item-label caption>Automatic price sync</q-item-label>
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
                      <q-input v-model="form.pricing.price_cents" label="Price Cents (Fixed)" filled dense placeholder=".99" />
                    </div>
                    <div class="col-12">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Apply to Manual</q-item-label>
                          <q-item-label caption>Run rules on manual listings</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.pricing.apply_to_manual" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>

                  <q-separator class="q-my-xl opacity-50" />
                  <profit-tiers-editor 
                    v-model="form.profit_tiers" 
                    v-model:variationType="form.pricing.variation_type"
                  />
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 3. Message Settings -->
            <q-tab-panel name="messages" class="q-pa-none">
              <q-card flat bordered class="settings-card shadow-sm" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <message-template-editor v-model="form.messages" />
                  
                  <q-separator class="q-my-xl" />
                  
                  <div class="text-h6 q-mb-lg">Delivery Enhancements</div>
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Send Delivery Photo</q-item-label>
                          <q-item-label caption>Attach proof of delivery if available</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.messages.send_delivery_photo" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Send Location Note</q-item-label>
                          <q-item-label caption>Include courier delivery notes</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.messages.send_delivery_location_note" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 4. Marketing Settings -->
            <q-tab-panel name="marketing" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-bullhorn" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">Marketing & Promotions</div>
                  </div>
                  
                  <div class="text-subtitle2 text-primary q-mb-md">Automatic Sponsorship</div>
                  <div class="row q-col-gutter-lg q-mb-xl">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Automatic Ad Sponsorship</q-item-label>
                          <q-item-label caption>Sponsor listings 5-10 minutes after publishing</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.marketing.auto_sponsor" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-select 
                        v-model="form.marketing.sponsor_type" 
                        label="Sponsorship Type" 
                        :options="['Fixed', 'Dynamic', 'Aggressive']" 
                        filled 
                        dense 
                        :disable="!form.marketing.auto_sponsor"
                      />
                    </div>
                    <div class="col-12" v-if="form.marketing.auto_sponsor">
                      <q-checkbox v-model="form.marketing.apply_to_all_sponsored" label="Apply this new value to all currently sponsored listings" color="primary" />
                    </div>
                  </div>

                  <q-separator class="q-my-lg opacity-50" />

                  <div class="text-subtitle2 text-primary q-mb-md">Discounts & Promos</div>
                  <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Volume Discounts</q-item-label>
                          <q-item-label caption>Multi-buy incentives</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.marketing.volume_discount_status" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="form.marketing.promo_discount_percent" label="Promo Discount (%)" type="number" filled dense suffix="%" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model="form.marketing.discount_code_all_items" label="Discount Code (All Items)" filled dense placeholder="e.g. SAVE10" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="form.marketing.discount_cap" label="Max Discount Cap" type="number" filled dense prefix="€" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 5. Automations -->
            <q-tab-panel name="automations" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-robot" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">Operational Automations</div>
                  </div>
                  <p class="text-body2 text-grey-6 q-mb-xl">Configure background tasks that handle orders and inventory without manual intervention.</p>
                  
                  <div class="row q-col-gutter-lg">
                    <div class="col-12">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section avatar>
                          <q-icon name="lab la-amazon" color="orange-9" size="md" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Auto Order (Amazon)</q-item-label>
                          <q-item-label caption>Automatically purchase products from Amazon after eBay sale (5-10 min delay)</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.automations.auto_order_enabled" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="form.automations.auto_order_delay" label="Delay before purchase (Minutes)" type="number" filled dense suffix="min" hint="Recommended: 10 mins" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 6. Policies Settings -->
            <q-tab-panel name="policies" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="row items-center">
                      <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-shield-alt" size="40px" class="q-mr-sm" />
                      <div class="text-h5 text-weight-bold">Business Policies</div>
                    </div>
                    <q-select
                      v-model="selectedOriginRegion"
                      :options="allRegions"
                      option-label="name"
                      option-value="id"
                      label="Ship from Region"
                      filled
                      dense
                      emit-value
                      map-options
                      style="min-width: 200px"
                      @update:model-value="selectPolicy"
                    >
                      <template v-slot:prepend>
                        <q-icon name="las la-map-marker-alt" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <div v-if="activePolicy">
                    <div class="row items-center justify-between q-mb-md">
                      <div class="text-subtitle2 text-primary">Configuration for Origin: {{ activePolicyRegionName }}</div>
                      <q-toggle v-model="activePolicy.enabled" label="Enable this Origin" color="primary" />
                    </div>

                    <div :class="!activePolicy.enabled ? 'opacity-50 pointer-events-none' : ''">
                      <!-- Shipping -->
                      <div class="text-subtitle2 text-grey-7 q-mb-md">Shipping & Fulfillment</div>
                      <div class="row q-col-gutter-lg q-mb-xl">
                        <div class="col-12 col-md-6">
                          <q-input v-model="activePolicy.warehouse_city" label="Warehouse City" filled dense />
                        </div>
                        <div class="col-12 col-md-6">
                          <q-input v-model="activePolicy.warehouse_zipcode" label="Warehouse Zipcode" filled dense />
                        </div>
                        <div class="col-12 col-md-4">
                          <q-input v-model.number="activePolicy.handling_time" label="Handling Time (Days)" type="number" filled dense />
                        </div>
                        <div class="col-12 col-md-4">
                          <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                            <q-item-section>
                              <q-item-label class="text-weight-bold text-caption">Supplier Shipping Time</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-toggle v-model="activePolicy.use_supplier_shipping_time" color="primary" dense />
                            </q-item-section>
                          </q-item>
                        </div>
                        <div class="col-12 col-md-4">
                          <q-input v-model.number="activePolicy.default_delivery_days" label="Default Delivery Days" type="number" filled dense :disable="activePolicy.use_supplier_shipping_time" />
                        </div>
                      </div>

                      <q-separator class="q-my-lg opacity-50" />

                      <!-- Return days -->
                      <div class="row q-col-gutter-xl">
                        <div class="col-12 col-md-12">
                          <div class="text-subtitle2 text-grey-7 q-mb-md">Return Policy</div>
                          <q-input v-model.number="activePolicy.max_return_days" label="Max Return Days" type="number" filled dense class="q-mb-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="row justify-center q-pa-xl">
                    <div class="text-grey-6 italic">Please select an origin region from the dropdown above to configure regional handling rules.</div>
                  </div>

                  <q-separator class="q-my-xl" />

                  <!-- eBay Business Policies Section -->
                  <div class="row items-center justify-between q-mb-lg">
                    <div class="row items-center">
                      <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="lab la-ebay" size="40px" class="q-mr-sm" />
                      <div class="text-h5 text-weight-bold">eBay Business Policies</div>
                    </div>
                    <div class="row q-gutter-sm">
                      <q-btn outline color="primary" icon="las la-plus" label="Shipping" size="sm" @click="addEbayPolicy('shipping')" />
                      <q-btn outline color="primary" icon="las la-plus" label="Return" size="sm" @click="addEbayPolicy('return')" />
                      <q-btn outline color="primary" icon="las la-plus" label="Payment" size="sm" @click="addEbayPolicy('payment')" />
                    </div>
                  </div>

                  <div v-if="form.ebay_policies.length > 0">
                    <q-list bordered separator class="rounded-sm overflow-hidden" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                      <q-item v-for="(policy, index) in form.ebay_policies" :key="index" class="q-py-md">
                        <q-item-section avatar>
                          <q-chip
                            :color="policy.type === 'shipping' ? 'blue-1' : (policy.type === 'return' ? 'green-1' : 'purple-1')"
                            :text-color="policy.type === 'shipping' ? 'blue' : (policy.type === 'return' ? 'green' : 'purple')"
                            size="sm"
                            class="text-weight-bold text-uppercase"
                          >
                            {{ policy.type }}
                          </q-chip>
                        </q-item-section>
                        <q-item-section>
                          <div class="row q-col-gutter-sm">
                            <div class="col-12 col-md-5">
                              <q-input v-model="policy.name" label="Policy Name" filled dense />
                            </div>
                            <div class="col-12 col-md-5">
                              <q-input v-model="policy.ebay_policy_id" label="eBay Policy ID" filled dense placeholder="Enter ID from eBay" />
                            </div>
                            <div class="col-12 col-md-2 flex items-center">
                              <q-checkbox v-model="policy.is_default" label="Default" @update:model-value="val => val && setDefaultEbayPolicy(index, policy.type)" />
                            </div>
                          </div>
                        </q-item-section>
                        <q-item-section side>
                          <div class="row items-center q-gutter-x-sm">
                            <q-btn flat round color="primary" icon="las la-edit" size="sm" @click="editEbayPolicy(index)">
                              <q-tooltip>Edit Details</q-tooltip>
                            </q-btn>
                            <q-btn flat round color="negative" icon="las la-trash-alt" size="sm" @click="removeEbayPolicy(index)" />
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                  <div v-else class="text-center q-pa-lg border-dashed rounded-sm text-grey-6">
                    No eBay policies defined for this profile. Use the buttons above to add policies.
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 7. Tax Settings -->
            <q-tab-panel name="tax" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-file-invoice-dollar" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">Taxation & Invoicing</div>
                  </div>
                  
                  <div class="row q-col-gutter-lg q-mb-xl">
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="form.tax.vat_percentage" label="VAT Percentage (%)" type="number" filled dense suffix="%" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Auto-save Invoices</q-item-label>
                          <q-item-label caption>Store supplier receipts automatically</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.tax.auto_save_invoices" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>

                  <div class="invoice-msg-box">
                    <div class="text-subtitle2 text-grey-7 q-mb-sm">Invoice Request Message</div>
                    <q-input 
                      v-model="form.tax.invoice_request_message" 
                      type="textarea" 
                      filled 
                      dense 
                      rows="8" 
                      placeholder="Enter the message to send to suppliers when requesting an invoice..."
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- 8. Untracked Products -->
            <q-tab-panel name="untracked" class="q-pa-none">
              <q-card flat bordered class="settings-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white'">
                <q-card-section class="q-pa-xl">
                  <div class="row items-center q-mb-lg">
                    <q-avatar :color="isDark ? 'primary-900' : 'primary-1'" text-color="primary" icon="las la-search-minus" size="40px" class="q-mr-sm" />
                    <div class="text-h5 text-weight-bold">Untracked Products & Migration</div>
                  </div>
                  <p class="text-body2 text-grey-6 q-mb-xl">Synchronize your eBay account to import items not currently monitored by AutoDroop.</p>

                  <div class="row q-col-gutter-lg">
                    <div class="col-12">
                      <div class="border rounded-sm q-pa-lg text-center" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-icon name="las la-sync" size="48px" color="primary" class="q-mb-md animate-spin-slow" />
                        <div class="text-h6 q-mb-sm">Full Inventory Sync</div>
                        <p class="text-body2 text-grey-7">AutoDroop will scan your active eBay listings and attempt to match them with suppliers.</p>
                        <q-btn color="primary" label="Start Sync Now" unelevated icon="las la-play" class="q-px-xl" />
                      </div>
                    </div>

                    <div class="col-12">
                      <q-card flat bordered class="q-pa-md border-dashed">
                        <div class="row items-center q-mb-sm">
                          <q-icon name="las la-exchange-alt" color="orange" size="24px" class="q-mr-sm" />
                          <div class="text-subtitle1 text-weight-bold">Migrate from AutoDS</div>
                        </div>
                        <p class="text-caption text-grey-7">Import your existing AutoDS inventory directly. Requires Chrome Extension.</p>
                        <ul class="text-caption text-grey-7 q-pl-md">
                          <li>AutoDS subscription must be active.</li>
                          <li>Prices and titles will be optimized per current settings.</li>
                        </ul>
                        <q-btn outline color="orange" label="Start AutoDS Migration" icon="las la-file-import" size="sm" />
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
    <!-- Policy Editing Dialog -->
    <q-dialog v-model="policyDialog" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw; border-radius: 20px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Configure eBay {{ editingPolicy?.type }} Policy</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg" v-if="editingPolicy">
          <div class="row q-col-gutter-md">
            <!-- Rule Name & Description -->
            <div class="col-12">
              <q-input 
                filled 
                v-model="editingPolicy.name" 
                label="Rule Name" 
                hint="Example: All returns must be made within 30 days"
                counter
                maxlength="64"
                class="q-mb-md"
              />
            </div>
            <div class="col-12">
              <q-input 
                filled 
                v-model="editingPolicy.description" 
                label="Description (optional)" 
                type="textarea"
                rows="2"
                hint="Additional text to help you identify the contents of the rule"
                counter
                maxlength="250"
                class="q-mb-md"
              />
            </div>
            <div class="col-12">
              <q-input 
                filled 
                v-model="editingPolicy.ebay_policy_id" 
                label="eBay Policy ID (from eBay Portal)" 
                placeholder="e.g. 123456789"
              />
            </div>

            <!-- Specific Fields for Return Policy -->
            <template v-if="editingPolicy.type === 'return'">
              <q-separator class="col-12 q-my-md" />
              
              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold">National returns</div>
                <q-checkbox v-model="editingPolicy.details.accept_returns_national" label="Accept returns" color="primary" />
                <div class="text-caption text-grey-6 q-mb-sm">Allow returns for items purchased domestically.</div>
                
                <div class="row q-col-gutter-sm" v-if="editingPolicy.details.accept_returns_national">
                  <div class="col-6">
                    <q-select 
                      filled 
                      dense 
                      v-model="editingPolicy.details.return_period_national" 
                      label="Allowed within"
                      :options="[
                        { label: '30 days', value: 'DAYS_30' },
                        { label: '60 days', value: 'DAYS_60' }
                      ]"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-6">
                    <q-select 
                      filled 
                      dense 
                      v-model="editingPolicy.details.return_shipping_cost_payer_national" 
                      label="Return costs paid by"
                      :options="[
                        { label: 'Free for the buyer, you pay', value: 'SELLER' },
                        { label: 'Buyer', value: 'BUYER' }
                      ]"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </div>

              <q-separator class="col-12 q-my-md" />

              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold">International Returns</div>
                <q-checkbox v-model="editingPolicy.details.accept_returns_international" label="Accept returns" color="primary" />
                <div class="text-caption text-grey-6 q-mb-sm">Allow returns on items purchased abroad.</div>
                
                <div class="row q-col-gutter-sm" v-if="editingPolicy.details.accept_returns_international">
                  <div class="col-6">
                    <q-select 
                      filled 
                      dense 
                      v-model="editingPolicy.details.return_period_international" 
                      label="Allowed within"
                      :options="[
                        { label: '30 days', value: 'DAYS_30' },
                        { label: '60 days', value: 'DAYS_60' }
                      ]"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-6">
                    <q-select 
                      filled 
                      dense 
                      v-model="editingPolicy.details.return_shipping_cost_payer_international" 
                      label="Return costs paid by"
                      :options="[
                        { label: 'Free for the buyer, you pay', value: 'SELLER' },
                        { label: 'Buyer', value: 'BUYER' }
                      ]"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
              </div>

              <q-separator class="col-12 q-my-md" />

              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold">Return Policy Details</div>
                <q-input 
                  filled 
                  v-model="editingPolicy.details.return_policy_details" 
                  label="More details on return conditions (optional)" 
                  type="textarea"
                  rows="4"
                  placeholder="The customer will receive a full refund if he returns the product within the indicated time limit..."
                  counter
                  maxlength="8000"
                />
              </div>
            </template>

            <!-- Specific Fields for Payment Policy -->
            <template v-else-if="editingPolicy.type === 'payment'">
              <q-separator class="col-12 q-my-md" />
              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Payment services managed by eBay</div>
                <q-item tag="label" v-ripple class="border rounded-sm bg-grey-1">
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Require immediate payment</q-item-label>
                    <q-item-label caption>When a buyer uses the Buy It Now option</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-checkbox v-model="editingPolicy.details.require_immediate_payment" color="primary" />
                  </q-item-section>
                </q-item>
              </div>
            </template>

            <!-- Specific Fields for Shipping Policy -->
            <template v-else-if="editingPolicy.type === 'shipping'">
              <q-separator class="col-12 q-my-md" />
              
              <div class="col-12">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold">Domestic Shipping</div>
                  <q-btn flat round color="primary" icon="add" size="sm" @click="addShippingOption(false)">
                    <q-tooltip>Add Service</q-tooltip>
                  </q-btn>
                </div>

                <div v-if="fetchingServices" class="text-center q-pa-md">
                  <q-spinner color="primary" size="sm" />
                  <span class="q-ml-sm text-grey-6">Loading eBay services...</span>
                </div>
                
                <div v-else class="q-gutter-y-md">
                  <div v-for="(opt, idx) in editingPolicy.details.domestic_options" :key="idx" class="border rounded-sm q-pa-sm relative-position">
                    <q-btn flat round color="negative" icon="close" size="xs" class="absolute-top-right" @click="removeShippingOption(idx, false)" />
                    
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-md-8">
                        <q-select 
                          filled 
                          dense 
                          v-model="opt.service_name" 
                          label="Shipping Service"
                          :options="domesticServices"
                          option-label="description"
                          option-value="service_name"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-12 col-md-4 flex items-center">
                        <q-checkbox v-model="opt.free_shipping" label="Free Shipping" />
                      </div>
                      <template v-if="!opt.free_shipping">
                        <div class="col-6">
                          <q-input filled dense v-model.number="opt.shipping_cost" label="Cost (€)" type="number" prefix="€" />
                        </div>
                        <div class="col-6">
                          <q-input filled dense v-model.number="opt.additional_cost" label="Each add. (€)" type="number" prefix="€" />
                        </div>
                      </template>
                    </div>
                  </div>
                  <div v-if="editingPolicy.details.domestic_options.length === 0" class="text-center q-pa-md border-dashed rounded-sm text-grey-6">
                    No domestic services added.
                  </div>
                </div>
              </div>

              <q-separator class="col-12 q-my-md" />

              <div class="col-12">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold">International Shipping</div>
                  <q-btn flat round color="primary" icon="add" size="sm" @click="addShippingOption(true)">
                    <q-tooltip>Add Service</q-tooltip>
                  </q-btn>
                </div>
                
                <div class="q-gutter-y-md">
                  <div v-for="(opt, idx) in editingPolicy.details.international_options" :key="idx" class="border rounded-sm q-pa-sm relative-position">
                    <q-btn flat round color="negative" icon="close" size="xs" class="absolute-top-right" @click="removeShippingOption(idx, true)" />
                    
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-md-12">
                        <q-select 
                          filled 
                          dense 
                          v-model="opt.service_name" 
                          label="International Service"
                          :options="internationalServices"
                          option-label="description"
                          option-value="service_name"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-6">
                        <q-input filled dense v-model.number="opt.shipping_cost" label="Cost (€)" type="number" prefix="€" />
                      </div>
                      <div class="col-6">
                        <q-input filled dense v-model.number="opt.additional_cost" label="Each add. (€)" type="number" prefix="€" />
                      </div>
                    </div>
                  </div>
                  <div v-if="editingPolicy.details.international_options.length === 0" class="text-center q-pa-lg border-dashed rounded-sm text-grey-6">
                    No international services added.
                  </div>
                </div>
              </div>

              <q-separator class="col-12 q-my-md" />

              <div class="col-12">
                <q-input 
                  filled 
                  dense 
                  v-model.number="editingPolicy.details.handling_time" 
                  label="Handling Time (days)" 
                  type="number"
                  suffix="working days"
                />
              </div>
            </template>

            <!-- Placeholder for other types -->
            <template v-else>
              <div class="col-12 q-pa-lg text-center bg-grey-1 rounded-sm">
                <q-icon name="las la-info-circle" size="md" color="grey-6" />
                <div class="text-grey-7 q-mt-sm">Standard configuration for {{ editingPolicy.type }} policy. Add specific details in the description or via policy ID.</div>
              </div>
            </template>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn unelevated label="Save Policy" color="primary" @click="savePolicyDetails" class="q-px-lg" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import ProfitTiersEditor from 'components/admin/ProfitTiersEditor.vue';
import MessageTemplateEditor from 'components/admin/MessageTemplateEditor.vue';

export default {
  name: 'EbayAccountSettings',
  components: {
    ProfitTiersEditor,
    MessageTemplateEditor
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const activeTab = ref('general');
    const loading = ref(true);
    const saving = ref(false);
    const templateId = ref(null);
    const allRegions = ref([]);

    // Query Params
    const accountId = route.query.accountId;
    const regionCode = route.query.region;
    const supplierName = route.query.supplierName || 'Amazon';

    // Origin Region Logic
    const selectedOriginRegion = ref(null);
    const activePolicy = ref(null);

    const form = reactive({
      general: {},
      pricing: {},
      profit_tiers: [],
      messages: {},
      marketing: {},
      policies: [],
      ebay_policies: [],
      automations: {},
      tax: {}
    });

    const isDark = computed(() => $q.dark.isActive);

    const activePolicyRegionName = computed(() => {
      const r = allRegions.value.find(x => x.id === selectedOriginRegion.value);
      return r ? r.name : '';
    });

    // eBay Policy Details
    const policyDialog = ref(false);
    const editingPolicy = ref(null);
    const editingPolicyIndex = ref(-1);
    const ebayShippingServices = ref([]);
    const fetchingServices = ref(false);

    const fetchShippingServices = async () => {
      fetchingServices.value = true;
      try {
        const res = await api.get('/public/ebay-shipping-services', {
          params: { countryCode: regionCode }
        });
        ebayShippingServices.value = res.data;
      } catch (e) {
        console.error('Failed to fetch eBay shipping services:', e);
      } finally {
        fetchingServices.value = false;
      }
    };

    const editEbayPolicy = async (index) => {
      editingPolicyIndex.value = index;
      editingPolicy.value = JSON.parse(JSON.stringify(form.ebay_policies[index]));
      
      // Initialize details if empty
      if (!editingPolicy.value.details) editingPolicy.value.details = {};
      
      if (editingPolicy.value.type === 'return') {
        const d = editingPolicy.value.details;
        if (d.accept_returns_national === undefined) d.accept_returns_national = true;
        if (d.return_period_national === undefined) d.return_period_national = 'DAYS_30';
        if (d.return_shipping_cost_payer_national === undefined) d.return_shipping_cost_payer_national = 'SELLER';
        if (d.accept_returns_international === undefined) d.accept_returns_international = false;
        if (d.return_period_international === undefined) d.return_period_international = 'DAYS_30';
        if (d.return_shipping_cost_payer_international === undefined) d.return_shipping_cost_payer_international = 'SELLER';
      }

      if (editingPolicy.value.type === 'payment') {
        const d = editingPolicy.value.details;
        if (d.require_immediate_payment === undefined) d.require_immediate_payment = true;
      }

      if (editingPolicy.value.type === 'shipping') {
        await fetchShippingServices();
        const d = editingPolicy.value.details;
        if (!d.domestic_options) d.domestic_options = [];
        if (!d.international_options) d.international_options = [];
        if (d.handling_time === undefined) d.handling_time = 2;
      }
      
      policyDialog.value = true;
    };

    const addShippingOption = (isInternational = false) => {
      if (!editingPolicy.value.details) editingPolicy.value.details = {};
      const d = editingPolicy.value.details;
      
      const option = {
        service_name: '',
        shipping_cost: 0,
        additional_cost: 0,
        free_shipping: false
      };
      
      if (isInternational) {
        if (!d.international_options) d.international_options = [];
        d.international_options.push(option);
      } else {
        if (!d.domestic_options) d.domestic_options = [];
        d.domestic_options.push(option);
      }
    };

    const removeShippingOption = (index, isInternational = false) => {
      if (isInternational) {
        editingPolicy.value.details.international_options.splice(index, 1);
      } else {
        editingPolicy.value.details.domestic_options.splice(index, 1);
      }
    };

    const domesticServices = computed(() => ebayShippingServices.value.filter(s => !s.is_international));
    const internationalServices = computed(() => ebayShippingServices.value.filter(s => s.is_international));

    const savePolicyDetails = () => {
      form.ebay_policies[editingPolicyIndex.value] = JSON.parse(JSON.stringify(editingPolicy.value));
      policyDialog.value = false;
    };

    const addEbayPolicy = (type) => {
      form.ebay_policies.push({
        type: type,
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Policy`,
        description: '',
        ebay_policy_id: '',
        is_default: form.ebay_policies.filter(p => p.type === type).length === 0,
        details: {}
      });
      // Automatically open editor for new policy
      editEbayPolicy(form.ebay_policies.length - 1);
    };

    const removeEbayPolicy = (index) => {
      form.ebay_policies.splice(index, 1);
    };

    const setDefaultEbayPolicy = (index, type) => {
      form.ebay_policies.forEach((p, i) => {
        if (p.type === type) {
          p.is_default = (i === index);
        }
      });
    };

    const loadSettings = async () => {
      if (!accountId || !regionCode) {
        $q.notify({ color: 'negative', message: 'Missing account context' });
        return;
      }

      loading.value = true;
      try {
        // Fetch all regions for the selector
        const regRes = await api.get('/public/regions');
        allRegions.value = regRes.data;

        const res = await api.get('/buyer-accounts/settings-group', {
          params: {
            buyer_account_id: accountId,
            region_code: regionCode,
            supplier_name: supplierName
          }
        });

        const data = res.data;
        templateId.value = data.id;

        form.general = data.GeneralSettings || {};
        form.pricing = data.PricingSettings || { variation_type: 'PERCENT' };
        form.profit_tiers = data.PricingSettings?.ProfitTiers || [];
        form.messages = data.MessageSettings || {};
        form.automations = data.AutomationSettings || { auto_order_enabled: false, auto_order_delay: 10 };
        form.marketing = data.MarketingSettings || { volume_discount_status: false, sponsor_type: 'Fixed' };
        form.tax = data.TaxSettings || { vat_percentage: 0, auto_save_invoices: false };
        form.policies = data.AccountRegionPolicies || [];
        form.ebay_policies = data.AccountEbayPolicies || [];

        // Auto-select origin
        const regionObj = allRegions.value.find(r => r.country_code === regionCode);
        const currentOrigin = form.policies.find(p => p.origin_region_id === regionObj?.id);
        if (currentOrigin) {
          selectedOriginRegion.value = currentOrigin.origin_region_id;
          activePolicy.value = currentOrigin;
        } else if (form.policies.length > 0) {
          selectedOriginRegion.value = form.policies[0].origin_region_id;
          activePolicy.value = form.policies[0];
        }

      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to load account settings' });
      } finally {
        loading.value = false;
      }
    };

    const selectPolicy = (regionId) => {
      let policy = form.policies.find(p => p.origin_region_id === regionId);
      if (!policy) {
        policy = {
          origin_region_id: regionId,
          enabled: false,
          warehouse_city: '',
          warehouse_zipcode: '',
          handling_time: 2,
          use_supplier_shipping_time: true,
          default_delivery_days: 15,
          use_custom_shipping_policy: false,
          use_custom_payment_policy: false,
          use_custom_return_policy: false,
          max_return_days: 30
        };
        form.policies.push(policy);
      }
      activePolicy.value = policy;
    };

    const saveSettings = async () => {
      saving.value = true;
      try {
        const payload = {
          ...form,
          ebay_policies: form.ebay_policies
        };
        await api.put(`/buyer-accounts/settings-group/${templateId.value}`, payload);
        $q.notify({
          color: 'positive',
          message: 'Account settings saved successfully',
          icon: 'las la-check-circle',
          position: 'top'
        });
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to save settings' });
      } finally {
        saving.value = false;
      }
    };

    onMounted(loadSettings);

    return {
      activeTab,
      loading,
      saving,
      templateId,
      region: regionCode,
      supplierName,
      allRegions,
      selectedOriginRegion,
      activePolicy,
      activePolicyRegionName,
      form,
      isDark,
      saveSettings,
      selectPolicy,
      addEbayPolicy,
      removeEbayPolicy,
      setDefaultEbayPolicy,
      editEbayPolicy,
      savePolicyDetails,
      addShippingOption,
      removeShippingOption,
      domesticServices,
      internationalServices,
      fetchingServices,
      policyDialog,
      editingPolicy
    };
  }
}
</script>

<style lang="scss" scoped>
.bg-page {
  background-color: #f8fafc;
  body.body--dark & {
    background-color: #0c0c0e;
  }
}

.header-icon-box {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.05);
  body.body--dark & {
    border-color: rgba(255,255,255,0.05);
  }
}

.tabs-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.custom-tab {
  justify-content: flex-start;
  padding: 16px 20px;
  min-height: 56px;
  border-radius: 0;
  transition: all 0.2s ease;
  
  :deep(.q-tab__content) {
    justify-content: flex-start;
    width: 100%;
  }
  
  :deep(.q-tab__label) {
    font-weight: 600;
    font-size: 0.95rem;
  }
}

.settings-card {
  border-radius: 24px;
  min-height: 600px;
  border: 1px solid rgba(0,0,0,0.05);
}

.toggle-item {
  border: 1px solid rgba(0,0,0,0.06);
  padding: 12px 16px;
  transition: all 0.2s ease;
  border-radius: 12px;
  &:hover {
    border-color: $primary;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
  body.body--dark & {
    border-color: rgba(255,255,255,0.05);
  }
}

.sticky-sidebar {
  position: sticky;
  top: 24px;
}

.modern-select {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.save-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.border-dark { border-color: rgba(255,255,255,0.1) !important; }
.border-light { border-color: rgba(0,0,0,0.05) !important; }

.opacity-50 { opacity: 0.5; }
.pointer-events-none { pointer-events: none; }

.primary-900 { background-color: rgba($primary, 0.2); }
.primary-1 { background-color: rgba($primary, 0.05); }
.bg-f8 { background: #f8fafc; }
</style>
