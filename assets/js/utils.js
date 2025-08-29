// Helper Functions
function showLoader() {
  document.getElementById('pageLoader').style.display = "flex";
}

function hideLoader() {
  document.getElementById('pageLoader').style.display = "none";
}

function showSection(sectionId) {
  document.querySelectorAll('.section-container').forEach(section => {
    section.classList.remove('active-section');
  });
  document.getElementById(sectionId).classList.add('active-section');
  window.scrollTo(0, 0);
  clearAllMessages();
}

function clearAllMessages() {
  document.querySelectorAll('.error-message, .success-message').forEach(el => {
    el.textContent = '';
  });
}

function clearAllForms() {
  document.querySelectorAll('form').forEach(form => form.reset());
}

function clearAuthData() {
  localStorage.removeItem('officerToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('officerUniqueId');
  localStorage.removeItem('officerEmail');
}

export {
  showLoader,
  hideLoader,
  showSection,
  clearAllMessages,
  clearAllForms,
  clearAuthData
};