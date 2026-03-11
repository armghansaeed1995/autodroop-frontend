<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Preferences & Tools</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Customize your experience and manage external tools.</p>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- General Preferences -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="las la-globe" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">General Preferences</div>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label>Language</q-item-label>
                  <q-item-label caption>Choose dashboard language</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-select
                    v-model="prefs.language"
                    :options="langOptions"
                    filled dense emit-value map-options
                    style="min-width: 150px"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Main Region</q-item-label>
                  <q-item-label caption>Default region for drafts</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-select
                    v-model="prefs.mainRegion"
                    :options="regionOptions"
                    filled dense emit-value map-options
                    style="min-width: 150px"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Appearance</q-item-label>
                  <q-item-label caption>Light or Dark theme</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn-toggle
                    v-model="isDark"
                    spread
                    no-caps
                    unelevated
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-7"
                    :options="[
                      {label: 'Light', value: false, icon: 'las la-sun'},
                      {label: 'Dark', value: true, icon: 'las la-moon'}
                    ]"
                    @update:model-value="toggleTheme"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Table Preferences -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="las la-table" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Table Preferences</div>
            </div>

            <q-list>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>View Variants as Group</q-item-label>
                  <q-item-label caption>Display drafts with variants as a single row</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="prefs.groupVariants" color="primary" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>Image Quality</q-item-label>
                  <q-item-label caption>Lower quality improves performance</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-select
                    v-model="prefs.imageQuality"
                    :options="['High', 'Medium', 'Low']"
                    filled dense
                    style="min-width: 150px"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Additional Tools -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="las la-external-link-alt" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Additional Tools</div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-btn outline color="primary" class="full-width" icon="lab la-chrome">
                  <div class="q-ml-sm text-left">
                    <div class="text-weight-bold">Chrome Extension</div>
                    <div class="text-caption">Enhance your dashboard</div>
                  </div>
                </q-btn>
              </div>
              <div class="col-12">
                <q-btn outline color="primary" class="full-width" icon="lab la-apple">
                  <div class="q-ml-sm text-left">
                    <div class="text-weight-bold">iOS App</div>
                    <div class="text-caption">Manage account on the go</div>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tracking Conversion -->
      <div class="col-12 col-md-6">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="las la-exchange-alt" color="primary" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">Tracking Conversion</div>
            </div>

            <q-list bordered separator class="rounded-sm">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-shield-alt" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Blue Care Express</q-item-label>
                  <q-item-label caption>No longer accepted by eBay. Risky.</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-weight-bold">1.2 Credits</div>
                  <q-radio v-model="prefs.trackingCarrier" val="bluecare" color="negative" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Aquiline</q-item-label>
                  <q-item-label caption>Accepted by eBay. Recommended.</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-weight-bold">1.5 Credits</div>
                  <q-radio v-model="prefs.trackingCarrier" val="aquiline" color="positive" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Notifications -->
      <div class="col-12">
        <q-card flat class="settings-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="lab la-discord" color="indigo" size="24px" class="q-mr-sm" />
              <div class="text-h6 text-weight-medium">My Notifications (Discord)</div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="prefs.discordWebhook"
                  label="Discord Webhook URL"
                  placeholder="https://discord.com/api/webhooks/..."
                />
              </div>
              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Receive alerts for:</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-6"><q-checkbox v-model="prefs.notifySales" label="New Sales" /></div>
                  <div class="col-6"><q-checkbox v-model="prefs.notifyFeedback" label="Feedback Received" /></div>
                  <div class="col-6"><q-checkbox v-model="prefs.notifyMessages" label="Messages Received" /></div>
                  <div class="col-6"><q-checkbox v-model="prefs.notifyStock" label="Stock Alerts" /></div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-end q-mt-xl">
      <q-btn color="primary" label="Save Preferences" unelevated class="q-px-xl" @click="savePrefs" />
    </div>
  </q-page>
</template>

<script>
import {  reactive, computed } from 'vue';
import { useQuasar } from 'quasar';

export default {
  name: 'PreferencesTools',
  setup() {
    const $q = useQuasar();

    const isDark = computed({
      get: () => $q.dark.isActive,
      set: (val) => {
        $q.dark.set(val);
        $q.localStorage.set('app-theme', val ? 'dark' : 'light');
      }
    });

    const prefs = reactive({
      language: $q.localStorage.getItem('app-lang') || 'en-US',
      mainRegion: 'IT',
      groupVariants: true,
      imageQuality: 'High',
      trackingCarrier: 'aquiline',
      discordWebhook: '',
      notifySales: true,
      notifyFeedback: true,
      notifyMessages: true,
      notifyStock: false
    });

    const langOptions = [
      { label: 'English (US)', value: 'en-US' },
      { label: 'Italiano', value: 'it' },
      { label: 'Español', value: 'es' }
    ];

    const regionOptions = [
      { label: 'Italy', value: 'IT' },
      { label: 'United Kingdom', value: 'GB' },
      { label: 'United States', value: 'US' },
      { label: 'Germany', value: 'DE' }
    ];

    const toggleTheme = (val) => {
      isDark.value = val;
    };

    const savePrefs = () => {
      $q.notify({
        message: 'Preferences saved successfully',
        color: 'positive',
        icon: 'las la-check'
      });
    };

    return {
      prefs,
      isDark,
      langOptions,
      regionOptions,
      toggleTheme,
      savePrefs
    };
  }
};
</script>

<style lang="scss" scoped>
.settings-card {
  border-radius: $radius-base;
  box-shadow: $shadow-1;
}
</style>
