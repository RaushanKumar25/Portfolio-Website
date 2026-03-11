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




/* ════════════════════════════════════════
   PROJECTS SECTION — Scroll Reveal + Mouse Glow
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var cards = document.querySelectorAll('.proj-card');

    /* Step 1: Mark for entrance animation */
    cards.forEach(function (card, i) {
      card.classList.add('proj-will-animate');
      card.style.transitionDelay = (i * 0.12) + 's';
    });

    /* Step 2: Mouse-tracking glow per card */
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });

    /* ── PixelFrame lightbox hover effect ── */
var pfCards = document.querySelectorAll('.pf-img-card');
var pfLightbox = document.getElementById('pf-lightbox');
var pfLightboxImg = pfLightbox ? pfLightbox.querySelector('.pf-lightbox-img') : null;
var pfLightboxCaption = pfLightbox ? pfLightbox.querySelector('.pf-lightbox-caption') : null;

var pfColors = [
  'linear-gradient(135deg, rgba(167,139,250,0.5), rgba(59,130,246,0.4))',
  'linear-gradient(135deg, rgba(74,240,196,0.5), rgba(59,130,246,0.4))',
  'linear-gradient(135deg, rgba(249,115,22,0.5), rgba(245,166,35,0.4))',
  'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(167,139,250,0.4))',
  'linear-gradient(135deg, rgba(236,72,153,0.45), rgba(167,139,250,0.4))'
];

var pfCaptions = ['🏔 Landscape', '🌊 Ocean', '🌅 Sunset', '🏙 City', '🌸 Flora'];

var pfHideTimer;

pfCards.forEach(function (card, i) {
  card.addEventListener('mouseenter', function () {
    clearTimeout(pfHideTimer);
    if (pfLightboxImg) pfLightboxImg.style.background = pfColors[i];
    if (pfLightboxCaption) pfLightboxCaption.textContent = pfCaptions[i];
    if (pfLightbox) pfLightbox.classList.add('active');
  });

  card.addEventListener('mouseleave', function () {
    pfHideTimer = setTimeout(function () {
      if (pfLightbox) pfLightbox.classList.remove('active');
    }, 300);
  });
});

if (pfLightbox) {
  pfLightbox.addEventListener('mouseenter', function () {
    clearTimeout(pfHideTimer);
  });
  pfLightbox.addEventListener('mouseleave', function () {
    pfLightbox.classList.remove('active');
  });
}

/* ── Toolbar tab switching ── */
var pfTabs = document.querySelectorAll('.pf-tb-btn');
pfTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    pfTabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
  });
});
/* ── Rhythm — Play/Pause toggle ── */
var rpPlayBtn = document.getElementById('rp-play-btn');
var rpBars    = document.querySelectorAll('.rp-bar');
var rpDisc    = document.querySelector('.rp-album-disc');
var rpEqBars  = document.querySelectorAll('.rp-pl-eq span');
var rpPlaying = true;

if (rpPlayBtn) {
  rpPlayBtn.addEventListener('click', function () {
    rpPlaying = !rpPlaying;

    /* Swap icons */
    var pause = rpPlayBtn.querySelector('.rp-icon-pause');
    var play  = rpPlayBtn.querySelector('.rp-icon-play');
    if (pause) pause.style.display = rpPlaying ? 'block' : 'none';
    if (play)  play.style.display  = rpPlaying ? 'none'  : 'block';

    /* Pause/resume waveform bars */
    rpBars.forEach(function (bar) {
      bar.style.animationPlayState = rpPlaying ? 'running' : 'paused';
    });

    /* Pause/resume disc spin */
    if (rpDisc) {
      rpDisc.style.animationPlayState = rpPlaying ? 'running' : 'paused';
    }

    /* Pause/resume eq bars */
    rpEqBars.forEach(function (bar) {
      bar.style.animationPlayState = rpPlaying ? 'running' : 'paused';
    });
  });
}

