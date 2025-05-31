// Main JavaScript file for TechConnect CM

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize the application
function initializeApp() {
  // Initialize animations
  //   initializeAnimations();

  // Initialize navigation
  initializeNavigation();

  // Initialize forms
  initializeForms();

  // Initialize notifications
  initializeNotifications();

  // Check authentication status
  checkAuthStatus();
}

// Animation utilities
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Add fade-in class to sections
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("fade-in");
  });
}

// Navigation utilities
function initializeNavigation() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Mobile menu toggle (if implemented)
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // Active navigation highlighting
  highlightActiveNavigation();
}

// Highlight active navigation based on current page
function highlightActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.includes(href.replace(".html", ""))) {
      link.classList.add("active");
    }
  });
}

// Form utilities
function initializeForms() {
  // Form validation
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
  });

  // Real-time validation
  const inputs = document.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.addEventListener("blur", validateInput);
    input.addEventListener("input", clearValidationError);
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Basic validation
  if (!validateForm(form)) {
    showNotification("Please fill in all required fields correctly.", "error");
    return;
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<span class="loading"></span> Processing...';
  submitButton.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;

    // Handle different form types
    const formId = form.id;
    switch (formId) {
      case "registerForm":
        handleRegistration(formData);
        break;
      case "loginForm":
        handleLogin(formData);
        break;
      case "contactForm":
        handleContactForm(formData);
        break;
      default:
        showNotification("Form submitted successfully!", "success");
    }
  }, 2000);
}

// Validate entire form
function validateForm(form) {
  const requiredInputs = form.querySelectorAll("[required]");
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!validateInput({ target: input })) {
      isValid = false;
    }
  });

  return isValid;
}

// Validate individual input
function validateInput(e) {
  const input = e.target;
  const value = input.value.trim();
  const type = input.type;
  let isValid = true;
  let errorMessage = "";

  // Remove existing error
  clearValidationError(e);

  // Required field validation
  if (input.hasAttribute("required") && !value) {
    errorMessage = "This field is required";
    isValid = false;
  }
  // Email validation
  else if (type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = "Please enter a valid email address";
      isValid = false;
    }
  }
  // Password validation
  else if (type === "password" && value) {
    if (value.length < 8) {
      errorMessage = "Password must be at least 8 characters long";
      isValid = false;
    }
  }
  // Confirm password validation
  else if (input.id === "confirmPassword" && value) {
    const password = document.getElementById("password").value;
    if (value !== password) {
      errorMessage = "Passwords do not match";
      isValid = false;
    }
  }

  // Show error if invalid
  if (!isValid) {
    showInputError(input, errorMessage);
  }

  return isValid;
}

// Show input error
function showInputError(input, message) {
  input.classList.add("error");

  // Remove existing error message
  const existingError = input.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  errorElement.style.color = "#dc2626";
  errorElement.style.fontSize = "0.875rem";
  errorElement.style.marginTop = "0.25rem";

  input.parentNode.appendChild(errorElement);
}

// Clear validation error
function clearValidationError(e) {
  const input = e.target;
  input.classList.remove("error");

  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Handle registration
function handleRegistration(formData) {
  const userData = {
    userType:
      document.querySelector(".user-type-option.selected")?.dataset.type ||
      "student",
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    company: formData.get("company"),
    position: formData.get("position"),
    skills: formData.get("skills"),
    bio: formData.get("bio"),
  };

  // Store user data (in real app, this would be sent to server)
  localStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("userType", userData.userType);

  showNotification(
    "Account created successfully! Redirecting to dashboard...",
    "success"
  );

  // Redirect to appropriate dashboard
  setTimeout(() => {
    window.location.href = `dashboard-${userData.userType}.html`;
  }, 2000);
}

// Handle login
function handleLogin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const rememberMe = formData.get("rememberMe");

  // Simple validation (in real app, this would be server-side)
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  if (userData.email === email) {
    localStorage.setItem("isAuthenticated", "true");
    if (rememberMe) {
      localStorage.setItem("rememberUser", "true");
    }

    showNotification("Login successful! Redirecting...", "success");

    setTimeout(() => {
      const userType = userData.userType || "student";
      window.location.href = `dashboard-${userType}.html`;
    }, 1500);
  } else {
    showNotification("Invalid email or password", "error");
  }
}

// Handle contact form
function handleContactForm(formData) {
  showNotification(
    "Thank you for your message! We'll get back to you soon.",
    "success"
  );
}

// Notification system
function initializeNotifications() {
  // Create notification container if it doesn't exist
  if (!document.querySelector(".notification-container")) {
    const container = document.createElement("div");
    container.className = "notification-container";
    container.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;
    document.body.appendChild(container);
  }
}

// Show notification
function showNotification(message, type = "info", duration = 5000) {
  const container = document.querySelector(".notification-container");
  const notification = document.createElement("div");

  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  container.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto remove
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// Get notification icon
function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "exclamation-circle";
    case "warning":
      return "exclamation-triangle";
    default:
      return "info-circle";
  }
}

// Check authentication status
function checkAuthStatus() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const currentPage = window.location.pathname;

  // Redirect to login if not authenticated and on protected page
  if (
    !isAuthenticated &&
    (currentPage.includes("dashboard") || currentPage.includes("profile"))
  ) {
    window.location.href = "login.html";
  }

  // Redirect to dashboard if authenticated and on auth page
  if (
    isAuthenticated &&
    (currentPage.includes("login") || currentPage.includes("register"))
  ) {
    const userType = localStorage.getItem("userType") || "student";
    window.location.href = `dashboard-${userType}.html`;
  }
}

// Logout function
function logout() {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userType");
  localStorage.removeItem("userData");
  window.location.href = "index.html";
}

// Search functionality
function initializeSearch() {
  const searchInputs = document.querySelectorAll(".search-input");

  searchInputs.forEach((input) => {
    input.addEventListener("input", debounce(handleSearch, 300));
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle search
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const searchableItems = document.querySelectorAll(".searchable-item");

  searchableItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const isVisible = text.includes(query);
    item.style.display = isVisible ? "block" : "none";
  });
}

// Filter functionality
function initializeFilters() {
  const filterSelects = document.querySelectorAll(".filter-select");

  filterSelects.forEach((select) => {
    select.addEventListener("change", handleFilter);
  });
}

// Handle filter
function handleFilter() {
  const filters = {};
  const filterSelects = document.querySelectorAll(".filter-select");

  filterSelects.forEach((select) => {
    if (select.value && select.value !== "all") {
      filters[select.dataset.filter] = select.value;
    }
  });

  const filterableItems = document.querySelectorAll(".filterable-item");

  filterableItems.forEach((item) => {
    let isVisible = true;

    Object.keys(filters).forEach((filterKey) => {
      const itemValue = item.dataset[filterKey];
      if (itemValue && itemValue !== filters[filterKey]) {
        isVisible = false;
      }
    });

    item.style.display = isVisible ? "block" : "none";
  });
}

// Modal functionality
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id);
  }
});

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

function formatRelativeTime(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
}

// Export functions for use in other files
window.TechConnect = {
  showNotification,
  logout,
  openModal,
  closeModal,
  formatCurrency,
  formatDate,
  formatRelativeTime,
};
