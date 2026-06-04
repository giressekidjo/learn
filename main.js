/* ═══════════════════════════
   main.js — Porto-Novo Site
═══════════════════════════ */

'use strict';

// ───────────────────────────────
// 1. NAVBAR scroll effect + toggle
// ───────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ───────────────────────────────
// 2. HERO CANVAS — Particle Field
// ───────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  const COLORS = [
    'rgba(212,160,58,',   // or
    'rgba(82,183,136,',   // jade
    'rgba(192,106,44,',   // terracotta
    'rgba(245,232,208,',  // crème
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 2.2 + 0.3,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   -(Math.random() * 0.5 + 0.15),
      life: Math.random(),
      maxLife: Math.random() * 180 + 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.life++;
      if (p.life > p.maxLife) { particles[i] = mkParticle(); particles[i].y = H + 5; }
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { particles[i] = mkParticle(); }

      const progress = p.life / p.maxLife;
      const alpha    = Math.sin(Math.PI * progress) * 0.65;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  draw();
})();

// ───────────────────────────────
// 3. FOREST LEAF PARTICLES (JPN)
// ───────────────────────────────
(function initForestParticles() {
  const container = document.getElementById('forestParticles');
  if (!container) return;

  const LEAVES = ['🌿','🍃','🌱','✦','·'];
  const COUNT  = 18;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className   = 'leaf-particle';
    el.textContent = LEAVES[Math.floor(Math.random() * LEAVES.length)];
    const size  = Math.random() * 16 + 8;
    const delay = Math.random() * 12;
    const dur   = Math.random() * 10 + 14;
    const left  = Math.random() * 100;
    Object.assign(el.style, {
      position:   'absolute',
      left:       left + '%',
      bottom:     '-40px',
      fontSize:   size + 'px',
      opacity:    (Math.random() * 0.25 + 0.05).toFixed(2),
      animation:  `leaf-rise ${dur}s ${delay}s linear infinite`,
      color:      'rgba(82,183,136,0.6)',
      pointerEvents: 'none',
      userSelect: 'none',
    });
    container.appendChild(el);
  }

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes leaf-rise {
      0%   { transform: translateY(0)    rotate(0deg)   scale(0.7); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-110vh) rotate(360deg) scale(1.1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ───────────────────────────────
// 4. INTERSECTION OBSERVER — Reveal
// ───────────────────────────────
(function initReveal() {
  // Animate hero text on load
  const heroEls = document.querySelectorAll('.hero-content .reveal-up');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 180);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    // Skip hero elements (already triggered)
    if (el.closest('#hero')) return;
    obs.observe(el);
  });
})();

// ───────────────────────────────
// 5. COUNTER ANIMATION
// ───────────────────────────────
(function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      const dur    = 1800;
      const start  = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));
})();

// ───────────────────────────────
// 6. ACTIVE NAV LINK on scroll
// ───────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

// ───────────────────────────────
// 7. CRAFT CARD subtle parallax
// ───────────────────────────────
(function initCardTilt() {
  document.querySelectorAll('.craft-card, .tree-card, .spirit-panel').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const x    = (e.clientX - r.left) / r.width  - 0.5;
      const y    = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ───────────────────────────────
// 8. SMOOTH SCROLL polyfill fix
// ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ───────────────────────────────
// 9. NAV ACTIVE style injection
// ───────────────────────────────
(function injectActiveStyle() {
  const s = document.createElement('style');
  s.textContent = `
    .nav-links a.active {
      color: var(--or) !important;
    }
    .nav-links a.active::after {
      width: 100% !important;
    }
    .nav-toggle.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-toggle.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nav-toggle.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `;
  document.head.appendChild(s);
})();

// ───────────────────────────────
// 10. PAGE LOAD transition
// ───────────────────────────────
(function pageEntrance() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();
