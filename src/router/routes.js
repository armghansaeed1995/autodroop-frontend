const routes = [
  // Web Pages
  {
    path: '/',
    component: () => import('pages/IndexPage.vue')
  },

  //  Admin/App Pages
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin', 'owner', 'staff'] },
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin', 'owner', 'staff'] },
      },
      {
        path: 'packages',
        component: () => import('pages/PackagesPage.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin'] },
      },
      {
        path: 'design',
        component: () => import('pages/DesignShowcase.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin'] }, // Assuming design system is primarily for sysadmin/dev
      },

      // Role-Specific Pages
      {
        path: 'customer-management', // Changed from 'admin/customers' for clarity
        component: () => import('pages/admin/CustomerManagement.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin'] },
      },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      // General Admin/App Pages
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { requiresAuth: true, roles: ['sysadmin', 'owner', 'staff'] },
      },

      {
        path: 'customer/dashboard',
        component: () => import('pages/customer/Dashboard.vue'),
        meta: { requiresAuth: true, roles: ['owner', 'staff'] },
      },
      {
        path: 'connected-accounts',
        component: () => import('pages/ConnectedAccounts.vue'),
        meta: { requiresAuth: true, roles: ['owner', 'staff'] },
      },
    ],
  },

  // ==========================================
  // Standalone Pages (No Sidebar / No Header)
  // ==========================================
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/buy-package',
    component: () => import('pages/BuyPackagePage.vue'),
    meta: { requiresAuth: false }, // No auth required for this step
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
