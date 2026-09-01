const reveals = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('.panel')];
const progress = document.getElementById('progress');
const sectionNow = document.getElementById('sectionNow');
const bg = document.querySelector('.bg-photo');
const lightbox = document.getElementById('portraitLightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const researchSection = document.getElementById('research');
const researchReveal = document.querySelector('.research-reveal');
const researchDrawer = document.getElementById('researchDrawer');
const tocShell = document.querySelector('.toc-shell');
const tocTrigger = document.querySelector('.toc-trigger');
const tocLinks = [...document.querySelectorAll('[data-toc]')];
let scrollTimer;

function setTocContext(sectionId) {
  const activeIndex = tocLinks.findIndex(link => link.dataset.toc === sectionId);
  if (activeIndex < 0) return;
  tocLinks.forEach((link, index) => {
    link.classList.toggle('is-current', index === activeIndex);
    link.classList.toggle('is-context', Math.abs(index - activeIndex) <= 1);
  });
}

setTocContext('home');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.14 });
reveals.forEach(el => observer.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const index = sections.indexOf(visible.target) + 1;
  sectionNow.textContent = String(index).padStart(2,'0');
  setTocContext(visible.target.id);
}, { threshold: [0.3,0.5,0.7] });
sections.forEach(s => sectionObserver.observe(s));

function onScroll(){
  document.body.classList.add('is-scrolling');
  tocShell?.classList.remove('is-open');
  tocTrigger?.setAttribute('aria-expanded', 'false');
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => document.body.classList.remove('is-scrolling'), 180);

  const max = document.documentElement.scrollHeight - innerHeight;
  const y = scrollY;
  const pct = max > 0 ? (y / max) * 100 : 0;
  progress.style.height = `${pct}%`;

  // Fixed background subtly moves/zooms while the foreground panels scroll over it.
  const shift = Math.min(70, y * 0.025);
  const scale = 1.04 + Math.min(0.05, y / Math.max(max, 1) * 0.05);
  bg.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

tocTrigger?.addEventListener('click', () => {
  const isOpen = tocShell?.classList.toggle('is-open') ?? false;
  tocTrigger.setAttribute('aria-expanded', String(isOpen));
});

tocLinks.forEach(link => link.addEventListener('click', () => {
  tocShell?.classList.remove('is-open');
  tocTrigger?.setAttribute('aria-expanded', 'false');
}));

researchReveal?.addEventListener('click', () => {
  const isOpen = researchSection?.classList.toggle('research-open') ?? false;
  researchReveal.setAttribute('aria-expanded', String(isOpen));
  researchReveal.setAttribute('aria-label', isOpen ? 'Hide research questions' : 'Reveal research questions');
  researchDrawer?.setAttribute('aria-hidden', String(!isOpen));
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

document.querySelectorAll('[data-lightbox-image]').forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.full || item.querySelector('img').src;
    lightboxImage.alt = item.querySelector('img').alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && tocShell?.classList.contains('is-open')) {
    tocShell.classList.remove('is-open');
    tocTrigger?.setAttribute('aria-expanded', 'false');
  }
  if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox();
});
