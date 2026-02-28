<template>
  <q-page class="bg-grey-1">
    <!-- Hero Section -->
    <div class="row flex-center text-center q-pa-xl bg-primary text-white" style="min-height: 50vh;">
      <div class="col-12 q-gutter-md">
        <h1 class="text-h2 text-weight-bold q-my-none">Automate Your eBay Dropshipping Empire.</h1>
        <h2 class="text-h5 text-weight-regular q-mt-md">Connect your stores, sync orders instantly, and automate buyer messages. Save 20 hours a week.</h2>
        <div class="q-mt-xl q-gutter-md">
          <q-btn
            label="Start Free Trial"
            color="white"
            text-color="primary"
            size="lg"
            unelevated
            @click="$router.push('/customer/login')"
          />
          <q-btn
            label="Login"
            outline
            color="white"
            size="lg"
            @click="$router.push('/customer/login')"
          />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="q-pa-xl text-center">
      <h3 class="text-h4 text-weight-bold q-mb-xl">Everything you need to scale.</h3>

      <div class="row q-col-gutter-lg q-mt-lg">
        <!-- Feature Card 1 -->
        <div class="col-12 col-md-4">
          <q-card flat class="text-center q-pa-md h-100">
            <q-icon name="las la-sync" size="64px" color="primary" class="q-mb-md" />
            <div class="text-h6 text-weight-bold">Instant Order Syncing</div>
            <p class="q-mt-sm text-grey-7">Orders pull from eBay automatically. Never miss a fulfillment deadline again.</p>
          </q-card>
        </div>

        <!-- Feature Card 2 -->
        <div class="col-12 col-md-4">
          <q-card flat class="text-center q-pa-md h-100">
            <q-icon name="las la-comments" size="64px" color="secondary" class="q-mb-md" />
            <div class="text-h6 text-weight-bold">Automated Messaging</div>
            <p class="q-mt-sm text-grey-7">Trigger tracking updates and thank-you notes the second an order ships.</p>
          </q-card>
        </div>

        <!-- Feature Card 3 -->
        <div class="col-12 col-md-4">
          <q-card flat class="text-center q-pa-md h-100">
            <q-icon name="las la-truck-loading" size="64px" color="info" class="q-mb-md" />
            <div class="text-h6 text-weight-bold">Supplier Management</div>
            <p class="q-mt-sm text-grey-7">Track your Amazon and AliExpress costs, links, and real profit margins in one place.</p>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="bg-dark text-white q-pa-xl text-center">
      <h3 class="text-h4 text-weight-bold q-mb-xl">Simple, Transparent Pricing.</h3>

      <div class="row q-col-gutter-lg justify-center q-mt-lg">
        <!-- Starter Tier Card -->
        <div class="col-12 col-md-4">
          <q-card flat class="text-dark q-pa-md h-100">
            <div class="text-h5 text-weight-bold q-mb-sm">Starter</div>
            <div class="text-h3 text-weight-bold text-primary q-mb-md">$29/mo</div>
            <q-list dense class="text-left q-mb-md">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>1 eBay Account</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>500 Orders/mo</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>Basic Support</q-item-section>
              </q-item>
            </q-list>
            <q-btn
              label="Choose Starter"
              color="white"
              text-color="primary"
              unelevated
              class="full-width"
              @click="$router.push('/customer/login')"
            />
          </q-card>
        </div>

        <!-- Pro Tier Card -->
        <div class="col-12 col-md-4">
          <q-card flat class="text-dark q-pa-md h-100">
            <div class="text-h5 text-weight-bold q-mb-sm">Pro</div>
            <div class="text-h3 text-weight-bold text-primary q-mb-md">$79/mo</div>
            <q-list dense class="text-left q-mb-md">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>5 eBay Accounts</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>Unlimited Orders</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="las la-check-circle" color="positive" />
                </q-item-section>
                <q-item-section>Automated Messaging</q-item-section>
              </q-item>
            </q-list>
            <q-btn
              label="Choose Pro"
              color="primary"
              text-color="white"
              unelevated
              class="full-width"
              @click="$router.push('/customer/login')"
            />
          </q-card>
        </div>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="bg-white text-center q-pa-xl">
      <h3 class="text-h4 text-weight-bold q-mb-md">Ready to take your time back?</h3>
      <q-btn
        label="Create Your Account"
        color="primary"
        size="lg"
        unelevated
        @click="$router.push('/customer/login')"
      />
    </div>

    <!-- Footer -->
    <div class="text-center q-pa-md bg-grey-3 text-grey-8">
      © 2026 Dropship SaaS. All rights reserved.
      <q-btn flat dense label="Privacy Policy" size="sm" class="q-ml-sm" />
      <q-btn flat dense label="Terms of Service" size="sm" class="q-ml-sm" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
})
</script>

<style lang="scss" scoped>
.h-100 {
  height: 100%;
}
</style>
