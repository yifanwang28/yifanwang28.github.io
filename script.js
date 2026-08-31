const reveals = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('.panel')];
const progress = document.getElementById('progress');
const sectionNow = document.getElementById('sectionNow');
const bg = document.querySelector('.bg-photo');

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
}, { threshold: [0.3,0.5,0.7] });
sections.forEach(s => sectionObserver.observe(s));

function onScroll(){
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
