// Wanderlust Modern JS Utilities
(() => {
  'use strict'

  // Bootstrap Form Validation
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })

  // Intersection Observer for Reveal Animations
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const scrollTargets = document.querySelectorAll('.reveal');
  scrollTargets.forEach(target => revealObserver.observe(target));

  // Dark Mode Toggle Logic
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
      }
    });
  }

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
      if (savedTheme === 'dark') {
        icon.classList.add('fa-sun');
        icon.classList.remove('fa-moon');
      } else {
        icon.classList.add('fa-moon');
        icon.classList.remove('fa-sun');
      }
    }
  }
})()