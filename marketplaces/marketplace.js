"use strict";
class TechConnectMarketplace {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.filters = {
      search: "",
      location: "",
      skill: "",
      type: "",
      level: "",
      duration: "",
      field: "",
    };
    this.sortBy = "recent";
    this.currentData = [];
    this.filteredData = [];

    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("mentors")) return "mentors";
    if (path.includes("jobs")) return "jobs";
    if (path.includes("internships")) return "internships";
    return "mentors"; // default
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.setupMobileMenu();
    this.initializeFilters();
  }

  loadData() {
    // Sample data for each marketplace
    this.data = {
      mentors: [
        {
          id: 1,
          name: "Dr. Sarah Mbah",
          title: "Senior Software Engineer",
          company: "MTN Cameroon",
          location: "Yaoundé",
          rating: 4.9,
          reviews: 127,
          hourlyRate: 15000,
          skills: ["React", "Node.js", "TypeScript", "AWS"],
          bio: "10+ years experience in full-stack development. Passionate about mentoring the next generation of developers.",
          avatar: "/placeholder.svg?height=80&width=80",
          availability: "Available",
          totalSessions: 450,
          responseTime: "< 2 hours",
        },
        {
          id: 2,
          name: "John Tabi",
          title: "Tech Lead",
          company: "Orange Cameroon",
          location: "Douala",
          rating: 4.8,
          reviews: 89,
          hourlyRate: 12000,
          skills: ["Python", "Django", "Machine Learning", "Data Science"],
          bio: "Experienced tech lead with expertise in backend systems and AI. Love helping students transition into tech careers.",
          avatar: "/placeholder.svg?height=80&width=80",
          availability: "Available",
          totalSessions: 320,
          responseTime: "< 4 hours",
        },
        {
          id: 3,
          name: "Marie Fotso",
          title: "Product Manager",
          company: "Jumia Cameroon",
          location: "Yaoundé",
          rating: 4.7,
          reviews: 156,
          hourlyRate: 18000,
          skills: ["Product Management", "UX Design", "Agile", "Strategy"],
          bio: "Product management expert with 8 years experience. Specialized in helping students understand product thinking.",
          avatar: "/placeholder.svg?height=80&width=80",
          availability: "Busy",
          totalSessions: 280,
          responseTime: "< 6 hours",
        },
        {
          id: 4,
          name: "Paul Ngwa",
          title: "DevOps Engineer",
          company: "Freelance",
          location: "Bamenda",
          rating: 4.9,
          reviews: 203,
          hourlyRate: 10000,
          skills: ["Docker", "Kubernetes", "CI/CD", "Linux"],
          bio: "DevOps specialist helping students master cloud technologies and deployment strategies.",
          avatar: "/placeholder.svg?height=80&width=80",
          availability: "Available",
          totalSessions: 380,
          responseTime: "< 1 hour",
        },
      ],
      jobs: [
        {
          id: 1,
          title: "Frontend Developer",
          company: "MTN Cameroon",
          location: "Yaoundé",
          type: "Full-time",
          level: "Mid-level",
          salary: "800,000 - 1,200,000 FCFA",
          postedDate: "2 days ago",
          description:
            "We're looking for a skilled Frontend Developer to join our digital transformation team...",
          requirements: [
            "3+ years React experience",
            "TypeScript proficiency",
            "REST API integration",
          ],
          skills: ["React", "TypeScript", "CSS", "JavaScript"],
          applicants: 45,
          remote: false,
        },
        {
          id: 2,
          title: "Backend Engineer",
          company: "Orange Cameroon",
          location: "Douala",
          type: "Full-time",
          level: "Senior",
          salary: "1,200,000 - 1,800,000 FCFA",
          postedDate: "1 week ago",
          description:
            "Join our backend team to build scalable microservices and APIs...",
          requirements: [
            "5+ years Python/Django",
            "Microservices architecture",
            "Cloud platforms",
          ],
          skills: ["Python", "Django", "PostgreSQL", "AWS"],
          applicants: 32,
          remote: true,
        },
        {
          id: 3,
          title: "Mobile App Developer",
          company: "Jumia Cameroon",
          location: "Yaoundé",
          type: "Full-time",
          level: "Mid-level",
          salary: "700,000 - 1,000,000 FCFA",
          postedDate: "3 days ago",
          description:
            "Develop and maintain our mobile applications for iOS and Android platforms...",
          requirements: [
            "React Native experience",
            "Mobile app deployment",
            "API integration",
          ],
          skills: ["React Native", "JavaScript", "iOS", "Android"],
          applicants: 28,
          remote: false,
        },
      ],
      internships: [
        {
          id: 1,
          title: "Frontend Development Intern",
          company: "MTN Cameroon",
          location: "Yaoundé",
          duration: "3 months",
          field: "Web Development",
          stipend: "150,000 FCFA/month",
          postedDate: "1 day ago",
          description:
            "Join our development team to work on customer-facing web applications using modern technologies...",
          requirements: [
            "Basic React knowledge",
            "HTML/CSS proficiency",
            "JavaScript fundamentals",
          ],
          skills: ["React", "JavaScript", "CSS", "Git"],
          applicants: 23,
          startDate: "March 2024",
          mentorshipIncluded: true,
          remote: false,
        },
        {
          id: 2,
          title: "Data Science Intern",
          company: "Orange Cameroon",
          location: "Douala",
          duration: "6 months",
          field: "Data Science",
          stipend: "200,000 FCFA/month",
          postedDate: "3 days ago",
          description:
            "Work with our data team to analyze customer behavior and build predictive models...",
          requirements: [
            "Python basics",
            "Statistics knowledge",
            "SQL fundamentals",
          ],
          skills: ["Python", "SQL", "Statistics", "Machine Learning"],
          applicants: 18,
          startDate: "April 2024",
          mentorshipIncluded: true,
          remote: true,
        },
      ],
    };

    this.currentData = this.data[this.currentPage] || [];
    this.filteredData = [...this.currentData];
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    // Filter selects
    const filterSelects = document.querySelectorAll(".filter-select");
    filterSelects.forEach((select) => {
      select.addEventListener("change", (e) => {
        const filterType = this.getFilterType(select);
        this.filters[filterType] = e.target.value;
        this.applyFilters();
      });
    });

    // Sort functionality
    const sortSelect = document.querySelector(".sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applySorting();
      });
    }

    // Action buttons
    this.bindActionButtons();

    // Load more functionality
    const loadMoreBtn = document.querySelector(".load-more .btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMore();
      });
    }
  }

  getFilterType(selectElement) {
    const placeholder = selectElement
      .querySelector('option[value=""]')
      ?.textContent.toLowerCase();
    if (placeholder?.includes("skill")) return "skill";
    if (placeholder?.includes("location")) return "location";
    if (placeholder?.includes("type")) return "type";
    if (placeholder?.includes("level")) return "level";
    if (placeholder?.includes("duration")) return "duration";
    if (placeholder?.includes("field")) return "field";
    return "location"; // default
  }

  applyFilters() {
    this.filteredData = this.currentData.filter((item) => {
      // Search filter
      if (this.filters.search) {
        const searchMatch =
          item.name?.toLowerCase().includes(this.filters.search) ||
          item.title?.toLowerCase().includes(this.filters.search) ||
          item.company?.toLowerCase().includes(this.filters.search) ||
          item.skills?.some((skill) =>
            skill.toLowerCase().includes(this.filters.search)
          );

        if (!searchMatch) return false;
      }

      // Location filter
      if (this.filters.location && this.filters.location !== "all") {
        if (item.location !== this.filters.location) return false;
      }

      // Skill filter (for mentors)
      if (this.filters.skill && this.filters.skill !== "allSkills") {
        if (!item.skills?.includes(this.filters.skill)) return false;
      }

      // Type filter (for jobs)
      if (this.filters.type && this.filters.type !== "all") {
        if (item.type !== this.filters.type) return false;
      }

      // Level filter (for jobs)
      if (this.filters.level && this.filters.level !== "all") {
        if (item.level !== this.filters.level) return false;
      }

      // Duration filter (for internships)
      if (this.filters.duration && this.filters.duration !== "all") {
        if (item.duration !== this.filters.duration) return false;
      }

      // Field filter (for internships)
      if (this.filters.field && this.filters.field !== "all") {
        if (item.field !== this.filters.field) return false;
      }

      return true;
    });

    this.applySorting();
    this.updateResultsCount();
    this.renderResults();
  }

  applySorting() {
    this.filteredData.sort((a, b) => {
      switch (this.sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price-low":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "price-high":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case "experience":
          return (b.totalSessions || 0) - (a.totalSessions || 0);
        case "salary-high":
          return this.extractSalary(b.salary) - this.extractSalary(a.salary);
        case "salary-low":
          return this.extractSalary(a.salary) - this.extractSalary(b.salary);
        case "applicants":
          return (a.applicants || 0) - (b.applicants || 0);
        case "stipend-high":
          return (
            this.extractStipend(b.stipend) - this.extractStipend(a.stipend)
          );
        case "duration-short":
          return (
            this.extractDuration(a.duration) - this.extractDuration(b.duration)
          );
        case "recent":
        default:
          return (
            this.getDateValue(b.postedDate) - this.getDateValue(a.postedDate)
          );
      }
    });

    this.renderResults();
  }

  extractSalary(salaryString) {
    if (!salaryString) return 0;
    const numbers = salaryString.match(/[\d,]+/g);
    if (numbers && numbers.length > 0) {
      return Number.parseInt(numbers[0].replace(/,/g, ""));
    }
    return 0;
  }

  extractStipend(stipendString) {
    if (!stipendString) return 0;
    const numbers = stipendString.match(/[\d,]+/g);
    if (numbers && numbers.length > 0) {
      return Number.parseInt(numbers[0].replace(/,/g, ""));
    }
    return 0;
  }

  extractDuration(durationString) {
    if (!durationString) return 0;
    const match = durationString.match(/(\d+)/);
    return match ? Number.parseInt(match[1]) : 0;
  }

  getDateValue(dateString) {
    if (!dateString) return 0;
    if (dateString.includes("day")) {
      const days = Number.parseInt(dateString.match(/(\d+)/)?.[1] || "0");
      return Date.now() - days * 24 * 60 * 60 * 1000;
    }
    if (dateString.includes("week")) {
      const weeks = Number.parseInt(dateString.match(/(\d+)/)?.[1] || "0");
      return Date.now() - weeks * 7 * 24 * 60 * 60 * 1000;
    }
    return Date.now();
  }

  updateResultsCount() {
    const countElement = document.querySelector(".results-count");
    if (countElement) {
      const count = this.filteredData.length;
      const itemType =
        this.currentPage === "mentors"
          ? "mentors"
          : this.currentPage === "jobs"
          ? "jobs"
          : "internships";
      countElement.textContent = `${count} ${itemType} found`;
    }
  }

  renderResults() {
    const container = this.getResultsContainer();
    if (!container) return;

    container.innerHTML = "";

    this.filteredData.forEach((item) => {
      const element = this.createItemElement(item);
      container.appendChild(element);
    });

    // Re-bind action buttons for new elements
    this.bindActionButtons();
  }

  getResultsContainer() {
    if (this.currentPage === "mentors") {
      return document.querySelector(".mentors-grid");
    } else {
      return document.querySelector(".jobs-list");
    }
  }

  createItemElement(item) {
    if (this.currentPage === "mentors") {
      return this.createMentorCard(item);
    } else if (this.currentPage === "jobs") {
      return this.createJobCard(item);
    } else {
      return this.createInternshipCard(item);
    }
  }

  createMentorCard(mentor) {
    const card = document.createElement("div");
    card.className = "mentor-card";
    card.innerHTML = `
              <div class="mentor-header">
                  <div class="mentor-avatar">
                      <img src="${mentor.avatar}" alt="${mentor.name}">
                  </div>
                  <div class="mentor-info">
                      <div class="mentor-title-section">
                          <h3 class="mentor-name">${mentor.name}</h3>
                          <span class="availability-badge ${mentor.availability.toLowerCase()}">${
      mentor.availability
    }</span>
                      </div>
                      <p class="mentor-title">${mentor.title} at ${
      mentor.company
    }</p>
                      <div class="mentor-location">
                          <i class="fas fa-map-marker-alt"></i>
                          <span>${mentor.location}</span>
                      </div>
                  </div>
              </div>
              <div class="mentor-stats">
                  <div class="stat-item">
                      <i class="fas fa-star"></i>
                      <span class="rating">${mentor.rating}</span>
                      <span class="reviews">(${mentor.reviews} reviews)</span>
                  </div>
                  <div class="stat-item">
                      <i class="fas fa-users"></i>
                      <span>${mentor.totalSessions} sessions</span>
                  </div>
                  <div class="stat-item">
                      <i class="fas fa-clock"></i>
                      <span>${mentor.responseTime}</span>
                  </div>
              </div>
              <p class="mentor-bio">${mentor.bio}</p>
              <div class="mentor-skills">
                  ${mentor.skills
                    .map((skill) => `<span class="skill-badge">${skill}</span>`)
                    .join("")}
              </div>
              <div class="mentor-footer">
                  <div class="pricing">
                      <span class="price">${mentor.hourlyRate.toLocaleString()} FCFA</span>
                      <span class="period">/hour</span>
                  </div>
                  <div class="mentor-actions">
                      <button class="btn btn-outline btn-sm" data-action="message" data-id="${
                        mentor.id
                      }">
                          <i class="fas fa-comment"></i>
                          Message
                      </button>
                      <button class="btn btn-primary btn-sm" data-action="book" data-id="${
                        mentor.id
                      }">
                          <i class="fas fa-calendar"></i>
                          Book Session
                      </button>
                  </div>
              </div>
          `;
    return card;
  }

  createJobCard(job) {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
              <div class="job-header">
                  <div class="company-logo">
                      <i class="fas fa-building"></i>
                  </div>
                  <div class="job-info">
                      <div class="job-title-section">
                          <h3 class="job-title">${job.title}</h3>
                          <span class="job-level-badge">${job.level}</span>
                          ${
                            job.remote
                              ? '<span class="remote-badge">Remote</span>'
                              : ""
                          }
                      </div>
                      <p class="company-name">${job.company}</p>
                      <div class="job-meta">
                          <div class="meta-item">
                              <i class="fas fa-map-marker-alt"></i>
                              <span>${job.location}</span>
                          </div>
                          <div class="meta-item">
                              <i class="fas fa-briefcase"></i>
                              <span>${job.type}</span>
                          </div>
                          <div class="meta-item">
                              <i class="fas fa-dollar-sign"></i>
                              <span>${job.salary}</span>
                          </div>
                      </div>
                      <p class="posted-date">${job.postedDate}</p>
                  </div>
              </div>
              <p class="job-description">${job.description}</p>
              <div class="job-requirements">
                  <h4>Key Requirements:</h4>
                  <ul>
                      ${job.requirements
                        .map((req) => `<li>${req}</li>`)
                        .join("")}
                  </ul>
              </div>
              <div class="job-skills">
                  ${job.skills
                    .map((skill) => `<span class="skill-badge">${skill}</span>`)
                    .join("")}
              </div>
              <div class="job-footer">
                  <div class="applicants-count">
                      <i class="fas fa-clock"></i>
                      <span>${job.applicants} applicants</span>
                  </div>
                  <div class="job-actions">
                      <button class="btn btn-outline btn-sm" data-action="save" data-id="${
                        job.id
                      }">Save Job</button>
                      <button class="btn btn-primary btn-sm" data-action="apply" data-id="${
                        job.id
                      }">Apply Now</button>
                  </div>
              </div>
          `;
    return card;
  }

  createInternshipCard(internship) {
    const card = document.createElement("div");
    card.className = "job-card internship-card";
    card.innerHTML = `
              <div class="job-header">
                  <div class="company-logo">
                      <i class="fas fa-building"></i>
                  </div>
                  <div class="job-info">
                      <div class="job-title-section">
                          <h3 class="job-title">${internship.title}</h3>
                          <span class="field-badge">${internship.field}</span>
                          ${
                            internship.mentorshipIncluded
                              ? '<span class="mentorship-badge">Mentorship Included</span>'
                              : ""
                          }
                          ${
                            internship.remote
                              ? '<span class="remote-badge">Remote</span>'
                              : ""
                          }
                      </div>
                      <p class="company-name">${internship.company}</p>
                      <div class="job-meta">
                          <div class="meta-item">
                              <i class="fas fa-map-marker-alt"></i>
                              <span>${internship.location}</span>
                          </div>
                          <div class="meta-item">
                              <i class="fas fa-clock"></i>
                              <span>${internship.duration}</span>
                          </div>
                          <div class="meta-item">
                              <i class="fas fa-calendar"></i>
                              <span>Starts ${internship.startDate}</span>
                          </div>
                      </div>
                      <p class="posted-date">${internship.postedDate}</p>
                      <p class="stipend">${internship.stipend}</p>
                  </div>
              </div>
              <p class="job-description">${internship.description}</p>
              <div class="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                      ${internship.requirements
                        .map((req) => `<li>${req}</li>`)
                        .join("")}
                  </ul>
              </div>
              <div class="job-skills">
                  ${internship.skills
                    .map((skill) => `<span class="skill-badge">${skill}</span>`)
                    .join("")}
              </div>
              <div class="job-footer">
                  <div class="applicants-count">
                      <i class="fas fa-users"></i>
                      <span>${internship.applicants} applicants</span>
                  </div>
                  <div class="job-actions">
                      <button class="btn btn-outline btn-sm" data-action="save" data-id="${
                        internship.id
                      }">Save</button>
                      <button class="btn btn-primary btn-sm" data-action="apply" data-id="${
                        internship.id
                      }">Apply Now</button>
                  </div>
              </div>
          `;
    return card;
  }

  bindActionButtons() {
    // Message buttons
    document.querySelectorAll('[data-action="message"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        this.handleMessage(id);
      });
    });

    // Book session buttons
    document.querySelectorAll('[data-action="book"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        this.handleBookSession(id);
      });
    });

    // Save buttons
    document.querySelectorAll('[data-action="save"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        this.handleSave(id);
      });
    });

    // Apply buttons
    document.querySelectorAll('[data-action="apply"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        this.handleApply(id);
      });
    });
  }

  handleMessage(id) {
    this.showNotification("Message sent successfully!", "success");
    // In a real app, this would open a messaging interface
    console.log("Opening message for ID:", id);
  }

  handleBookSession(id) {
    // In a real app, this would redirect to booking page
    window.location.href = "payment.html";
  }

  handleSave(id) {
    const btn = document.querySelector(`[data-action="save"][data-id="${id}"]`);
    if (btn.textContent.includes("Save")) {
      btn.innerHTML = '<i class="fas fa-check"></i> Saved';
      btn.classList.add("saved");
      this.showNotification("Item saved successfully!", "success");
    } else {
      btn.innerHTML = btn.innerHTML.includes("Job") ? "Save Job" : "Save";
      btn.classList.remove("saved");
      this.showNotification("Item removed from saved items", "info");
    }
  }

  handleApply(id) {
    this.showNotification("Application submitted successfully!", "success");
    // In a real app, this would handle the application process
    console.log("Applying for ID:", id);
  }

  loadMore() {
    // Simulate loading more data
    this.showNotification("Loading more items...", "info");

    setTimeout(() => {
      // In a real app, this would fetch more data from the server
      this.showNotification("No more items to load", "info");
    }, 1000);
  }

  setupMobileMenu() {
    // Add mobile menu toggle if needed
    const header = document.querySelector(".header");
    if (window.innerWidth <= 768) {
      // Mobile-specific functionality can be added here
    }
  }

  initializeFilters() {
    // Set initial filter values based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    Object.keys(this.filters).forEach((key) => {
      const value = urlParams.get(key);
      if (value) {
        this.filters[key] = value;
        const select = document.querySelector(`select[data-filter="${key}"]`);
        if (select) {
          select.value = value;
        }
      }
    });

    this.applyFilters();
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
              <div class="notification-content">
                  <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                  <span>${message}</span>
              </div>
              <button class="notification-close">
                  <i class="fas fa-times"></i>
              </button>
          `;

    // Add styles
    notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: ${this.getNotificationColor(type)};
              color: white;
              padding: 1rem;
              border-radius: 0.5rem;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              z-index: 1000;
              display: flex;
              align-items: center;
              gap: 1rem;
              max-width: 400px;
              animation: slideIn 0.3s ease-out;
          `;

    // Add animation styles
    if (!document.querySelector("#notification-styles")) {
      const styles = document.createElement("style");
      styles.id = "notification-styles";
      styles.textContent = `
                  @keyframes slideIn {
                      from {
                          transform: translateX(100%);
                          opacity: 0;
                      }
                      to {
                          transform: translateX(0);
                          opacity: 1;
                      }
                  }
                  .notification-content {
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      flex: 1;
                  }
                  .notification-close {
                      background: none;
                      border: none;
                      color: white;
                      cursor: pointer;
                      padding: 0.25rem;
                  }
              `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  getNotificationIcon(type) {
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

  getNotificationColor(type) {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  }
}



// Initialize the marketplace when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TechConnectMarketplace();
});

// Additional utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-CM", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

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

// Export for use in other files if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = TechConnectMarketplace;
}