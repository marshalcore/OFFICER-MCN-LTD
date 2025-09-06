import { showLoader, hideLoader } from './utils.js';

const API_BASE_URL = 'https://backend-mcn-ltd.onrender.com';
let refreshTokenRequest = null;

// Token management
function getStoredTokens() {
  return {
    accessToken: localStorage.getItem('officerToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
}

function storeTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('officerToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

function clearStoredTokens() {
  localStorage.removeItem('officerToken');
  localStorage.removeItem('refreshToken');
}

// Enhanced API request with proper URL handling
async function apiRequest(endpoint, options = {}) {
  const { accessToken, refreshToken } = getStoredTokens();
  
  // Add authorization header if token exists
  if (accessToken) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    };
  }
  
  // Add content type if not specified and body exists
  if (options.body && typeof options.body === 'object' && !options.headers?.['Content-Type']) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json'
    };
    
    // Stringify JSON body
    if (options.headers['Content-Type'] === 'application/json') {
      options.body = JSON.stringify(options.body);
    }
  }
  
  // Construct URL properly (without double base URL)
  const url = `${API_BASE_URL}${endpoint}`;
  
  let response = await fetch(url, options);
  
  // If token is expired, try to refresh it
  if (response.status === 401 && refreshToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      storeTokens(newTokens.access_token, newTokens.refresh_token);
      
      // Retry the original request with new token
      if (newTokens.access_token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newTokens.access_token}`
        };
        response = await fetch(url, options);
      }
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      clearStoredTokens();
      throw new Error('Session expired. Please login again.');
    }
  }
  
  return response;
}

// Token refresh function
async function refreshAccessToken(refreshToken) {
  if (refreshTokenRequest) {
    return refreshTokenRequest;
  }
  
  refreshTokenRequest = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/officer/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      return await response.json();
    } finally {
      refreshTokenRequest = null;
    }
  })();
  
  return refreshTokenRequest;
}

// API functions
async function officerSignup(formData) {
  showLoader();
  try {
    const response = await apiRequest('/officer/signup', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    throw error;
  } finally {
    hideLoader();
  }
}

async function officerLogin(formData) {
  showLoader();
  try {
    console.log('Attempting login with:', formData);
    
    const response = await apiRequest('/officer/login', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials. Please check your Unique ID and password.');
      }
      throw new Error(data.detail || data.message || 'Login failed');
    }

    // Store tokens if received
    if (data.access_token) {
      storeTokens(data.access_token, data.refresh_token);
    }

    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  } finally {
    hideLoader();
  }
}

async function forgotPassword(email) {
  showLoader();
  try {
    const response = await apiRequest('/officer/forgot-password', {
      method: 'POST',
      body: { email }
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 422) {
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map(err => {
            return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
          }).join('; ');
          throw new Error(errorMessages);
        } else if (data.detail) {
          throw new Error(data.detail);
        }
      }
      throw new Error(data.message || 'Failed to send reset code');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || JSON.stringify(error));
  } finally {
    hideLoader();
  }
}

async function resetPassword(formData) {
  showLoader();
  try {
    const response = await apiRequest('/officer/reset-password', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 422) {
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map(err => {
            return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
          }).join('; ');
          throw new Error(errorMessages);
        } else if (data.detail) {
          throw new Error(data.detail);
        }
      }
      throw new Error(data.detail || data.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || JSON.stringify(error));
  } finally {
    hideLoader();
  }
}

async function fetchOfficerProfile() {
  try {
    const response = await apiRequest('/officer/profile', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function fetchDashboardData() {
  try {
    const response = await apiRequest('/officer/dashboard', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error('Failed to load dashboard');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function uploadOfficerDocument(formData) {
  try {
    const response = await apiRequest('/officer/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export {
  validateToken,
  officerSignup,
  officerLogin,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  fetchOfficerProfile,
  fetchDashboardData,
  uploadOfficerDocument,
  setupTokenRefresh,
  getStoredTokens,
  storeTokens,
  clearStoredTokens
};