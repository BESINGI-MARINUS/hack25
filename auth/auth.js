// Authentication specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Initialize user type selection
    initializeUserTypeSelection();
    
    // Initialize role-specific fields
    initializeRoleSpecificFields();
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type');
    
    if (userType) {
        selectUserType(userType);
    }
}

// User type selection
function initializeUserTypeSelection() {
    const userTypeOptions = document.querySelectorAll('.user-type-option');
    
    userTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            userTypeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Update role-specific fields
            updateRoleSpecificFields(option.dataset.type);
        });
    });
}

// Select user type programmatically
function selectUserType(type) {
    const option = document.querySelector(`[data-type="${type}"]`);
    if (option) {
        option.click();
    }
}

// Initialize role-specific fields
function initializeRoleSpecificFields() {
    const roleSpecificFields = document.getElementById('roleSpecificFields');
    const skillsField = document.getElementById('skillsField');
    
    if (roleSpecificFields) {
        roleSpecificFields.classList.add('hidden');
    }
}

// Update role-specific fields based on user type
function updateRoleSpecificFields(userType) {
    const roleSpecificFields = document.getElementById('roleSpecificFields');
    const skillsField = document.getElementById('skillsField');
    const companyField = document.getElementById('company');
    const positionField = document.getElementById('position');
    
    // Show/hide role-specific fields
    if (userType === 'mentor' || userType === 'employer') {
        roleSpecificFields.classList.remove('hidden');
        companyField.required = true;
        positionField.required = true;
    } else {
        roleSpecificFields.classList.add('hidden');
        companyField.required = false;
        positionField.required = false;
    }
    
    // Show/hide skills field
    if (userType === 'employer') {
        skillsField.classList.add('hidden');
    } else {
        skillsField.classList.remove('hidden');
    }
}

// Enhanced form validation for auth forms
function validateAuthForm(form) {
    const userTypeSelected = document.querySelector('.user-type-option.selected');
    
    if (form.id === 'registerForm' && !userTypeSelected) {
        showNotification('Please select your user type', 'error');
        return false;
    }
    
    return true;
}

// Password strength indicator
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

function updatePasswordStrength(e) {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    
    // Create or update strength indicator
    let indicator = document.querySelector('.password-strength');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'password-strength';
        indicator.style.cssText = `
            margin-top: 0.5rem;
            height: 4px;
            background: #e5e7eb;
            border-radius: 2px;
            overflow: hidden;
        `;
        
        const bar = document.createElement('div');
        bar.className = 'strength-bar';
        bar.style.cssText = `
            height: 100%;
            transition: width 0.3s ease, background-color 0.3s ease;
        `;
        
        indicator.appendChild(bar);
        e.target.parentNode.appendChild(indicator);
    }
    
    const bar = indicator.querySelector('.strength-bar');
    const colors = ['#dc2626', '#ea580c', '#d97706', '#16a34a'];
    const widths = ['25%', '50%', '75%', '100%'];
    
    bar.style.width = widths[strength - 1] || '0%';
    bar.style.backgroundColor = colors[strength - 1] || '#e5e7eb';
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 4);
}

// Social login (placeholder)
function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-login-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = button.dataset.provider;
            handleSocialLogin(provider);
        });
    });
}

function handleSocialLogin(provider) {
    showNotification(`${provider} login is not yet implemented`, 'info');
}

// Remember me functionality
function handleRememberMe() {
    const rememberCheckbox = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    
    if (rememberCheckbox && emailInput) {
        // Load remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
        
        // Save email when form is submitted
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', () => {
                if (rememberCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', emailInput.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
            });
        }
    }
}

// Initialize all auth features
initializePasswordStrength();
initializeSocialLogin();
handleRememberMe();