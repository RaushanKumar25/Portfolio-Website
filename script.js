/* ── PARTICLE CANVAS ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -9999, y: -9999 };

  const COLORS = ['rgba(74,240,196,', 'rgba(59,130,246,', 'rgba(167,139,250,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.init = function () {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.6 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    };
    this.init();
  }

  function init() {
    resize();
    particles = Array.from({ length: 160 }, () => new Particle());
  }

  function drawLine(a, b, dist) {
    const opacity = (1 - dist / 150) * 0.18;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(74,240,196,${opacity})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) { p.vx += dx * 0.00008; p.vy += dy * 0.00008; }

      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x  += p.vx;
      p.y  += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 150) drawLine(p, q, d);
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', resize);

  init();
  animate();
})();


/* ── TYPING ANIMATION ── */
(function () {
  const el    = document.getElementById('typing-el');
  const roles = ['Cloud Engineer', 'DevOps Enthusiast', 'Web Developer', 'Problem Solver', 'B.Tech CSE Student'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 45 : 80);
  }
  setTimeout(tick, 900);
})();




(function () {
  /* Step 1: Add animation class FIRST so elements start hidden */
  var animEls = document.querySelectorAll(
    '.about-nametag, .about-role-title, .about-para, ' +
    '.about-info-grid, .about-platforms, .about-cta-row, .about-hc'
  );

  animEls.forEach(function (el) {
    el.classList.add('about-will-animate');
  });

  /* Step 2: Stagger highlight cards */
  document.querySelectorAll('.about-hc').forEach(function (card, i) {
    card.style.transitionDelay = (0.08 + i * 0.13) + 's';
  });

  /* Step 3: Use requestAnimationFrame to ensure DOM has painted
     before observing — fixes the "already visible but never fires" bug */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('about-visible');
            io.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      });

      animEls.forEach(function (el) { io.observe(el); });

    });
  });

})();
/* ════════════════════════════════════════
   SKILLS SECTION — Scroll Reveal
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var cards = document.querySelectorAll('.skill-cat-card');

    /* Step 1: Mark for animation */
    cards.forEach(function (card, i) {
      card.classList.add('skills-will-animate');
      card.style.transitionDelay = (i * 0.1) + 's';
    });

    /* Step 2: Double rAF before observing */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('skills-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.12,
          rootMargin: '0px 0px -20px 0px'
        });

        cards.forEach(function (card) {
          observer.observe(card);
        });

      });
    });

  });

})();