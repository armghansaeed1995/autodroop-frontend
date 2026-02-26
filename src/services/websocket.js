import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { LocalStorage } from 'quasar'

const WS_URL = 'ws://localhost:3000';

// 1. Define a Pinia store to manage WebSocket state and events
export const useSocketStore = defineStore('socket', () => {
  const state = reactive({
    isConnected: false,
    message: null, // Last received message
    error: null,   // Last received error
    items: [],     // Example list of items from the backend
    customers: [], // List of customers from the backend
  });

  function setConnected(value) {
    state.isConnected = value;
  }

  function setMessage(message) {
    console.log('Received message:', message);
    state.message = message;

    // --- Handle specific events from the backend ---
    switch (message.event) {
      case 'items/getAllSuccess':
        state.items = message.payload;
        break;
      case 'items/createSuccess':
        state.items.push(message.payload);
        break;
      case 'items/deleteSuccess':
        state.items = state.items.filter(item => item.id !== message.payload.id);
        break;
      case 'customers/list-success':
        state.customers = message.payload;
        break;
      case 'error':
        state.error = message.payload;
        break;
    }
  }

  function setError(error) {
    console.error('Socket Error:', error);
    state.error = error;
  }

  return { ...toRefs(state), setConnected, setMessage, setError };
});


// 2. Create the WebSocket service
class WebSocketService {
  constructor() {
    this.socket = null;
    this.token = LocalStorage.getItem('token') || null; // Changed from 'jwt' to 'token'
    this.user = JSON.parse(LocalStorage.getItem('user')) || null;
    this.store = useSocketStore();
    this.pendingRequests = new Map(); // To store Promises for request-response
    this.requestId = 0;
  }

  connect() {
    // Avoid multiple connections
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected.');
      return;
    }

    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      this.store.setConnected(true);
      this.store.setError(null);
      console.log('WebSocket connection established.');
      // If we have a token, we could re-authenticate here if needed
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.store.setMessage(message); // Let the Pinia store handle the incoming message

        // Handle request-response pattern
        if (message.requestId && this.pendingRequests.has(message.requestId)) {
          const { resolve, reject } = this.pendingRequests.get(message.requestId);
          this.pendingRequests.delete(message.requestId);

          if (message.event.endsWith('error')) {
            reject(new Error(message.payload.message || 'An unknown error occurred.'));
          } else {
            resolve(message);
          }
        }

        // If a login was successful, store the token and user
        if (message.event === 'auth/loginSuccess') {
          this.setAuthData(message.payload.token, message.payload.user);
        } else if (message.event === 'auth/registerSuccess') {
          // No special handling needed here for now, just for router in the register page
        }
      } catch (error) {
        this.store.setError({ message: 'Failed to parse server message.' });
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      this.store.setConnected(false);
      console.log('WebSocket connection closed.');
      // Optional: Implement reconnection logic here
    };

    this.socket.onerror = (error) => {
      this.store.setError({ message: 'A WebSocket error occurred.' });
      console.error('WebSocket error:', error);
    };
  }

  /**
   * Sends a message to the WebSocket server and returns a Promise that resolves with the response.
   * @param {string} event - The name of the event (e.g., 'auth/login').
   * @param {object} payload - The data to send.
   * @returns {Promise<object>} A Promise that resolves with the server's response message.
   */
  send(event, payload = {}) {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        const error = new Error('WebSocket is not connected.');
        this.store.setError({ message: error.message });
        return reject(error);
      }

      const currentRequestId = this.requestId++;
      this.pendingRequests.set(currentRequestId, { resolve, reject });

      const message = {
        event,
        payload,
        requestId: currentRequestId,
        // Automatically include the token for all events except login/register
        token: (event !== 'auth/login' && event !== 'auth/register') ? this.token : undefined,
      };

      this.socket.send(JSON.stringify(message));

      // Set a timeout for the request
      setTimeout(() => {
        if (this.pendingRequests.has(currentRequestId)) {
          this.pendingRequests.delete(currentRequestId);
          reject(new Error('WebSocket request timed out.'));
        }
      }, 10000); // 10 seconds timeout
    });
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    if (token) {
      LocalStorage.set('token', token);
      LocalStorage.set('user', user);
    } else {
      LocalStorage.removeItem('token');
      LocalStorage.removeItem('user');
    }
  }

  logout() {
    this.setAuthData(null, null); // Clear token and user
    // You might want to inform the server or just clean up client-side
    this.store.$reset(); // Reset Pinia store if you have such an action
  }

  getAuthToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }
}

// Export a singleton instance of the service
export const websocketService = new WebSocketService();

// Connect on application startup
websocketService.connect();

