import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import axios from 'axios';

// Create a custom Axios instance named 'api'
const api = axios.create({
  baseURL: process.env.API_BASE_URL
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(config => {
  const token = LocalStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default boot(({ app, router }) => {
  // Add a response interceptor to handle 401 Unauthorized errors
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Clear local storage
        LocalStorage.remove('token');
        LocalStorage.remove('user');

        // Identify current path to redirect appropriately
        const currentPath = router.currentRoute.value.path;
        
        if (currentPath.startsWith('/admin')) {
          router.push('/admin/login');
        } else {
          router.push('/customer/login');
        }
      }
      return Promise.reject(error);
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$api = api;
});

// Export the api instance for use in standard JS files
export { api };
