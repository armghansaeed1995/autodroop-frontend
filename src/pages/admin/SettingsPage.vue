<template>
  <div class="q-pa-md q-pa-md-xl">
    <div class="text-h4 q-mb-xl text-weight-bold">Settings</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-md">
          <div class="text-h6 q-mb-md">Preferences</div>

          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Language</q-item-label>
                <q-item-label caption>Select your preferred language</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select
                  v-model="selectedLang"
                  :options="langOptions"
                  filled dense emit-value map-options
                  @update:model-value="updateLanguage"
                  style="min-width: 150px"
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
                <q-item-label caption>Toggle application theme</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="isDarkMode" @update:model-value="updateTheme" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-md">
          <div class="text-h6 q-mb-md">eBay Integration</div>
          <p class="text-caption q-mb-lg">
            Connect the master eBay account used for administrative tasks, global catalog synchronization, and platform-wide automated messaging.
          </p>

          <div v-if="ebayStatus.connected" class="q-pa-md bg-grey-2 rounded-borders q-mb-md">
            <div class="row items-center q-col-gutter-sm">
              <div class="col-auto">
                <q-avatar icon="shop" color="primary" text-color="white" size="40px" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">{{ ebayStatus.account_name }}</div>
                <div class="text-caption text-positive" v-if="!ebayStatus.is_expired">
                  <q-icon name="check_circle" size="xs" /> Connected and Active
                </div>
                <div class="text-caption text-negative" v-else>
                  <q-icon name="warning" size="xs" /> Token Expired - Please Reconnect
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  outline
                  color="primary"
                  label="Reconnect"
                  :loading="loadingAuth"
                  @click="connectEbay"
                />
              </div>
            </div>
          </div>

          <div v-else class="text-center q-py-lg">
            <q-icon name="link_off" size="4rem" color="grey-4" class="q-mb-md" />
            <div class="text-subtitle1 q-mb-md">No Admin eBay account connected</div>
            <q-btn
              unelevated
              color="primary"
              icon="login"
              label="Connect Admin eBay Account"
              :loading="loadingAuth"
              @click="connectEbay"
            />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageSettings',
  data() {
    return {
      selectedLang: this.$i18n.locale,
      isDarkMode: this.$q.dark.isActive,
      langOptions: [
        { label: 'English (US)', value: 'en-US' },
        { label: 'Italiano', value: 'it' },
        { label: 'Español', value: 'es' }
      ],
      ebayStatus: {
        connected: false,
        account_name: '',
        is_expired: false
      },
      loadingAuth: false
    }
  },
  mounted() {
    this.fetchEbayStatus();

    // Check for success/error query params from callback
    if (this.$route.query.success) {
      this.$q.notify({
        type: 'positive',
        message: 'eBay account connected successfully!'
      });
      // Clean up URL
      this.$router.replace({ query: {} });
    } else if (this.$route.query.error) {
      this.$q.notify({
        type: 'negative',
        message: this.$route.query.error || 'Failed to connect eBay account.'
      });
      this.$router.replace({ query: {} });
    }
  },
  watch: {
    '$q.dark.isActive'(val) {
      this.isDarkMode = val;
    }
  },
  methods: {
    async fetchEbayStatus() {
      try {
        const response = await this.$api.get('/admin/ebay/status');
        this.ebayStatus = response.data;

        // Update LocalStorage cache for Dashboard
        if (this.ebayStatus.connected && !this.ebayStatus.is_expired) {
          this.$q.localStorage.set('admin_ebay_connected', true);
          this.$q.localStorage.set('admin_ebay_connected_expiry', Date.now() + 24 * 60 * 60 * 1000);
        } else {
          this.$q.localStorage.set('admin_ebay_connected', false);
        }
      } catch (error) {
        console.error('Failed to fetch eBay status:', error);
      }
    },
    async connectEbay() {
      this.loadingAuth = true;
      try {
        const response = await this.$api.get('/admin/ebay/auth-url');
        if (response.data && response.data.url) {
//          window.location.href = response.data.url;
          window.open(response.data.url, '_blank');
        }
      } catch (error) {
        console.error('Failed to generate eBay authorization URL:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to generate eBay authorization URL.'
        });
        this.loadingAuth = false;
      }
    },
    updateLanguage(lang) {
      this.$i18n.locale = lang;
      this.$q.localStorage.set('app-lang', lang);

      import(/* @vite-ignore */ `../i18n/${lang}`).then(langConfig => {
        this.$q.lang.set(langConfig.default);
      }).catch(() => console.warn('Quasar lang pack missing.'));
    },
    updateTheme(isDark) {
      this.$q.dark.set(isDark);
      this.$q.localStorage.set('app-theme', isDark ? 'dark' : 'light');
    }
  }
}
</script>
