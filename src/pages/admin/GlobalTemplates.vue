<template>
  <q-page padding class="bg-page q-pa-lg q-pa-md-xl">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <div class="header-icon-box q-mr-md shadow-sm" :class="isDark ? 'bg-surface-dark' : 'bg-white'">
          <q-icon name="las la-tools" color="primary" size="32px" />
        </div>
        <div>
          <h1 class="text-h4 text-weight-bold q-my-none tracking-tight">Global Master Templates</h1>
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
          class="save-btn q-px-lg"
        />
      </div>
    </div>

    <!-- Context Selection -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card flat class="selection-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white border-light'">
          <q-card-section>
            <div class="text-overline text-primary q-mb-sm">Step 1: Sales Region</div>
            <q-select
              v-model="selectedRegion"
              :options="regions"
              option-label="name"
              option-value="country_code"
              label="Select Global Region"
              filled
              dense
              emit-value
              map-options
              @update:model-value="loadTemplate"
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon name="las la-globe" color="primary" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-py-md">
                  <q-item-section avatar v-if="scope.opt.flag_icon">
                    <q-avatar size="24px" class="shadow-1">
                      <img :src="`https://flagcdn.com/w40/${scope.opt.flag_icon.toLowerCase()}.png`" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.country_code }} • {{ scope.opt.currency }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="selection-card" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white border-light'">
          <q-card-section>
            <div class="text-overline text-primary q-mb-sm">Step 2: Supplier</div>
            <q-select
              v-model="selectedSupplier"
              :options="$SUPPLIERS"
              label="Select Supplier"
              filled
              dense
              @update:model-value="loadTemplate"
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon :name="selectedSupplier === 'Amazon' ? 'lab la-amazon' : 'las la-truck'" :color="selectedSupplier === 'Amazon' ? 'orange-9' : 'primary'" />
              </template>
            </q-select>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="info-card" :class="templateId ? (isDark ? 'bg-primary-900' : 'bg-primary-1') : (isDark ? 'bg-grey-9' : 'bg-grey-1')">
          <q-card-section class="row items-center no-wrap">
            <q-icon :name="templateId ? 'las la-fingerprint' : 'las la-lock'" :color="templateId ? 'primary' : 'grey-5'" size="24px" class="q-mr-md" />
            <div>
              <div class="text-caption text-weight-bold" :class="templateId ? 'text-primary' : 'text-grey-6'">Step 3: Configuration</div>
              <div class="text-body2 text-weight-medium truncate" v-if="templateId" :class="isDark ? 'text-white' : ''">Active ID: {{ templateId }}</div>
              <div class="text-body2 text-grey-5 italic" v-else>Please select context above</div>
            </div>
          </q-card-section>
        </q-card>
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
                      <q-input v-model.number="form.general.min_import_price" label="Min Import Price" type="number" filled dense :prefix="currencySymbol" />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input v-model.number="form.general.max_import_price" label="Max Import Price" type="number" filled dense :prefix="currencySymbol" />
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

                  <div class="text-subtitle2 text-primary q-mb-md">Sponsorships</div>
                  <div class="row q-col-gutter-lg q-mb-xl">
                    <div class="col-12 col-md-6">
                      <q-item tag="label" v-ripple class="toggle-item border rounded-sm" :class="isDark ? 'bg-grey-9' : 'bg-f8'">
                        <q-item-section>
                          <q-item-label class="text-weight-bold">Auto-Sponsor</q-item-label>
                          <q-item-label caption>eBay Promoted Listings</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle v-model="form.marketing.auto_sponsor" color="primary" />
                        </q-item-section>
                      </q-item>
                    </div>
                    <div class="col-12 col-md-6">
                      <q-select v-model="form.marketing.sponsor_type" label="Sponsor Type" :options="['Fixed', 'Dynamic']" filled dense />
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
                      <q-input v-model.number="form.marketing.discount_cap" label="Max Discount Cap" type="number" filled dense :prefix="currencySymbol" />
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
                      :options="regions"
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
                        <div class="col-12">
                          <q-checkbox v-model="activePolicy.use_custom_shipping_policy" label="Use a custom eBay shipping policy (ID)" color="primary" />
                          <q-input v-if="activePolicy.use_custom_shipping_policy" v-model="activePolicy.shipping_policy_id" label="eBay Shipping Policy ID" filled dense class="q-mt-sm" />
                        </div>
                      </div>

                      <q-separator class="q-my-lg opacity-50" />

                      <!-- Payment & Returns -->
                      <div class="row q-col-gutter-xl">
                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-7 q-mb-md">Payment Policy</div>
                          <q-checkbox v-model="activePolicy.use_custom_payment_policy" label="Use custom payment policy (ID)" color="primary" />
                          <q-input v-if="activePolicy.use_custom_payment_policy" v-model="activePolicy.payment_policy_id" label="eBay Payment Policy ID" filled dense class="q-mt-sm" />
                          <div v-else class="text-caption text-grey-6 q-mt-sm">Droopify will auto-generate a default payment policy.</div>
                        </div>
                        <div class="col-12 col-md-6">
                          <div class="text-subtitle2 text-grey-7 q-mb-md">Return Policy</div>
                          <q-input v-model.number="activePolicy.max_return_days" label="Max Return Days" type="number" filled dense class="q-mb-md" />
                          <q-checkbox v-model="activePolicy.use_custom_return_policy" label="Use custom return policy (ID)" color="primary" />
                          <q-input v-if="activePolicy.use_custom_return_policy" v-model="activePolicy.return_policy_id" label="eBay Return Policy ID" filled dense class="q-mt-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="row justify-center q-pa-xl">
                    <div class="text-grey-6 italic">Please select an origin region from the dropdown above to configure policies.</div>
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
                    <div class="text-caption text-grey-6 q-mt-sm">
                      <b>Example:</b> Good morning, I need the tax invoice for this purchase. Here are the tax details: [Company Name], [VAT Number], [SDI Code]...
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="row justify-center items-center q-pa-xl empty-state-container">
      <q-card flat class="empty-card text-center q-pa-xl shadow-sm" :class="isDark ? 'bg-surface-dark border-dark' : 'bg-white border-dashed'">
        <div class="empty-icon-circle q-mx-auto q-mb-lg" :class="isDark ? 'bg-grey-9' : 'bg-primary-1'">
          <q-icon name="las la-hand-pointer" color="primary" size="48px" />
        </div>
        <div class="text-h6 text-grey-8 text-weight-bold" :class="isDark ? 'text-white' : ''">Ready to Configure?</div>
        <p class="text-grey-6 q-mb-xl">Please select a <b>Global Region</b> and <b>Supplier</b> from the dropdowns above to access the Master Template configuration.</p>
        <div class="row justify-center q-gutter-md">
          <div class="context-pill bg-blue-1 text-primary" :class="isDark ? 'bg-primary-900' : ''">
            <q-icon name="las la-globe" class="q-mr-xs" /> Region
          </div>
          <div class="context-pill bg-orange-1 text-orange-9" :class="isDark ? 'bg-orange-900' : ''">
            <q-icon name="lab la-amazon" class="q-mr-xs" /> Supplier
          </div>
        </div>
      </q-card>
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

    const selectedRegion = ref(route.query.region || null);
    const selectedSupplier = ref('Amazon');
    const loading = ref(false);
    const saving = ref(false);
    const templateId = ref(null);

    // Origin Region Logic
    const selectedOriginRegion = ref(null);
    const activePolicy = ref(null);

    const form = reactive({
      general: {},
      pricing: {},
      profit_tiers: [],
      messages: {},
      marketing: {},
      policies: [], // List of GlobalRegionPolicy
      automations: {},
      tax: {}
    });

    const isDark = computed(() => $q.dark.isActive);

    const currencySymbol = computed(() => {
      const r = regions.value.find(x => x.country_code === selectedRegion.value);
      return r ? (r.currency_symbol || r.currency) : '€';
    });

    const activePolicyRegionName = computed(() => {
      const r = regions.value.find(x => x.id === selectedOriginRegion.value);
      return r ? r.name : '';
    });

    const fetchInitialData = async () => {
      try {
        const regRes = await api.get('/admin/global-regions');
        regions.value = regRes.data;

        if (selectedRegion.value && selectedSupplier.value) {
          loadTemplate();
        }
      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to load regions' });
      }
    };

    const loadTemplate = async () => {
      if (!selectedRegion.value || !selectedSupplier.value) return;

      loading.value = true;
      try {
        const regionObj = regions.value.find(r => r.country_code === selectedRegion.value);
        if (!regionObj) throw new Error('Region mapping failed');

        const res = await api.get('/admin/global-regions/settings', {
          params: {
            regionId: regionObj.id,
            supplierName: selectedSupplier.value
          }
        });

        const data = res.data;
        templateId.value = data.id;

        form.general = data.GlobalGeneralSetting || {};
        form.pricing = data.GlobalPricingSetting || { variation_type: 'PERCENT' };
        form.profit_tiers = data.GlobalPricingSetting?.GlobalProfitTiers || [];
        form.messages = data.GlobalMessageSetting || {};
        form.automations = data.GlobalAutomationSetting || { auto_order_enabled: false, auto_order_delay: 10 };

        form.marketing = {
          auto_sponsor: data.GlobalMarketingTaxSetting?.auto_sponsor || false,
          sponsor_type: data.GlobalMarketingTaxSetting?.sponsor_type || 'COST_PER_CLICK',
          volume_discount_status: data.GlobalMarketingTaxSetting?.volume_discount_status || false,
          promo_discount_percent: data.GlobalMarketingTaxSetting?.promo_discount_percent || 0,
          discount_code_all_items: data.GlobalMarketingTaxSetting?.discount_code_all_items || '',
          discount_cap: data.GlobalMarketingTaxSetting?.discount_cap || 0
        };

        form.tax = {
          vat_percentage: data.GlobalMarketingTaxSetting?.vat_percentage || 0,
          auto_save_invoices: data.GlobalMarketingTaxSetting?.auto_save_invoices || false,
          invoice_request_message: data.GlobalMarketingTaxSetting?.invoice_request_message || ''
        };

        form.policies = data.GlobalRegionPolicies || [];

        // Auto-select current region as origin if available
        const currentOrigin = form.policies.find(p => p.origin_region_id === regionObj.id);
        if (currentOrigin) {
          selectedOriginRegion.value = currentOrigin.origin_region_id;
          activePolicy.value = currentOrigin;
        } else if (form.policies.length > 0) {
          selectedOriginRegion.value = form.policies[0].origin_region_id;
          activePolicy.value = form.policies[0];
        }

      } catch (e) {
        console.error(e);
        $q.notify({ color: 'negative', message: 'Failed to load settings.' });
        templateId.value = null;
      } finally {
        loading.value = false;
      }
    };

    const selectPolicy = (regionId) => {
      let policy = form.policies.find(p => p.origin_region_id === regionId);
      if (!policy) {
        // Create a new policy object locally if it doesn't exist in the list
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

    const saveTemplate = async () => {
      saving.value = true;
      try {
        const payload = {
          general: form.general,
          pricing: form.pricing,
          profit_tiers: form.profit_tiers,
          messages: form.messages,
          automations: form.automations,
          policies: form.policies,
          marketing_tax: {
            ...form.marketing,
            ...form.tax
          }
        };

        await api.put(`/admin/global-regions/settings/${templateId.value}`, payload);
        $q.notify({
          color: 'positive',
          message: 'Master Template updated successfully',
          icon: 'las la-check-circle',
          position: 'top'
        });
      } catch (e) {
        console.log(e)
        $q.notify({ color: 'negative', message: 'Failed to update settings.' });
      } finally {
        saving.value = false;
      }
    };

    onMounted(fetchInitialData);

    return {
      activeTab,
      regions,
      selectedRegion,
      selectedSupplier,
      selectedOriginRegion,
      activePolicy,
      activePolicyRegionName,
      loading,
      saving,
      templateId,
      form,
      currencySymbol,
      isDark,
      loadTemplate,
      selectPolicy,
      saveTemplate
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

.selection-card {
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
  }
}

.info-card {
  border-radius: 16px;
  border: 1px solid rgba($primary, 0.1);
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.bg-primary-1 { background-color: rgba($primary, 0.05); }
.bg-primary-900 { background-color: rgba($primary, 0.2); }
.bg-f8 { background: #f8fafc; }

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

.empty-card {
  border-radius: 32px;
  max-width: 550px;
  width: 100%;
}

.empty-icon-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.context-pill {
  padding: 8px 16px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
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
</style>
