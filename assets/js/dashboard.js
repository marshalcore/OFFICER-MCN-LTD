import { showSection, hideLoader, clearAuthData } from './utils.js';
import { validateToken } from './api.js';

const DEFAULT_PROFILE_IMAGE = '/assets/images/default-profile.png';
const logoutBtn = document.getElementById('logoutBtn');
const profilePictureUpload = document.getElementById('profilePictureUpload');

logoutBtn.addEventListener('click', () => {
  clearAuthData();
  showSection('loginSection');
});

// ... dashboard specific functions ...

export async function fetchDashboardData() {
  try {
    let token = localStorage.getItem('officerToken');
    if (!token) throw new Error('No authentication token');
    
    // Token validation and refresh logic
    // ...
    
    // Display dashboard
    showSection('dashboardSection');
  } catch (error) {
    clearAuthData();
    showSection('loginSection');
    console.error('Dashboard error:', error);
  }
}