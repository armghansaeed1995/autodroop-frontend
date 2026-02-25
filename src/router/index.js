import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

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
    return !!localStorage.getItem('token');
  };

  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user ? user.role : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  };

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const requiredRoles = to.meta.roles; // Now an array of roles
    const authenticated = isAuthenticated();
    const userRole = getUserRole();

    if (requiresAuth && !authenticated) {
      // If authentication is required and user is not logged in, redirect to login page
      next('/login');
    } else if (authenticated && (to.path === '/login' || to.path === '/register')) {
      // If user is already authenticated and tries to access login/register, redirect to dashboard based on role
      if (userRole === 'sysadmin') {
        next('/admin/dashboard');
      } else if (userRole === 'owner' || userRole === 'staff') {
        next('/customer/dashboard');
      } else {
        next('/'); // Fallback if role is unknown
      }
    } else if (requiresAuth && authenticated && requiredRoles && !requiredRoles.includes(userRole)) {
      // If authentication is required, user is logged in, but role does not match, redirect to appropriate dashboard
      // For now, redirect to the dashboard that matches their role or the main dashboard
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

