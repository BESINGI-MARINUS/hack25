const state = {
  mentors :[],
}

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



  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("show");
  });

  // Optional: close menu when clicking outside
  window.addEventListener("click", (e) => {
    if (
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("show");
    }
  });

  class user  {
    _clearParent(){
      this.parentEl.innerHtml = '';
    }

    render(){
      const markup = this._generateMarkup;
      this._clearParent();
      this.parentEl.insertAdjacentHtml('afterbegin',markup);
    }
  }

  // class mentor extends user{
  //   this.parentEl = document.querySelector('.mentors-grid');
  // }

  const getAllUsers = async function () {
    const response = await fetch('http://my_app.test/api/users');
    const data = await response.json();
    console.log(data)
    state.mentors = data.filter(d=>d.role === 'mentor').map(d=>{
      return {
        name: `${d.first_name} ${d.last_name}`,
        location: d.location,
        user: d.role,
        role:'Tech lead at Orange cameroon',
        bio: 'Experienced tech lead with expertise in backend system and IA. Love helping students transition into tech careers.',
        price:2000,
        skills:['Python','Django','Machine Learning','Data Science']
      }
    })
    console.log(state.mentors)
  }

  getAllUsers()
  