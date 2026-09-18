'use strict';
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(light) {
  root.classList.toggle('light', light);
  themeToggle.querySelector('svg').innerHTML = light
    ? '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
  root.classList.toggle('dark', !light);
  themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
  document.querySelector('meta[name="theme-color"]').content = light ? '#ffffff' : '#000000';
}
try { applyTheme(localStorage.getItem('ayush-theme') === 'light'); } catch { applyTheme(false); }
themeToggle.addEventListener('click', () => {
  const light = !root.classList.contains('light');
  applyTheme(light);
  try { localStorage.setItem('ayush-theme', light ? 'light' : 'dark'); } catch { /* Theme still works without storage. */ }
});
const status = document.getElementById('copy-status');
let resetTimer;
document.querySelectorAll('[data-copy-email]').forEach(button => {
  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText('ayushgopal17@gmail.com');
      status.textContent = 'Email copied';
    } catch {
      status.textContent = 'Email: ayushgopal17@gmail.com';
    }
    resetTimer = setTimeout(() => { status.textContent = ''; }, 5000);
  });
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(section => {
    if (section.getBoundingClientRect().top > window.innerHeight) {
      section.classList.add('pending');
      observer.observe(section);
    }
  });
}
