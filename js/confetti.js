/* Rad Roots — lightweight canvas confetti (respects reduced motion) */
'use strict';

const Confetti = (() => {
  let canvas, ctx, particles = [], raf = null, dpr = 1;

  function init() {
    canvas = document.getElementById('confetti');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    return true;
  }
  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }

  const PALETTE = ['#2FB26B', '#FFC53D', '#FF5D8F', '#3B82F6', '#8B5CF6', '#FB923C', '#2DD4BF'];

  /** burst({x, y}) in CSS pixels; defaults to top-center */
  function burst({ x = window.innerWidth / 2, y = window.innerHeight * 0.35, count = 90, spread = 1 } = {}) {
    if (prefersReducedMotion()) return;
    if (!canvas && !init()) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (4 + Math.random() * 9) * spread;
      particles.push({
        x: x * dpr, y: y * dpr,
        vx: Math.cos(angle) * speed * dpr, vy: (Math.sin(angle) * speed - 6) * dpr,
        w: (6 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr,
        color: PALETTE[i % PALETTE.length], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        life: 1, decay: 0.008 + Math.random() * 0.01, shape: Math.random() < 0.3 ? 'circle' : 'rect',
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    for (const p of particles) {
      p.vy += 0.28 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5));
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (particles.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  return { burst };
})();
