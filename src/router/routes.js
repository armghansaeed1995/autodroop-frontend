const routes = [
  // Standalone Pages (EmptyLayout)
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue'), meta: { requiresAuth: false } },
      { path: 'buy-package', component: () => import('pages/BuyPackagePage.vue'), meta: { requiresAuth: false } },
      { path: 'admin/login', component: () => import('pages/admin/AdminLogin.vue'), meta: { requiresAuth: false } }, // Moved to Admin folder
      { path: 'customer/login', component: () => import('pages/customer/CustomerLogin.vue'), meta: { requiresAuth: false } } // Moved to Customer folder
    ]
  },

  // Admin Portal Routes
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'), // Changed to AdminLayout
    meta: { requiresAuth: true, roles: ['sysadmin'] },
    children: [
      { path: 'dashboard', component: () => import('pages/admin/AdminDashboard.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } }, // Moved to Admin folder
      { path: 'settings', component: () => import('pages/admin/SettingsPage.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'packages', component: () => import('pages/admin/PackagesPage.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'design', component: () => import('pages/DesignShowcase.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'customer-management', component: () => import('pages/admin/CustomerManagement.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'global-regions', component: () => import('pages/admin/GlobalRegions.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'global-templates', component: () => import('pages/admin/GlobalTemplates.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
    ]
  },

  // Customer Portal Routes
  {
    path: '/customer',
    component: () => import('layouts/CustomerLayout.vue'),
    meta: { requiresAuth: true, roles: ['owner', 'staff'] },
    children: [
      { path: 'dashboard', component: () => import('pages/customer/CustomerDashboard.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'settings', component: () => import('pages/customer/SettingsPage.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'ebay-settings', component: () => import('pages/customer/EbayAccountSettings.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'connected-accounts', component: () => import('pages/customer/ConnectedAccounts.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'product-drafts', component: () => import('pages/customer/ProductDrafts.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'orders', component: () => import('pages/customer/OrdersList.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'message-templates', component: () => import('pages/customer/MessageTemplates.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'suppliers', component: () => import('pages/customer/SuppliersList.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
