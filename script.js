function animateCount(el, endValue, duration = 5000) {
    let start = 0;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / duration) * endValue), endValue);
      el.textContent = current;
      if (current < endValue) {
        requestAnimationFrame(step);
      } else {
        el.textContent = endValue; // Make sure it ends exactly
      }
    };

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll(".stat-number span");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const endValue = parseInt(el.dataset.count);
        animateCount(el, endValue);
        observer.unobserve(el); // Prevent re-trigger
      }
    });
  }, {
    threshold: 0.2 // Trigger when 50% in view
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });

  
  const stepContainer = document.querySelector('.steps-grid');
  const steps = document.querySelectorAll('.step');

  const observerSteps = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('visible');
          }, index * 200); // 200ms stagger
        });
        observer.unobserve(entry.target); // Run only once
      }
    });
  }, { threshold: 0.4 });

observerSteps.observe(stepContainer);
