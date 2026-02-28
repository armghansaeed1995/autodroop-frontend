import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import axios from 'axios';

// Create a custom Axios instance named 'api'
console.log("process.env.API_BASE_URL",process.env)
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

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  // We'll replace $axios with $api for our custom instance, or use both if needed
  app.config.globalProperties.$api = api;

  // You can still keep the original axios if you need it for other non-API requests
  // app.config.globalProperties.$axios = axios;

  // for use inside Vue files (Composition API)
  // app.provide('api', api);
});

// Export the api instance for use in standard JS files
export { api };
