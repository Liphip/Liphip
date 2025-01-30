document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle');
  const toggleText = document.querySelector('.toggle-text');

  function applyTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode', 'system-theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (theme === 'system') {
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDarkScheme) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.add('light-mode');
      }
    } else {
      document.body.classList.add('light-mode');
    }
    localStorage.setItem('theme', theme);
  }

  themeToggle.addEventListener('change', function () {
    const theme = themeToggle.value;
    applyTheme(theme);
  });

  // Set initial theme based on the current selection or localStorage
  const savedTheme = localStorage.getItem('theme') || themeToggle.value;
  themeToggle.value = savedTheme;
  applyTheme(savedTheme);

  // Function to load content dynamically
  function loadContent(url) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.querySelector('main').innerHTML = data;
      })
      .catch(error => console.error('Error loading content:', error));
  }

  // Function to handle URL fragments
  function handleFragment() {
    const fragment = window.location.hash.substring(1);
    if (fragment) {
      loadContent(fragment + '.html');
    } else {
      loadContent('home.html');
    }
  }

  // Event listener for URL hash changes
  window.addEventListener('hashchange', handleFragment);

  // Load content based on the current URL fragment
  handleFragment();
});