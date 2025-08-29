import { checkAuthStatus } from './auth.js';
import { setupTokenRefresh } from './api.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupTokenRefresh();
});