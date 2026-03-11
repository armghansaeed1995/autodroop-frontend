const routes = [
  // Standalone Pages (EmptyLayout)
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue'), meta: { requiresAuth: false } },
      { path: 'buy-package', component: () => import('pages/BuyPackagePage.vue'), meta: { requiresAuth: false } },
      { path: 'admin/login', component: () => import('pages/admin/AdminLogin.vue'), meta: { requiresAuth: false } },
      { path: 'customer/login', component: () => import('pages/customer/CustomerLogin.vue'), meta: { requiresAuth: false } }
    ]
  },

  // Admin Portal Routes
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['sysadmin'] },
    children: [
      { path: 'dashboard', component: () => import('pages/admin/AdminDashboard.vue') },
      { path: 'settings', component: () => import('pages/admin/SettingsPage.vue') },
      { path: 'packages', component: () => import('pages/admin/PackagesPage.vue') },
      { path: 'design', component: () => import('pages/DesignShowcase.vue') },
      { path: 'customer-management', component: () => import('pages/admin/CustomerManagement.vue') },
      { path: 'global-regions', component: () => import('pages/admin/GlobalRegions.vue') },
      { path: 'global-templates', component: () => import('pages/admin/GlobalTemplates.vue') },
      { path: 'restricted-keywords', component: () => import('pages/admin/RestrictedKeywords.vue') },
    ]
  },

  // Customer Portal Routes
  {
    path: '/customer',
    component: () => import('layouts/CustomerLayout.vue'),
    meta: { requiresAuth: true, roles: ['owner', 'staff'] },
    children: [
      { path: 'dashboard', component: () => import('../pages/customer/CustomerDashboard.vue') },
      { 
        path: 'settings', 
        component: () => import('../pages/customer/SettingsPage.vue'),
        children: [
          { path: '', redirect: 'ebay-accounts' },
          { path: 'ebay-accounts', component: () => import('../pages/customer/ConnectedAccounts.vue') },
          { path: 'supplier-accounts', component: () => import('../pages/customer/SupplierAccounts.vue') },
          { path: 'preferences', component: () => import('../pages/customer/PreferencesTools.vue') },
          { path: 'billing', component: () => import('../pages/customer/ProfileBilling.vue') },
        ]
      },
      { path: 'ebay-settings', component: () => import('../pages/customer/EbayAccountSettings.vue') },
      { path: 'connected-accounts', redirect: 'settings/ebay-accounts' },
      { path: 'product-drafts', component: () => import('../pages/customer/ProductDrafts.vue') },
      { path: 'inventory', component: () => import('../pages/customer/InventoryList.vue') },
      { path: 'orders', component: () => import('../pages/customer/OrdersList.vue') },
      { path: 'messages', component: () => import('../pages/customer/EbayMessages.vue') },
      { path: 'message-templates', component: () => import('../pages/customer/MessageTemplates.vue') },
      { path: 'suppliers', component: () => import('../pages/customer/SuppliersList.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
