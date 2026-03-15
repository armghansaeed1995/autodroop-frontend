<template>
  <q-page class="buy-package-page flex flex-center q-pa-md">
    <q-card flat class="buy-package-card text-center q-pa-xl">
      <q-icon name="las la-shopping-bag" size="80px" color="primary" class="q-mb-md" />
      <div class="text-h4 text-weight-bold q-mb-md">Choose Your Plan</div>
      <p class="text-body1 text-grey-7 q-mb-lg">
        Welcome! To activate your account, please select a subscription package below.
      </p>

      <div class="row justify-center q-col-gutter-lg q-mb-xl">
        <div v-for="pkg in packages" :key="pkg.id" class="col-12 col-md-4">
          <q-card
            flat
            bordered
            :class="{ 'package-card-selected': selectedPackage && selectedPackage.id === pkg.id }"
            class="package-card cursor-pointer q-hoverable"
            @click="selectedPackage = pkg"
          >
            <span class="q-focus-helper"></span>
            <q-card-section>
              <div class="text-h5 text-weight-bold">{{ pkg.name }}</div>
              <div class="text-h4 text-weight-bold text-primary q-my-sm">${{ parseFloat(pkg.price).toFixed(2) }}</div>
              <div class="text-caption text-grey-6">per month</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-sm text-body2">
              <div>{{ pkg.max_ebay_accounts }} Max eBay Accounts</div>
              <div>{{ pkg.max_suppliers }} Max Suppliers</div>
              <div>{{ pkg.max_products }} Max Products</div>
              <div>{{ pkg.max_track_credits }} Max Track Credits</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-btn
        label="Subscribe & Continue"
        color="primary"
        size="lg"
        unelevated
        :disable="!selectedPackage || loading"
        :loading="loading"
        @click="purchasePackage"
        class="full-width"
      />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'BuyPackagePage',
  data() {
    return {
      packages: [],
      selectedPackage: null,
      loading: false,
      customerId: null,
      customerEmail: null
    }
  },
  async created() {
    this.customerId = this.$q.localStorage.getItem('pendingCustomerId');
    this.customerEmail = this.$q.localStorage.getItem('pendingCustomerEmail');

    if (!this.customerId || !this.customerEmail) {
      this.$q.notify({
        type: 'negative',
        message: 'Registration incomplete. Please register again.',
        icon: 'las la-exclamation-triangle',
        position: 'top-right'
      });
      this.$router.push('/register'); // Redirect if no pending registration found
      return;
    }

    await this.fetchPackages();
  },
  methods: {
    async fetchPackages() {
      this.loading = true;
      try {
        const response = await this.$api.get('/packages');
        this.packages = response.data;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to fetch packages. Please try again later.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error fetching packages:', error);
      } finally {
        this.loading = false;
      }
    },
    async purchasePackage() {
      if (!this.selectedPackage) {
        this.$q.notify({
          type: 'warning',
          message: 'Please select a package.',
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        return;
      }

      this.loading = true;
      try {
        const response = await this.$api.post('/purchase-package', {
          customerId: this.customerId,
          packageId: this.selectedPackage.id
        });

        this.$q.notify({
          type: 'positive',
          message: response.data.message || 'Package purchased successfully! You can now log in.',
          icon: 'las la-check-circle',
          position: 'top-right'
        });

        this.$q.localStorage.remove('pendingCustomerId');
        this.$q.localStorage.remove('pendingCustomerEmail');
        this.$router.push('/customer/login'); // Redirect to customer login
      } catch (error) {
        let errorMessage = 'Failed to purchase package.';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'las la-exclamation-triangle',
          position: 'top-right'
        });
        console.error('Error purchasing package:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.buy-package-page {
  background: var(--q-bg-light);
  body.body--dark & {
    background: var(--q-bg-dark);
  }
}

.buy-package-card {
  max-width: 900px;
  width: 100%;
  border-radius: $radius-base;
  box-shadow: $shadow-2;
  background: $surface-light;

  body.body--dark & {
    background: $surface-dark;
  }
}

.package-card {
  border-radius: $radius-sm;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background: $bg-light;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-4;
  }

  &.package-card-selected {
    border: 2px solid $primary;
    box-shadow: $shadow-6;
    background: rgba($primary, 0.05);
  }

  body.body--dark & {
    background: $dark;
    &:hover {
      box-shadow: $shadow-4;
    }
    &.package-card-selected {
      border: 2px solid $primary;
      box-shadow: $shadow-6;
      background: rgba($primary, 0.15);
    }
  }
}
</style>
