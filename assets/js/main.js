document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar-modern');
  const setNavbarState = function () {
    if (!navbar) return;
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
  };
  setNavbarState();
  window.addEventListener('scroll', setNavbarState, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const href = this.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('stat-value')) {
          animateCounter(entry.target);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal, .stat-value').forEach(function (element) {
    observer.observe(element);
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      alert('Thank you — your message has been received.');
      form.reset();
    });
  }
});

function animateCounter(element) {
  if (!element || element.dataset.animated === 'true') return;
  element.dataset.animated = 'true';

  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  const step = function (currentTime) {
    const progress = Math.min((currentTime - start) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = value + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target + suffix;
    }
  };

  requestAnimationFrame(step);
}
