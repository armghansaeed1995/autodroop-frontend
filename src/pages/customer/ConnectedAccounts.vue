<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Connected Marketplaces</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your connected buyer accounts and integrations.</p>
    </div>

    <q-card flat class="table-card">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-weight-medium">Your Connected Accounts</div>
          <q-btn
            color="primary"
            label="Connect eBay Account"
            icon="lab la-ebay"
            unelevated
            @click="connectEbay"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots color="primary" size="40px" />
        <div class="text-body2 text-grey-6 q-mt-md">Loading accounts...</div>
      </q-card-section>

      <q-card-section v-else-if="accounts.length === 0" class="text-center q-py-xl">
        <div class="text-body1 text-grey-7">No buyer accounts connected yet.</div>
        <q-btn
          color="primary"
          label="Connect Your First Account"
          icon="las la-plus"
          unelevated
          class="q-mt-md"
          @click="connectEbay"
        />
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="account in accounts" :key="account.id">
          <q-item-section avatar>
            <q-icon v-if="account.platform === 'ebay'" name="lab la-ebay" color="primary" size="24px" />
            <q-icon v-else name="las la-plug" color="grey" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ account.account_name }}</q-item-label>
            <q-item-label caption>
              <q-badge outline color="primary" :label="account.platform.toUpperCase()" />
              <q-badge v-if="account.seller_status" color="green-2" text-color="green-9" class="q-ml-sm" :label="account.seller_status" />
              <span v-if="account.store_plan" class="q-ml-sm text-grey-7">• {{ account.store_plan }}</span>
            </q-item-label>
            <q-item-label v-if="account.last_synced_at" caption class="q-mt-xs">
              Stock: {{ account.stock_quantity }} items (${{ account.stock_value }}) •
              Last synced: {{ new Date(account.last_synced_at).toLocaleString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row q-gutter-sm">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="las la-cog"
                @click="openSettings(account)"
              >
                <q-tooltip>Account Settings (Region/Supplier)</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="las la-sync"
                @click="syncAccount(account.id)"
              >
                <q-tooltip>Sync Stats from eBay</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="las la-trash-alt"
                @click="disconnectAccount(account.id)"
              >
                <q-tooltip>Disconnect Account</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ConnectedAccounts',
  data() {
    return {
      accounts: [],
      loading: false
    };
  },
  mounted() {
    // Check for success or error from eBay OAuth redirect
    if (this.$route.query.success === 'true') {
      this.$q.notify({
        type: 'positive',
        message: 'eBay account connected successfully!',
        icon: 'las la-check',
        position: 'top-right'
      });
      // Clean the URL so the toast doesn't show on refresh
      this.$router.replace({ query: null });
    } else if (this.$route.query.error) {
      this.$q.notify({
        type: 'negative',
        message: this.$route.query.error,
        icon: 'las la-exclamation-triangle',
        position: 'top-right'
      });
      // Clean the URL
      this.$router.replace({ query: null });
    }

    this.fetchAccounts();
  },
  methods: {
    async fetchAccounts() {
      this.loading = true;
      try {
        const response = await this.$api.get('/buyer-accounts');
        this.accounts = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to fetch connected accounts.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching accounts:', error);
      } finally {
        this.loading = false;
      }
    },

    async connectEbay() {
      this.loading = true;
      try {
        // Request the secure OAuth consent URL from the backend
        const response = await this.$api.get('/ebay/auth-url');

        if (response.data && response.data.url) {
          // Redirect the user's browser to eBay for authentication.
          // This leaves the Quasar app and goes to eBay's secure site.
          //window.location.href = response.data.url;
          window.open(response.data.url, '_blank');
        } else {
          throw new Error('Could not retrieve authentication URL.');
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to start eBay connection.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
      } finally {
        this.loading = false;
      }
    },

    async syncAccount(id) {
      this.loading = true;
      try {
        await this.$api.post(`/buyer-accounts/${id}/sync`);
        this.$q.notify({
          type: 'positive',
          message: 'Account statistics synced successfully.',
          icon: 'las la-check',
          position: 'top-right'
        });
        await this.fetchAccounts();
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to sync account statistics.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error syncing account:', error);
      } finally {
        this.loading = false;
      }
    },

    async openSettings(account) {
      // Fetch options first
      try {
        const [regRes, supRes] = await Promise.all([
          this.$api.get('/public/regions'),
          this.$api.get('/suppliers')
        ]);

        const regions = regRes.data;
        const suppliers = supRes.data;

        this.$q.dialog({
          title: 'Select Profile',
          message: 'Choose the Region and Supplier to configure settings for:',
          options: {
            type: 'radio',
            model: null,
            items: regions.map(r => ({ label: `Region: ${r.name} (${r.country_code})`, value: r.country_code }))
          },
          cancel: true,
          persistent: true
        }).onOk(regionCode => {
          this.$q.dialog({
            title: 'Select Supplier',
            options: {
              type: 'radio',
              model: null,
              items: suppliers.map(s => ({ label: s.name, value: s.id }))
            },
            cancel: true,
            persistent: true
          }).onOk(supplierId => {
            this.$router.push({
              path: '/customer/ebay-settings',
              query: {
                accountId: account.id,
                region: regionCode,
                supplierId: supplierId
              }
            });
          });
        });
      } catch (e) {
        this.$q.notify({ color: 'negative', message: 'Failed to load options' });
      }
    },

    async disconnectAccount(id) {
      this.$q.dialog({
        title: 'Confirm Disconnection',
        message: 'Are you sure? This will stop order syncing and inventory management for this account.',
        cancel: {
          label: 'Cancel',
          flat: true
        },
        ok: {
          label: 'Disconnect',
          color: 'negative',
          unelevated: true
        },
        persistent: true
      }).onOk(async () => {
        this.loading = true;
        try {
          await this.$api.delete(`/buyer-accounts/${id}`);
          this.$q.notify({
            type: 'positive',
            message: 'Account disconnected successfully.',
            icon: 'las la-check',
            position: 'top-right'
          });
          await this.fetchAccounts();
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Failed to disconnect account.',
            icon: 'las la-exclamation-triangle',
            position: 'top-right'
          });
          console.error('Error disconnecting account:', error);
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-card { // Reusing style from TablesPage, may need more specific styling
  border-radius: $radius-base;
  box-shadow: $shadow-1;
}
</style>
