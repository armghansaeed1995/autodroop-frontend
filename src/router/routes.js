const routes = [
  // Standalone Pages (No MainLayout - uses EmptyLayout)
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }, // Default route for '/'
      { path: 'register', component: () => import('pages/RegisterPage.vue'), meta: { requiresAuth: false } },
      { path: 'buy-package', component: () => import('pages/BuyPackagePage.vue'), meta: { requiresAuth: false } },
      { path: 'admin-login', component: () => import('pages/AdminLogin.vue'), meta: { requiresAuth: false } },
      { path: 'customer-login', component: () => import('pages/CustomerLogin.vue'), meta: { requiresAuth: false } }
    ]
  },

  // Admin Portal Routes
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, roles: ['sysadmin'] }, // Admin portal requires sysadmin role
    children: [
      { path: 'dashboard', component: () => import('pages/AdminDashboard.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'settings', component: () => import('pages/SettingsPage.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'packages', component: () => import('pages/PackagesPage.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'design', component: () => import('pages/DesignShowcase.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
      { path: 'customer-management', component: () => import('pages/admin/CustomerManagement.vue'), meta: { requiresAuth: true, roles: ['sysadmin'] } },
    ]
  },

  // Customer Portal Routes
  {
    path: '/customer',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, roles: ['owner', 'staff'] }, // Customer portal requires owner/staff roles
    children: [
      { path: 'dashboard', component: () => import('pages/customer/Dashboard.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'settings', component: () => import('pages/SettingsPage.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } }, // Customer-specific settings if any
      { path: 'connected-accounts', component: () => import('pages/ConnectedAccounts.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'product-drafts', component: () => import('pages/ProductDrafts.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'orders', component: () => import('pages/OrdersList.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'message-templates', component: () => import('pages/MessageTemplates.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } },
      { path: 'suppliers', component: () => import('pages/SuppliersList.vue'), meta: { requiresAuth: true, roles: ['owner', 'staff'] } }, // New Suppliers List page
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
