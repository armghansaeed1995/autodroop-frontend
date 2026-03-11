<template>
  <q-layout view="hHh lpR fFf" class="app-layout">

    <q-header
      class="q-py-xs"
      :class="isDark ? 'bg-dark text-white border-bottom-dark' : 'bg-white text-dark border-bottom-light'"
    >
      <q-toolbar>
        <q-btn
          flat dense round
          icon="las la-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="gt-sm"
        />

        <q-toolbar-title class="text-weight-bold row items-center">
          <q-icon name="las la-cube" color="primary" size="28px" class="q-mr-sm" />
          <span class="gt-xs">Admin<span class="text-primary">Panel</span></span>
        </q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm gt-sm">
          <q-select
            v-model="currentLang"
            :options="langOptions"
            dense borderless emit-value map-options options-dense
            style="min-width: 100px"
            @update:model-value="changeLanguage"
          >
            <template v-slot:prepend>
              <q-icon name="las la-language" size="20px" />
            </template>
          </q-select>

          <q-btn
            flat round dense
            :icon="isDark ? 'las la-sun' : 'las la-moon'"
            @click="toggleTheme"
            :aria-label="isDark ? 'Light Mode' : 'Dark Mode'"
          />
        </div>

        <q-avatar v-if="isAuthenticated" size="32px" color="primary-1" text-color="primary" class="q-ml-md cursor-pointer">
          <span class="text-weight-bold">{{ userEmailInitial }}</span>
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="las la-sign-out-alt" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="1023"
      :class="isDark ? 'bg-dark border-right-dark' : 'bg-grey-1 border-right-light'"
      class="desktop-drawer"
    >
      <div class="q-pa-md text-caption text-grey-6 text-uppercase text-weight-bold tracking-wide">
        Main Menu
      </div>
      <q-list class="q-px-sm">
        <q-item
          v-for="nav in filteredMainNavItems"
          :key="nav.to"
          clickable
          v-ripple
          :to="nav.to"
          active-class="active-nav-item"
          class="nav-item q-mb-xs"
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" size="24px" />
          </q-item-section>
          <q-item-section class="text-weight-medium">{{ nav.label }}</q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-md text-caption text-grey-6 text-uppercase text-weight-bold tracking-wide q-mt-md">
        System
      </div>
      <q-list class="q-px-sm">
        <template v-for="nav in filteredSystemNavItems" :key="nav.to || nav.label">
          <!-- Item with children -->
          <q-expansion-item
            v-if="nav.children"
            :icon="nav.icon"
            :label="nav.label"
            class="nav-item q-mb-xs"
            header-class="text-weight-medium"
            expand-separator
            default-opened
          >
            <q-list class="q-pl-lg">
              <q-item
                v-for="child in nav.children"
                :key="child.to"
                clickable
                v-ripple
                :to="child.to"
                active-class="active-nav-item"
                class="nav-item q-mb-xs"
              >
                <q-item-section avatar>
                  <q-icon :name="child.icon" size="20px" />
                </q-item-section>
                <q-item-section class="text-weight-medium text-caption">{{ child.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Single item -->
          <q-item
            v-else
            clickable
            v-ripple
            :to="nav.to"
            active-class="active-nav-item"
            class="nav-item q-mb-xs"
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon" size="24px" />
            </q-item-section>
            <q-item-section class="text-weight-medium">{{ nav.label }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-footer
      class="lt-md"
      :class="isDark ? 'bg-dark border-top-dark' : 'bg-white border-top-light'"
    >
      <q-tabs
        no-caps
        active-color="primary"
        :indicator-color="isDark ? 'transparent' : 'transparent'"
        :class="isDark ? 'text-grey-5' : 'text-grey-6'"
        class="mobile-bottom-tabs"
        align="justify"
      >
        <q-route-tab
          v-for="nav in mobileBottomNavItems"
          :key="nav.to"
          :icon="nav.icon"
          :label="nav.label"
          :to="nav.to"
          exact
          class="bottom-tab"
        />

        <q-tab
          icon="las la-ellipsis-h"
          label="More"
          @click="mobileMoreMenuOpen = true"
          class="bottom-tab"
        />
      </q-tabs>
    </q-footer>

    <q-dialog v-model="mobileMoreMenuOpen" position="bottom">
      <q-card class="mobile-more-menu" :class="isDark ? 'bg-surface-dark' : 'bg-white'">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-weight-bold">Menu</div>
          <q-btn icon="las la-times" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list separator class="q-mb-md">
            <template v-for="nav in filteredSystemNavItems" :key="nav.to || nav.label">
              <!-- Item with children -->
              <q-expansion-item
                v-if="nav.children"
                :icon="nav.icon"
                :label="nav.label"
                header-class="text-weight-medium"
              >
                <q-list class="q-pl-md">
                  <q-item
                    v-for="child in nav.children"
                    :key="child.to"
                    clickable
                    v-ripple
                    :to="child.to"
                    @click="mobileMoreMenuOpen = false"
                  >
                    <q-item-section avatar>
                      <q-icon :name="child.icon" color="primary" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-weight-medium text-caption">{{ child.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <!-- Single item -->
              <q-item
                v-else
                clickable
                v-ripple
                :to="nav.to"
                @click="mobileMoreMenuOpen = false"
              >
                <q-item-section avatar>
                  <q-icon :name="nav.icon" color="primary" size="24px" />
                </q-item-section>
                <q-item-section class="text-weight-medium">{{ nav.label }}</q-item-section>
                <q-item-section side>
                  <q-icon name="las la-angle-right" />
                </q-item-section>
              </q-item>
            </template>
          </q-list>

          <q-separator class="q-my-md" />

          <div class="row items-center justify-between q-mb-md px-sm">
            <div class="row items-center text-weight-medium">
              <q-icon name="las la-language" size="24px" class="q-mr-sm text-grey-6" />
              Language
            </div>
            <q-select
              v-model="currentLang"
              :options="langOptions"
              dense borderless emit-value map-options options-dense
              @update:model-value="changeLanguage"
            />
          </div>

          <div class="row items-center justify-between px-sm">
            <div class="row items-center text-weight-medium">
              <q-icon :name="isDark ? 'las la-moon' : 'las la-sun'" size="24px" class="q-mr-sm text-grey-6" />
              Dark Mode
            </div>
            <q-toggle v-model="isDarkModeToggle" @update:model-value="toggleTheme" color="primary" />
          </div>

          <q-btn
            color="negative"
            icon="las la-sign-out-alt"
            label="Logout"
            outline
            class="full-width q-mt-lg"
            @click="logout"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container class="page-container">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'CustomerLayout', // Changed name
  data() {
    return {
      leftDrawerOpen: false,
      mobileMoreMenuOpen: false,
      currentLang: 'en-US',
      isDarkModeToggle: false,
      langOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'es', label: 'Español' }
      ]
    }
  },
  computed: {
    isDark() {
      return this.$q.dark.isActive;
    },
    isAuthenticated() {
      return !!this.$q.localStorage.getItem('token');
    },
    userRole() {
      try {
        const user = this.$q.localStorage.getItem('user');
        return user ? user.role : null;
      } catch (e) {
        console.log('Error parsing user data:', e);
        return null;
      }
    },
    userEmailInitial() {
      try {
        const user = this.$q.localStorage.getItem('user');
        return user && user.email ? user.email.charAt(0).toUpperCase() : 'U';
      } catch (e) {
        console.log('Error parsing user data:', e);
        return 'U';
      }
    },
    // Filtered navigation items based on role
    filteredMainNavItems() { // Specific to Customer layout
      const allItems = [
        { label: 'My Dashboard', icon: 'las la-home', to: '/customer/dashboard', roles: ['owner', 'staff'] },
        { label: 'Product Drafts', icon: 'las la-box-open', to: '/customer/product-drafts', roles: ['owner', 'staff'] },
        { label: 'Inventory', icon: 'las la-boxes', to: '/customer/inventory', roles: ['owner', 'staff'] },
        { label: 'Orders', icon: 'las la-receipt', to: '/customer/orders', roles: ['owner', 'staff'] },
      ];
      return allItems.filter(item => item.roles.includes(this.userRole));
    },
    filteredSystemNavItems() { // Specific to Customer layout
      const allItems = [
        { label: 'Message Templates', icon: 'las la-envelope', to: '/customer/message-templates', roles: ['owner', 'staff'] },
        { label: 'Suppliers', icon: 'las la-warehouse', to: '/customer/suppliers', roles: ['owner', 'staff'] },
        { 
          label: 'Settings', 
          icon: 'las la-cog', 
          to: '/customer/settings', 
          roles: ['owner', 'staff'],
          children: [
            { label: 'eBay Accounts', icon: 'lab la-ebay', to: '/customer/settings/ebay-accounts' },
            { label: 'Supplier Accounts', icon: 'las la-truck-loading', to: '/customer/settings/supplier-accounts' },
            { label: 'Preferences & Tools', icon: 'las la-tools', to: '/customer/settings/preferences' },
            { label: 'Profile & Billing', icon: 'las la-file-invoice-dollar', to: '/customer/settings/billing' }
          ]
        },
      ];
      return allItems.filter(item => item.roles.includes(this.userRole));
    },
    mobileBottomNavItems() {
      // Return only the first 3 items so the 4th can be the "More" button
      return this.filteredMainNavItems.slice(0, 3);
    }
  },
  watch: {
    // Sync the local toggle state with Quasar's internal dark mode state
    '$q.dark.isActive'(val) {
      this.isDarkModeToggle = val;
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    toggleTheme() {
      const targetMode = !this.$q.dark.isActive;
      this.$q.dark.set(targetMode);
      this.$q.localStorage.set('app-theme', targetMode ? 'dark' : 'light');
    },
    changeLanguage(lang) {
      if (this.$i18n) this.$i18n.locale = lang;

      import(`quasar/lang/${lang}`).then(langConfig => {
        this.$q.lang.set(langConfig.default);
      }).catch(() => console.warn(`Failed to load Quasar lang: ${lang}`));

      this.$q.localStorage.set('app-lang', lang);
    },
    initPreferences() {
      const savedTheme = this.$q.localStorage.getItem('app-theme');
      if (savedTheme) {
        this.$q.dark.set(savedTheme === 'dark');
      } else {
        this.$q.dark.set('auto');
      }
      this.isDarkModeToggle = this.$q.dark.isActive;

      const savedLang = this.$q.localStorage.getItem('app-lang');
      if (savedLang) {
        this.currentLang = savedLang;
        if (this.$i18n) this.$i18n.locale = savedLang;
        import(`quasar/lang/${savedLang}`).then(langConfig => {
          this.$q.lang.set(langConfig.default);
        }).catch(() => console.warn(`Failed to load Quasar lang: ${savedLang}`));
      } else if (this.$i18n) {
        this.currentLang = this.$i18n.locale;
      }
    },
    logout() {
      this.mobileMoreMenuOpen = false;
      this.$q.localStorage.remove('token');
      this.$q.localStorage.remove('user');
      this.$router.push('/customer/login'); // Always redirect to customer login from here
    }
  },
  created() {
    this.initPreferences();
  }
}
</script>

<style lang="scss" scoped>
/* Structural overrides */
.app-layout {
  background-color: var(--q-bg-light);
  body.body--dark & {
    background-color: var(--q-bg-dark);
  }
}

.page-container {
  padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
}

/* Custom Borders for clean enterprise look */
.border-bottom-light { border-bottom: 1px solid rgba(0,0,0,0.05); }
.border-bottom-dark { border-bottom: 1px solid rgba(255,255,255,0.05); }
.border-right-light { border-right: 1px solid rgba(0,0,0,0.05); }
.border-right-dark { border-right: 1px solid rgba(255,255,255,0.05); }
.border-top-light { border-top: 1px solid rgba(0,0,0,0.05); }
.border-top-dark { border-top: 1px solid rgba(255,255,255,0.05); }

.bg-surface-dark {
  background-color: $surface-dark;
}

/* Sidebar Navigation Items */
.nav-item {
  border-radius: 8px;
  color: $grey-7;
  transition: all 0.2s ease;

  body.body--dark & {
    color: $grey-5;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: $dark;
    body.body--dark & {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
  }
}

.active-nav-item {
  background: rgba($primary, 0.1) !important;
  color: $primary !important;
  font-weight: 600;

  body.body--dark & {
    background: rgba($primary, 0.2) !important;
  }
}

/* Mobile Bottom Navigation */
.mobile-bottom-tabs {
  height: 65px;
  padding-bottom: env(safe-area-inset-bottom);

  .bottom-tab {
    flex: 1;
    :deep(.q-tab__icon) {
      font-size: 24px;
      margin-bottom: 4px;
    }
    :deep(.q-tab__label) {
      font-size: 0.7rem;
      font-weight: 500;
    }
  }
}

/* Bottom Sheet Modal Styles */
.mobile-more-menu {
  width: 100%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

/* Page Transitions */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
