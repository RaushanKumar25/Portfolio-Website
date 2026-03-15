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




/* ════════════════════════════════════════
   EDUCATION SECTION — Scroll Reveal + CGPA Counter + Mouse Glow
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var cards   = document.querySelectorAll('.edu-card');
    var cgpaEl  = document.querySelector('.edu-cgpa-animated');

    /* ── Step 1: Mark for entrance animation ── */
    cards.forEach(function (card, i) {
      card.classList.add('edu-will-animate');
      card.style.transitionDelay = (i * 0.13) + 's';
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

    /* ── Step 3: CGPA counter animation ── */
    function animateCGPA(el) {
      var target   = parseFloat(el.getAttribute('data-target'));
      var duration = 1600;
      var start    = performance.now();

      function tick(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = (eased * target).toFixed(2);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(2);
      }

      requestAnimationFrame(tick);
    }

    /* ── Step 4: Double rAF then observe ── */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {

        /* Cards scroll reveal */
        var cardObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('edu-visible');
              cardObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        cards.forEach(function (card) { cardObserver.observe(card); });

        /* CGPA counter observer */
        if (cgpaEl) {
          var cgpaObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCGPA(entry.target);
                cgpaObserver.unobserve(entry.target);
              }
            });
          }, { threshold: 0.5 });

          cgpaObserver.observe(cgpaEl);
        }

      });
    });

  });

})();





/* ════════════════════════════════════════
   CONTACT SECTION — EmailJS + Validation + Toast
════════════════════════════════════════ */

/* ── STEP 1: Load EmailJS SDK ──
   Add this to your <head> in index.html:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

   Then replace these with your real values from emailjs.com:
   - YOUR_PUBLIC_KEY   → Account → API Keys → Public Key
   - YOUR_SERVICE_ID   → Email Services → your service ID
   - YOUR_TEMPLATE_ID  → Email Templates → your template ID

   In your EmailJS template, use these variables:
   {{from_name}}    → sender name
   {{from_email}}   → sender email
   {{subject}}      → subject
   {{message}}      → message body
   {{to_email}}     → raushankumarbhardwaj4510@gmail.com (set as static in template)
*/

(function () {

  /* ── Config — replace with your real keys ── */
  var EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
  var EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
  var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

  /* ── Init EmailJS when SDK is ready ── */
  function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      return true;
    }
    return false;
  }

  window.addEventListener('load', function () {

    initEmailJS();

    var form      = document.getElementById('con-form');
    var submitBtn = document.getElementById('con-submit-btn');
    var btnText   = submitBtn ? submitBtn.querySelector('.con-btn-text')    : null;
    var btnLoad   = submitBtn ? submitBtn.querySelector('.con-btn-loading')  : null;

    /* ── Mouse glow on form wrap ── */
    var formWrap = document.querySelector('.con-form-wrap');
    if (formWrap) {
      formWrap.addEventListener('mousemove', function (e) {
        var rect = formWrap.getBoundingClientRect();
        formWrap.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
        formWrap.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
      });
    }

    /* ── Mouse glow on info + social cards ── */
    document.querySelectorAll('.con-info-card, .con-social-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
      });
    });

    /* ── Scroll reveal ── */
    var revealEls = document.querySelectorAll(
      '.con-info-card, .con-social-card, .con-form-wrap'
    );

    revealEls.forEach(function (el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease ' + (i * 0.08) + 's, transform 0.6s ease ' + (i * 0.08) + 's';
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity   = '1';
              entry.target.style.transform = 'translateY(0)';
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        revealEls.forEach(function (el) { io.observe(el); });
      });
    });

    /* ════════════════════
       VALIDATION HELPERS
    ════════════════════ */
    function getField(id) { return document.getElementById(id); }

    function setError(fieldId, errId, show) {
      var field = getField(fieldId);
      var wrap  = field ? field.closest('.con-field-wrap') : null;
      if (wrap) {
        show ? wrap.classList.add('has-error') : wrap.classList.remove('has-error');
      }
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateForm() {
      var name    = getField('con-name');
      var email   = getField('con-email');
      var subject = getField('con-subject');
      var message = getField('con-message');
      var valid   = true;

      /* Name */
      if (!name || name.value.trim().length < 2) {
        setError('con-name', 'err-name', true);
        valid = false;
      } else { setError('con-name', 'err-name', false); }

      /* Email */
      if (!email || !validateEmail(email.value.trim())) {
        setError('con-email', 'err-email', true);
        valid = false;
      } else { setError('con-email', 'err-email', false); }

      /* Subject */
      if (!subject || subject.value.trim().length < 2) {
        setError('con-subject', 'err-subject', true);
        valid = false;
      } else { setError('con-subject', 'err-subject', false); }

      /* Message */
      if (!message || message.value.trim().length < 10) {
        setError('con-message', 'err-message', true);
        valid = false;
      } else { setError('con-message', 'err-message', false); }

      return valid;
    }

    /* Clear error on input */
    ['con-name','con-email','con-subject','con-message'].forEach(function (id) {
      var el = getField(id);
      if (el) {
        el.addEventListener('input', function () {
          setError(id, 'err-' + id.replace('con-', ''), false);
        });
      }
    });

    /* ════════════════════
       TOAST HELPERS
    ════════════════════ */
    function showToast(id, duration) {
      var toast = document.getElementById(id);
      if (!toast) return;

      /* Hide any currently active toasts */
      document.querySelectorAll('.con-toast.active').forEach(function (t) {
        t.classList.remove('active');
      });

      toast.classList.add('active');

      setTimeout(function () {
        toast.classList.remove('active');
      }, duration || 5000);
    }

    /* ════════════════════
       LOADING STATE
    ════════════════════ */
    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (btnText) btnText.style.display = loading ? 'none'         : 'inline-flex';
      if (btnLoad) btnLoad.style.display = loading ? 'inline-flex'  : 'none';
    }

    /* ════════════════════
       FORM SUBMIT
    ════════════════════ */
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        /* Try to init EmailJS if it wasn't ready on load */
        if (!initEmailJS()) {
          showToast('con-toast-error');
          return;
        }

        setLoading(true);

        var name    = getField('con-name').value.trim();
        var email   = getField('con-email').value.trim();
        var subject = getField('con-subject').value.trim();
        var message = getField('con-message').value.trim();

        var templateParams = {
          from_name  : name,
          from_email : email,
          subject    : subject,
          message    : message,
          to_email   : 'raushankumarbhardwaj4510@gmail.com',
          reply_to   : email
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(function () {
            setLoading(false);
            showToast('con-toast-success', 6000);
            form.reset();
            /* Clear any remaining errors */
            ['con-name','con-email','con-subject','con-message'].forEach(function (id) {
              setError(id, '', false);
            });
          })
          .catch(function (err) {
            console.error('EmailJS error:', err);
            setLoading(false);
            showToast('con-toast-error', 7000);
          });
      });
    }

  });

})();
```

---

**Setup steps for EmailJS** (takes 5 minutes):

1. Go to **[emailjs.com](https://www.emailjs.com)** → create free account
2. **Email Services** → Add Service → choose Gmail → connect your Gmail → copy the **Service ID**
3. **Email Templates** → Create Template → paste this template body:
```
// New message from your portfolio!

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}









