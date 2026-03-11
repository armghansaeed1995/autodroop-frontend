<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold q-my-none">Supplier Accounts</h1>
      <p class="text-body2 text-grey-6 q-mt-xs">Manage your accounts for various suppliers like Amazon.</p>
    </div>

    <q-card flat class="table-card shadow-1">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-weight-medium">Connected Suppliers</div>
          <q-btn
            color="primary"
            label="Add Amazon Account"
            icon="lab la-amazon"
            unelevated
            @click="addAmazonAccount"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-center q-py-xl">
        <div class="text-body1 text-grey-7">No supplier accounts connected yet.</div>
        <q-btn
          color="primary"
          label="Add Your First Supplier"
          icon="las la-plus"
          unelevated
          class="q-mt-md"
          @click="addAmazonAccount"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar';

export default {
  name: 'SupplierAccounts',
  setup() {
    const $q = useQuasar();

    const addAmazonAccount = () => {
      $q.notify({
        message: 'Amazon account connection flow will be implemented here.',
        color: 'info',
        icon: 'las la-info-circle'
      });
    };

    return {
      addAmazonAccount
    };
  }
};
</script>

<style lang="scss" scoped>
.table-card {
  border-radius: 12px;
}
</style>
