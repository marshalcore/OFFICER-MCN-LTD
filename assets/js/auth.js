import { showSection, clearAllMessages, showLoader, hideLoader } from './utils.js';
import { officerSignup, officerLogin } from './api.js';

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

// ... other navigation event listeners ...

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

// ... other auth form handlers ...