/* ════════════════════════════════════════
   FOOTER — Scroll To Top + Smooth Scroll + Reveal
════════════════════════════════════════ */
(function () {

  window.addEventListener('load', function () {

    var topBtn = document.getElementById('footer-top-btn');

    /* ── Scroll-to-top button visibility ── */
    function handleScroll() {
      if (!topBtn) return;
      if (window.scrollY > 400) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ── Scroll to top on click ── */
    if (topBtn) {
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ── Smooth scroll for ALL anchor links (navbar + footer) ── */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset     = 70; /* navbar height */
          var targetTop  = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    /* ── Footer reveal animation ── */
    var footerEls = document.querySelectorAll(
      '.footer-brand, .footer-links-col, .footer-social-col'
    );

    footerEls.forEach(function (el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.6s ease ' + (i * 0.1) + 's, transform 0.6s ease ' + (i * 0.1) + 's';
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity   = '1';
              entry.target.style.transform = 'translateY(0)';
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });

        footerEls.forEach(function (el) { io.observe(el); });
      });
    });

  });

})();

/* ════════════════════════════════════════
   SIDE NAV JS — Fixed active tracking
════════════════════════════════════════ */
(function () {

  function initSideNav() {
    var sideLinks = document.querySelectorAll('.sidenav-link');
    var sections  = document.querySelectorAll('section[id]');
    var navbar    = document.getElementById('navbar');

    if (!sideLinks.length) return;

    /* ── Active section tracker ── */
    function updateActive() {
      var scrollY  = window.scrollY;
      var navH     = navbar ? navbar.offsetHeight : 70;
      var current  = sections.length ? sections[0].getAttribute('id') : '';

      sections.forEach(function (sec) {
        var secTop = sec.offsetTop - navH - 80;
        if (scrollY >= secTop) {
          current = sec.getAttribute('id');
        }
      });

      sideLinks.forEach(function (link) {
        var sec = link.getAttribute('data-section');
        if (sec === current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    /* ── Smooth scroll on click ── */
    sideLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id     = link.getAttribute('href').replace('#', '');
        var target = document.getElementById(id);
        if (!target) return;

        var navH = navbar ? navbar.offsetHeight : 70;
        var top  = target.offsetTop - navH;

        window.scrollTo({ top: top, behavior: 'smooth' });

        /* Set active immediately on click */
        sideLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    });

    /* ── Listen to scroll ── */
    window.addEventListener('scroll', updateActive, { passive: true });

    /* Run once immediately */
    updateActive();
  }

  /* Init after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSideNav);
  } else {
    initSideNav();
  }

})();