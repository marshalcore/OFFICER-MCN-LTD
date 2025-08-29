import { showLoader, hideLoader } from './utils.js';

const API_BASE_URL = 'http://marshalcore-backend.onrender.com';

async function validateToken(token) {
  if (!token) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/officer/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token validation error:', errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

async function officerSignup(formData) {
  showLoader();
  try {
    const response = await fetch(`${API_BASE_URL}/officer/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
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
    const response = await fetch(`${API_BASE_URL}/officer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid credentials. Please check your Unique ID and password.');
      }
      throw new Error(data.detail || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  } finally {
    hideLoader();
  }
}

async function forgotPassword(email) {
  showLoader();
  try {
    const response = await fetch(`${API_BASE_URL}/officer/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors
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
    // Ensure we get a proper error message
    const errorMsg = error.message || JSON.stringify(error);
    throw new Error(errorMsg);
  } finally {
    hideLoader();
  }
}

async function resetPassword(formData) {
  showLoader();
  try {
    const response = await fetch(`${API_BASE_URL}/officer/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors
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
      throw new Error(data.detail || 'Password reset failed');
    }

    return data;
  } catch (error) {
    // Ensure we get a proper error message
    const errorMsg = error.message || JSON.stringify(error);
    throw new Error(errorMsg);
  } finally {
    hideLoader();
  }
}

async function fetchOfficerProfile(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/officer/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load profile');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function fetchDashboardData(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/officer/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load dashboard');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function uploadOfficerDocument(token, formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/officer/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
  uploadOfficerDocument
};