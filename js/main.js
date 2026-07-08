/* ============================================
   绿豪农业官网 — 旗舰版交互脚本
   ============================================ */

// ===== 鼠标光晕 =====
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

let glowTimeout;
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  glow.classList.add('active');
  clearTimeout(glowTimeout);
  glowTimeout = setTimeout(() => glow.classList.remove('active'), 2000);
});

// ===== Count-up for new hero =====
function runCountUp(el){
  const target = parseInt(el.getAttribute('data-to'));
  if(isNaN(target)) return;
  const duration = 2000;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now-start)/duration, 1);
    const val = Math.floor(p * target);
    el.textContent = val >= 1000 ? val.toLocaleString() : val;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const hObs = new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.count-up').forEach(runCountUp);hObs.unobserve(e.target)}})
},{threshold:.3});
const heroNums = document.querySelector('.hero-nums');
if(heroNums) hObs.observe(heroNums);

// Stats bar counter
const sObs = new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.stat-num').forEach(el=>{
    const t = parseInt(el.getAttribute('data-target'));
    if(!isNaN(t)) runCountUp2(el, t);
  });sObs.unobserve(e.target)}})
},{threshold:.5});
function runCountUp2(el, target){
  const d=1800,s=performance.now();
  function t(n){const p=Math.min((n-s)/d,1);const v=Math.floor(p*target);el.textContent=p>=1?target.toLocaleString():v.toLocaleString();if(p<1)requestAnimationFrame(t)}
  requestAnimationFrame(t);
}
const sb = document.querySelector('.stats-bar');
if(sb) sObs.observe(sb);

// ===== 粒子系统 =====
(function(){
  const heroEl = document.querySelector('.hero-new') || document.querySelector('.hero');
  if(!heroEl) return;
  const container = document.createElement('div');
  container.className = 'particles';
  heroEl.appendChild(container);

  const colors = ['#44c06d','#6ed48f','#a3e6b8','#e8b84b','#f2d68b'];
  for(let i=0;i<25;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random()*6;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      bottom:-20px;
      animation-duration:${8+Math.random()*20}s;
      animation-delay:${Math.random()*15}s;
    `;
    container.appendChild(p);
  }
})();

// ===== 数字滚动计数器 =====
function animateCount(el, target, duration=1800){
  const start = 0;
  const startTime = performance.now();
  const hasPlus = String(target).includes('+');
  const num = parseInt(target);
  function update(now){
    const elapsed = now - startTime;
    const progress = Math.min(elapsed/duration, 1);
    const eased = 1 - Math.pow(1-progress, 3); // ease-out cubic
    const current = Math.floor(eased * num);
    el.textContent = current.toLocaleString() + (hasPlus?'+':'');
    if(progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const fadeEls = document.querySelectorAll('.service-card, .product-card, .news-card, .value-card, .timeline-item');
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all .7s cubic-bezier(.16,1,.3,1)';
});

const numObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      numObserver.unobserve(entry.target);
    }
  });
}, observerOptions);
fadeEls.forEach(el => numObserver.observe(el));

// Stats counter animation
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = el.getAttribute('data-target') || el.textContent.trim();
        animateCount(el, target);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsBar = document.querySelector('.stats-bar');
if(statsBar) statObserver.observe(statsBar);

// Hero stats counter
const heroStats = document.querySelector('.hero-card .stats');
if(heroStats){
  const heroObs = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting){
      heroStats.querySelectorAll('.num').forEach(el => {
        const target = el.getAttribute('data-target') || el.textContent.trim();
        animateCount(el, target, 2200);
      });
      heroObs.unobserve(heroStats);
    }
  }, { threshold: 0.3 });
  heroObs.observe(heroStats);
}

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const now = window.scrollY;
  navbar.classList.toggle('scrolled', now > 50);
  // Hide on scroll down, show on scroll up (mobile)
  if(now > 200 && now > lastScroll && !navLinks.classList.contains('open')){
    navbar.style.transform = 'translateY(-100%)';
  }else{
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = now;
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Hero parallax =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroFloats = document.querySelectorAll('.hero-float');
  if(heroFloats.length && scrolled < window.innerHeight){
    heroFloats[0].style.transform = `translateY(${scrolled * 0.15}px)`;
    if(heroFloats[1]) heroFloats[1].style.transform = `translateY(${-scrolled * 0.1}px)`;
  }
  // Hero text parallax
  const heroText = document.querySelector('.hero-text');
  if(heroText && scrolled < window.innerHeight){
    heroText.style.transform = `translateY(${scrolled * 0.08}px)`;
    heroText.style.opacity = 1 - scrolled/(window.innerHeight * 0.8);
  }
});

// ===== Gold sweep effect on stat cards =====
document.querySelectorAll('.hero-card .stat').forEach(stat => {
  stat.addEventListener('mousemove', function(e){
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--mx', x + 'px');
    this.style.setProperty('--my', y + 'px');
  });
});

// ===== Product tab switcher =====
const tabs = document.querySelectorAll('.product-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function(){
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    // Pulse animation
    this.style.transform = 'scale(1.05)';
    setTimeout(() => this.style.transform = 'scale(1)', 200);
  });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Toast notification (for forms) =====
function showToast(msg){
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
    background:var(--green-900);color:#fff;padding:14px 28px;
    border-radius:50px;font-size:14px;font-weight:600;
    z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,.2);
    animation:toastIn .4s ease,toastOut .4s ease 2.5s forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Attach to forms
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', function(e){
    e.preventDefault();
    showToast('✓ 留言已提交，我们会尽快与您联系！');
    this.reset();
  });
});

// Add toast CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes toastOut{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(20px)}}
`;
document.head.appendChild(toastStyle);

console.log('🌾 绿豪农业官网 — 旗舰版已就绪');
