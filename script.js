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
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
music.volume = 1;
function updateMusicToggle() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  musicToggle.dataset.tooltip = playing ? 'Pause music' : 'Play music';
}
music.addEventListener('play', updateMusicToggle);
music.addEventListener('pause', updateMusicToggle);
music.addEventListener('ended', updateMusicToggle);

const introMusic = document.getElementById('intro-music');
const introToggle = document.getElementById('intro-toggle');
const introStop = document.getElementById('intro-stop');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let introScrollFrame;
let introScrollActive = false;
let introScrollStart = 0;
let introScrollTime = 0;

function stopIntroScroll() {
  introScrollActive = false;
  cancelAnimationFrame(introScrollFrame);
}
function scrollWithIntro() {
  if (!introScrollActive || introMusic.paused || introMusic.ended) return;
  const remaining = introMusic.duration - introScrollTime;
  if (Number.isFinite(remaining) && remaining > 0) {
    const progress = Math.min(1, Math.max(0, (introMusic.currentTime - introScrollTime) / remaining));
    const eased = progress * progress * (3 - 2 * progress);
    const bottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: introScrollStart + (bottom - introScrollStart) * eased, behavior: 'instant' });
  }
  introScrollFrame = requestAnimationFrame(scrollWithIntro);
}
function startIntroScroll() {
  stopIntroScroll();
  if (reducedMotion.matches) return;
  introScrollStart = window.scrollY;
  introScrollTime = introMusic.currentTime;
  introScrollActive = true;
  scrollWithIntro();
}
// Manual navigation hands scrolling back to the visitor; the music can continue.
window.addEventListener('wheel', stopIntroScroll, { passive: true });
window.addEventListener('touchstart', stopIntroScroll, { passive: true });
window.addEventListener('pointerdown', stopIntroScroll, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) stopIntroScroll();
});
reducedMotion.addEventListener('change', stopIntroScroll);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) introMusic.pause();
});
introStop.addEventListener('click', () => introMusic.pause());
introToggle.title = 'Play the intro and scroll through the portfolio';
function updateIntroToggle() {
  const playing = !introMusic.paused && !introMusic.ended;
  introToggle.textContent = playing ? 'Pause intro' : 'Play intro';
  introToggle.setAttribute('aria-pressed', String(playing));
  introStop.hidden = !playing;
}
introMusic.addEventListener('play', updateIntroToggle);
introMusic.addEventListener('play', startIntroScroll);
introMusic.addEventListener('pause', updateIntroToggle);
introMusic.addEventListener('pause', stopIntroScroll);
introMusic.addEventListener('ended', updateIntroToggle);
introMusic.addEventListener('ended', stopIntroScroll);
introToggle.addEventListener('click', async () => {
  if (!introMusic.paused) {
    introMusic.pause();
    return;
  }
  music.pause();
  try {
    await introMusic.play();
  } catch {
    updateIntroToggle();
    clearTimeout(resetTimer);
    status.textContent = 'Intro could not play. Please try again.';
    resetTimer = setTimeout(() => { status.textContent = ''; }, 5000);
  }
});
musicToggle.addEventListener('click', async () => {
  introMusic.pause();
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch {
    updateMusicToggle();
    clearTimeout(resetTimer);
    status.textContent = 'Music could not play. Please try again.';
    resetTimer = setTimeout(() => { status.textContent = ''; }, 5000);
  }
});
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