/* ── Playlist item click → highlight ── */
var rpItems = document.querySelectorAll('.rp-playlist-item');
var rpSongTitles = ['Midnight Groove', 'Neon Dreams', 'Chill Waves'];
var rpSongMeta   = [
  'RhythmPlayer • Lo-fi Beats',
  'RhythmPlayer • Synthwave',
  'RhythmPlayer • Ambient'
];

rpItems.forEach(function (item, i) {
  item.addEventListener('click', function () {
    rpItems.forEach(function (it) { it.classList.remove('rp-playlist-active'); });
    item.classList.add('rp-playlist-active');

    /* Update song info */
    var titleEl  = document.querySelector('.rp-song-title');
    var artistEl = document.querySelector('.rp-song-artist');
    if (titleEl)  titleEl.textContent  = rpSongTitles[i] || 'Unknown';
    if (artistEl) artistEl.textContent = rpSongMeta[i]   || '';

    /* Reset progress */
    var fill = document.querySelector('.rp-progress-fill');
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '0%';
      setTimeout(function () {
        fill.style.transition = 'width 0.4s ease';
        fill.style.width = (20 + Math.random() * 50).toFixed(0) + '%';
      }, 50);
    }
  });
});

    /* Step 3: Double rAF then observe */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('proj-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -20px 0px'
        });

        cards.forEach(function (card) {
          observer.observe(card);
        });

      });
    });

  });

})();

/* ════════════════════════════════════════
   CERTIFICATES SECTION — Scroll Reveal + Counter + Mouse Glow
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var cards    = document.querySelectorAll('.cert-card');
    var statNums = document.querySelectorAll('.cert-stat-num');

    /* ── Step 1: Mark cards for entrance animation ── */
    cards.forEach(function (card, i) {
      card.classList.add('cert-will-animate');
      card.style.transitionDelay = (i * 0.12) + 's';
    });

    /* ── Step 2: Mouse-tracking glow ── */
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });

    /* ── Step 3: Animated number counter ── */
    function animateCounter(el) {
      var target   = parseInt(el.getAttribute('data-target'), 10);
      var duration = 1400;
      var start    = performance.now();

      function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    /* ── Step 4: Double rAF then observe ── */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {

        /* Cards observer */
        var cardObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('cert-visible');
              cardObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        cards.forEach(function (card) { cardObserver.observe(card); });

        /* Stats counter observer */
        var statsRow = document.querySelector('.cert-stats-row');
        if (statsRow) {
          var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                statNums.forEach(function (num) { animateCounter(num); });
                statsObserver.unobserve(entry.target);
              }
            });
          }, { threshold: 0.5 });

          statsObserver.observe(statsRow);
        }

      });
    });

  });

})();



/* ════════════════════════════════════════
   EXPERIENCE SECTION — Scroll Reveal + Timeline + Mouse Glow
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var cards    = document.querySelectorAll('.exp-card');
    var items    = document.querySelectorAll('.exp-item');
    var progress = document.getElementById('exp-timeline-progress');

    /* ── Step 1: Mark cards for entrance ── */
    cards.forEach(function (card, i) {
      card.classList.add('exp-will-animate');
      card.style.transitionDelay = (i * 0.18) + 's';
    });

    /* ── Step 2: Mouse-tracking glow ── */
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });

    /* ── Step 3: Timeline progress fill ── */
    function updateTimelineProgress() {
      if (!progress) return;
      var section = document.getElementById('experience');
      if (!section) return;

      var rect       = section.getBoundingClientRect();
      var winH       = window.innerHeight;
      var sectionH   = section.offsetHeight;
      var scrolled   = Math.max(0, winH - rect.top);
      var pct        = Math.min(100, (scrolled / (sectionH + winH)) * 180);
      progress.style.height = pct + '%';
    }

    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    updateTimelineProgress();

    /* ── Step 4: Double rAF then observe ── */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var card = entry.target.querySelector('.exp-card');
              if (card) card.classList.add('exp-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -30px 0px'
        });

        items.forEach(function (item) { observer.observe(item); });

      });
    });

  });

})();