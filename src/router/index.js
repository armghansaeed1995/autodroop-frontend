import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { LocalStorage } from 'quasar'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Placeholder for authentication and role checking
  const isAuthenticated = () => {
    const token = LocalStorage.getItem('token');
    if (!token) return false;

    try {
      // Simple decode of JWT payload to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        LocalStorage.remove('token');
        LocalStorage.remove('user');
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return false;
    }
  };

  const getUserRole = () => {
    try {
      const user = LocalStorage.getItem('user');
      return user ? user.role : null;
    } catch (e) {
      console.error('Error parsing user from LocalStorage:', e);
      return null;
    }
  };

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const requiredRoles = to.meta.roles;
    const authenticated = isAuthenticated();
    const userRole = getUserRole();

    // Pages that don't require authentication but shouldn't be accessed if already logged in
    const authPages = ['/admin/login', '/customer/login', '/register'];

    if (requiresAuth && !authenticated) {
      // If authentication is required and user is not logged in, redirect to the appropriate login page
      if (to.path.startsWith('/admin')) {
        next('/admin/login');
      } else if (to.path.startsWith('/customer')) {
        next('/customer/login');
      } else {
        // Default to customer login for other protected routes if not specified
        next('/customer/login');
      }
    } else if (authenticated && authPages.includes(to.path)) {
      // If user is already authenticated and tries to access login/register pages, redirect to dashboard based on role
      if (userRole === 'sysadmin') {
        next('/admin/dashboard');
      } else if (userRole === 'owner' || userRole === 'staff') {
        next('/customer/dashboard');
      } else {
        next('/'); // Fallback for unknown role
      }
    } else if (requiresAuth && authenticated && requiredRoles && !requiredRoles.includes(userRole)) {
      // If authentication is required, user is logged in, but role does not match, redirect to appropriate dashboard
      if (userRole === 'sysadmin') {
        next('/admin/dashboard');
      } else if (userRole === 'owner' || userRole === 'staff') {
        next('/customer/dashboard');
      } else {
        next('/'); // Fallback for unknown role or no specific dashboard
      }
    } else {
      next(); // Proceed to the route
    }
  });

  return Router
})

