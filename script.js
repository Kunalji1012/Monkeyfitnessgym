// Theme toggle with localStorage
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');
const userPref = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    iconSun.style.display = 'none';
    iconMoon.style.display = '';
  } else {
    root.setAttribute('data-theme', 'dark');
    iconSun.style.display = '';
    iconMoon.style.display = 'none';
  }
  localStorage.setItem('theme', theme);
}

setTheme(userPref ? userPref : (prefersDark ? 'dark' : 'light'));

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
});

// Smooth nav active state + offset highlight
const menu = document.getElementById('menu');
const links = [...menu.querySelectorAll('a[href^="#"]')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function syncActive() {
  const pos = window.scrollY + 120;
  let currentId = sections[0]?.id;
  for (const s of sections) {
    if (s.offsetTop <= pos) currentId = s.id;
  }
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
}

window.addEventListener('scroll', syncActive);
window.addEventListener('load', syncActive);

// Scroll reveal using Intersection Observer
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Lightbox for gallery
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');

document.getElementById('galleryGrid').addEventListener('click', e => {
  const img = e.target.closest('img');
  if (!img) return;
  lbImg.src = img.src;
  lb.classList.add('show');
});

lb.addEventListener('click', () => lb.classList.remove('show'));

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lb.classList.contains('show')) {
    lb.classList.remove('show');
  }
});

// Prevent header overlap when jumping to anchors
function offsetHashScroll() {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
window.addEventListener('hashchange', offsetHashScroll);
window.addEventListener('load', () => setTimeout(offsetHashScroll, 0));

// Mobile menu toggle with accessibility
const menuToggle = document.getElementById('menuToggle');

menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.addEventListener('click', () => {
  const isShown = menu.classList.toggle('show');
  menuToggle.setAttribute('aria-expanded', isShown);
});

// Close menu on link click
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    menu.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});
