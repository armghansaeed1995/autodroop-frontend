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
            @click="connectEbayAccount"
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
          @click="connectEbayAccount"
        />
      </q-card-section>

      <q-list v-else separator>
        <q-item v-for="account in accounts" :key="account.id">
          <q-item-section avatar>
            <q-icon v-if="account.platform === 'ebay'" name="lab la-ebay" color="primary" size="24px" />
            <q-icon v-else name="las la-plug" color="grey" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ account.account_name }}</q-item-label>
            <q-item-label caption>{{ account.platform.toUpperCase() }}</q-item-label>
          </q-item-section>
          <q-item-section side>
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
    this.fetchAccounts();
  },
  methods: {
    async fetchAccounts() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await this.$axios.get('http://localhost:3000/api/buyer-accounts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
    async disconnectAccount(id) {
      this.$q.dialog({
        title: 'Confirm Disconnection',
        message: 'Are you sure you want to disconnect this account? This cannot be undone.',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        this.loading = true;
        try {
          const token = localStorage.getItem('token');
          await this.$axios.delete(`http://localhost:3000/api/buyer-accounts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.$q.notify({
            type: 'positive',
            message: 'Account disconnected successfully.',
            icon: 'las la-check',
            position: 'top-right'
          });
          this.accounts = this.accounts.filter(account => account.id !== id); // Remove locally
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
    },
    connectEbayAccount() {
      alert('Coming soon: eBay account connection functionality.');
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
