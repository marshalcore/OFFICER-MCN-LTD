import { showSection, clearAllMessages, showLoader, hideLoader } from './utils.js';
import { officerSignup, officerLogin, requestPasswordReset, resetPassword } from './api.js';

// DOM Elements
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');

// Navigation Links
document.getElementById('showLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('loginSection');
});

document.getElementById('showSignupLink').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('signupSection');
});

document.getElementById('showForgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('forgotPasswordSection');
});

document.getElementById('backToLoginLink').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('loginSection');
});

// Form Submissions
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllMessages();
  
  const formData = {
    unique_id: signupForm.unique_id.value,
    email: signupForm.email.value,
    phone: signupForm.phone.value,
    password: signupForm.password.value
  };

  try {
    const data = await officerSignup(formData);
    document.getElementById('signupSuccess').textContent = 'Account created successfully! Please log in.';
    showSection('loginSection');
  } catch (error) {
    document.getElementById('signupError').textContent = typeof error.message === 'string' ? error.message : 'Signup failed';
    console.error('Signup error:', error);
  }
});

// Login Form Handler - FIXED: Use unique_id instead of email
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllMessages();
  
  const formData = {
    unique_id: loginForm.unique_id.value, // Changed from email to unique_id
    password: loginForm.password.value
  };

  try {
    showLoader();
    const data = await officerLogin(formData);
    hideLoader();
    
    // Store token and redirect
    localStorage.setItem('officerToken', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refreshToken', data.refresh_token);
    }
    
    // Redirect to dashboard
    window.location.href = '/dashboard.html';
    
  } catch (error) {
    hideLoader();
    document.getElementById('loginError').textContent = typeof error.message === 'string' ? error.message : 'Login failed. Invalid credentials.';
    console.error('Login error:', error);
  }
});

// Forgot Password Form Handler
forgotPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllMessages();
  
  const email = forgotPasswordForm.email.value;

  try {
    showLoader();
    const data = await requestPasswordReset(email);
    hideLoader();
    
    document.getElementById('forgotPasswordSuccess').textContent = 'Password reset instructions sent to your email!';
    forgotPasswordForm.reset();
    
  } catch (error) {
    hideLoader();
    document.getElementById('forgotPasswordError').textContent = typeof error.message === 'string' ? error.message : 'Failed to send reset instructions';
    console.error('Forgot password error:', error);
  }
});

// Reset Password Form Handler
resetPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllMessages();
  
  const formData = {
    email: resetPasswordForm.email.value,
    code: resetPasswordForm.code.value,
    new_password: resetPasswordForm.new_password.value
  };

  try {
    showLoader();
    const data = await resetPassword(formData);
    hideLoader();
    
    document.getElementById('resetPasswordSuccess').textContent = 'Password reset successfully! You can now login with your new password.';
    resetPasswordForm.reset();
    
    setTimeout(() => {
      showSection('loginSection');
    }, 3000);
    
  } catch (error) {
    hideLoader();
    document.getElementById('resetPasswordError').textContent = typeof error.message === 'string' ? error.message : 'Failed to reset password';
    console.error('Reset password error:', error);
  }
});