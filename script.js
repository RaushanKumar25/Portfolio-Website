/* ════════════════════════════════════════
   GALAXY UNIVERSE — Real Planets + Scroll
════════════════════════════════════════ */
(function () {

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W = 0, H = 0, t = 0;
  var scrollY = 0, lastScrollY = 0, scrollVel = 0;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var stars = [], planets = [], nebulae = [], shoots = [];

  /* ══════════════════════════════════════
     RESIZE
  ══════════════════════════════════════ */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    mouse.x  = mouse.tx  = W / 2;
    mouse.y  = mouse.ty  = H / 2;
  }

  /* ══════════════════════════════════════
     SCROLL TRACKING
  ══════════════════════════════════════ */
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  /* ══════════════════════════════════════
     STARS — 3 parallax layers
  ══════════════════════════════════════ */
  function initStars() {
    stars = [];
    var layers = [
      { count: 220, speed: 0.03, size: 0.7,  alpha: 0.45 },
      { count: 120, speed: 0.07, size: 1.3,  alpha: 0.65 },
      { count:  55, speed: 0.14, size: 2.1,  alpha: 0.88 }
    ];
    layers.forEach(function (l) {
      for (var i = 0; i < l.count; i++) {
        var br = l.size * (0.5 + Math.random() * 0.9);
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          baseR: br,
          alpha: l.alpha * (0.5 + Math.random() * 0.5),
          speed: l.speed,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.012 + Math.random() * 0.038,
          hue: Math.random() > 0.78 ? Math.random()*60+175 : -1
        });
      }
    });
  }

  /* ══════════════════════════════════════
     PLANETS — 5 real-looking planets
  ══════════════════════════════════════ */
  function initPlanets() {
    planets = [

      /* ── SUN ── */
      {
        id: 'sun',
        bx: W*0.82, by: H*0.16,
        x: 0, y: 0,
        r: 70,
        parallax: 0.012,
        rotAngle: 0, rotSpeed: 0.002,
        glowColor: [255, 200, 50],
        glowLayers: [
          { r: 4.5, a: 0.06 },
          { r: 3.0, a: 0.12 },
          { r: 1.8, a: 0.22 }
        ],
        bands: [
          { y: -0.6, h: 0.18, color: 'rgba(255,240,120,0.18)' },
          { y: -0.2, h: 0.22, color: 'rgba(255,200,60,0.14)'  },
          { y:  0.1, h: 0.16, color: 'rgba(255,160,30,0.12)'  }
        ],
        colors: ['#fff5a0','#ffe066','#ffb020','#e07010'],
        hasMoon: false, hasRing: false,
        corona: true, isSun: true
      },

      /* ── SATURN ── */
      {
        id: 'saturn',
        bx: W*0.13, by: H*0.28,
        x: 0, y: 0,
        r: 52,
        parallax: 0.028,
        rotAngle: 0, rotSpeed: 0.0018,
        glowColor: [210, 175, 110],
        glowLayers: [
          { r: 3.2, a: 0.07 },
          { r: 2.0, a: 0.14 }
        ],
        bands: [
          { y:-0.55, h:0.18, color:'rgba(220,195,140,0.3)'  },
          { y:-0.28, h:0.22, color:'rgba(190,155,90,0.25)'  },
          { y: 0.0,  h:0.20, color:'rgba(230,205,155,0.28)' },
          { y: 0.25, h:0.16, color:'rgba(180,140,80,0.22)'  },
          { y: 0.45, h:0.18, color:'rgba(210,185,130,0.26)' }
        ],
        colors: ['#f0d090','#d4a96a','#b07840','#7a4820'],
        hasRing: true,
        ringTilt: 0.28,
        ringBands: [
          { inner:1.18, outer:1.42, color:'rgba(210,175,110,0.55)', dark:false },
          { inner:1.44, outer:1.52, color:'rgba(150,120,70,0.30)',  dark:true  },
          { inner:1.54, outer:1.78, color:'rgba(220,185,120,0.45)', dark:false },
          { inner:1.80, outer:1.88, color:'rgba(100,80,45,0.20)',   dark:true  },
          { inner:1.90, outer:2.05, color:'rgba(200,165,100,0.30)', dark:false }
        ],
        hasMoon: true,
        moonR:9, moonOrbit:130, moonSpeed:0.008, moonAngle:0.4,
        moonColors:['#c8d4de','#9aaab8','#7a8a98']
      },

      /* ── EARTH ── */
      {
        id: 'earth',
        bx: W*0.75, by: H*0.76,
        x: 0, y: 0,
        r: 38,
        parallax: 0.048,
        rotAngle: 0, rotSpeed: 0.004,
        glowColor: [60, 130, 220],
        glowLayers: [
          { r: 3.0, a: 0.07 },
          { r: 1.9, a: 0.16 }
        ],
        bands: [],
        colors: ['#5ab4f0','#3a7bd5','#1a4a8a','#0a2050'],
        hasRing: false,
        hasMoon: true,
        moonR:8, moonOrbit:65, moonSpeed:0.012, moonAngle:1.8,
        moonColors:['#e8e0d0','#c8c0b0','#a8a098'],
        continents: [
          { cx:-0.18, cy:-0.12, rx:0.40, ry:0.28, rot:0.3  },
          { cx: 0.08, cy:-0.05, rx:0.34, ry:0.24, rot:-0.2 },
          { cx:-0.05, cy: 0.22, rx:0.28, ry:0.20, rot:0.5  },
          { cx: 0.28, cy: 0.10, rx:0.18, ry:0.26, rot:0.1  }
        ],
        isEarth: true
      },

      /* ── PURPLE GAS GIANT ── */
      {
        id: 'purple',
        bx: W*0.46, by: H*0.90,
        x: 0, y: 0,
        r: 32,
        parallax: 0.058,
        rotAngle: 0, rotSpeed: 0.005,
        glowColor: [150, 60, 200],
        glowLayers: [
          { r: 3.2, a: 0.08 },
          { r: 2.0, a: 0.15 }
        ],
        bands: [
          { y:-0.5,  h:0.20, color:'rgba(180,100,230,0.30)' },
          { y:-0.20, h:0.18, color:'rgba(130,50,180,0.25)'  },
          { y: 0.05, h:0.22, color:'rgba(170,80,220,0.28)'  },
          { y: 0.30, h:0.16, color:'rgba(110,40,160,0.22)'  }
        ],
        colors: ['#c070f0','#8e44ad','#5e2080','#3a1050'],
        hasRing: true,
        ringTilt: 0.22,
        ringBands: [
          { inner:1.20, outer:1.55, color:'rgba(150,70,200,0.45)', dark:false },
          { inner:1.57, outer:1.65, color:'rgba(80,30,120,0.25)',  dark:true  },
          { inner:1.67, outer:1.90, color:'rgba(140,60,190,0.35)', dark:false }
        ],
        hasMoon: false
      },

      /* ── MARS ── */
      {
        id: 'mars',
        bx: W*0.28, by: H*0.84,
        x: 0, y: 0,
        r: 22,
        parallax: 0.065,
        rotAngle: 0, rotSpeed: 0.007,
        glowColor: [210, 80, 50],
        glowLayers: [
          { r: 2.8, a: 0.08 },
          { r: 1.8, a: 0.15 }
        ],
        bands: [
          { y:-0.3, h:0.25, color:'rgba(220,120,80,0.22)'  },
          { y: 0.1, h:0.20, color:'rgba(180,70,40,0.18)'   }
        ],
        colors: ['#e87050','#c0392b','#8a2010','#4a0808'],
        hasRing: false,
        hasMoon: false,
        craters: [
          { cx:-0.22, cy:-0.15, r:0.12 },
          { cx: 0.18, cy: 0.20, r:0.09 },
          { cx:-0.05, cy: 0.28, r:0.07 },
          { cx: 0.28, cy:-0.08, r:0.06 }
        ]
      }

    ];

    planets.forEach(function (p) { p.x = p.bx; p.y = p.by; });
  }

  /* ══════════════════════════════════════
     NEBULAE
  ══════════════════════════════════════ */
  function initNebulae() {
    nebulae = [
      { bx:W*0.20, by:H*0.28, x:0,y:0, rx:340,ry:210, hue:210, alpha:0.040, parallax:0.007 },
      { bx:W*0.78, by:H*0.58, x:0,y:0, rx:290,ry:230, hue:275, alpha:0.036, parallax:0.010 },
      { bx:W*0.50, by:H*0.08, x:0,y:0, rx:250,ry:150, hue:350, alpha:0.028, parallax:0.005 },
      { bx:W*0.06, by:H*0.82, x:0,y:0, rx:210,ry:170, hue:170, alpha:0.030, parallax:0.012 }
    ];
    nebulae.forEach(function (n) { n.x = n.bx; n.y = n.by; });
  }

  /* ══════════════════════════════════════
     HELPERS
  ══════════════════════════════════════ */
  function lighten(hex, amt) {
    var r = Math.min(255, parseInt(hex.slice(1,3),16)+amt);
    var g = Math.min(255, parseInt(hex.slice(3,5),16)+amt);
    var b = Math.min(255, parseInt(hex.slice(5,7),16)+amt);
    return 'rgb('+r+','+g+','+b+')';
  }

  function rgbGlow(arr, a) {
    return 'rgba('+arr[0]+','+arr[1]+','+arr[2]+','+a+')';
  }

  /* ══════════════════════════════════════
     DRAW NEBULA
  ══════════════════════════════════════ */
  function drawNebula(n) {
    var maxR = Math.max(n.rx, n.ry);
    var g = ctx.createRadialGradient(n.x,n.y,0, n.x,n.y,maxR);
    g.addColorStop(0,   'hsla('+n.hue+',65%,55%,'+n.alpha+')');
    g.addColorStop(0.5, 'hsla('+n.hue+',55%,35%,'+(n.alpha*0.4)+')');
    g.addColorStop(1,   'hsla('+n.hue+',40%,15%,0)');
    ctx.save();
    ctx.scale(n.rx/maxR, n.ry/maxR);
    ctx.beginPath();
    ctx.arc(n.x*maxR/n.rx, n.y*maxR/n.ry, maxR, 0, Math.PI*2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  /* ══════════════════════════════════════
     DRAW PLANET BODY
  ══════════════════════════════════════ */
  function drawPlanetBody(p) {
    var r = p.r;

    /* ── Multi-layer glow ── */
    p.glowLayers.forEach(function (gl) {
      var gr = r * gl.r;
      var gg = ctx.createRadialGradient(p.x,p.y,r*0.5, p.x,p.y,gr);
      gg.addColorStop(0, rgbGlow(p.glowColor, gl.a));
      gg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, gr, 0, Math.PI*2);
      ctx.fillStyle = gg;
      ctx.fill();
    });

    /* ── Corona for Sun ── */
    if (p.corona) {
      for (var ray = 0; ray < 16; ray++) {
        var ang = (ray/16)*Math.PI*2 + p.rotAngle;
        var rLen = r*(1.35 + 0.25*Math.sin(t*0.04+ray*1.3));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        var cg = ctx.createLinearGradient(0,0,rLen,0);
        cg.addColorStop(0,   'rgba(255,230,80,0.3)');
        cg.addColorStop(0.5, 'rgba(255,180,40,0.1)');
        cg.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.moveTo(r*0.88, -r*0.06);
        ctx.lineTo(rLen,    0);
        ctx.lineTo(r*0.88,  r*0.06);
        ctx.fillStyle = cg;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Main sphere gradient ── */
    var c = p.colors;
    var sg = ctx.createRadialGradient(
      p.x - r*0.38, p.y - r*0.38, r*0.04,
      p.x + r*0.1,  p.y + r*0.1,  r*1.05
    );
    sg.addColorStop(0,    lighten(c[0], 50));
    sg.addColorStop(0.25, c[0]);
    sg.addColorStop(0.6,  c[1]);
    sg.addColorStop(0.85, c[2]);
    sg.addColorStop(1,    c[3]);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.fillStyle = sg;
    ctx.fill();

    /* ── Bands / stripes ── */
    if (p.bands.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.clip();
      p.bands.forEach(function (band) {
        var bandY  = p.y + band.y*r + (t * p.rotSpeed * 8) % (r*0.5);
        var bandH  = band.h * r;
        var bandG  = ctx.createLinearGradient(p.x-r, bandY-bandH/2, p.x-r, bandY+bandH/2);
        bandG.addColorStop(0,   'transparent');
        bandG.addColorStop(0.3, band.color);
        bandG.addColorStop(0.7, band.color);
        bandG.addColorStop(1,   'transparent');
        ctx.fillStyle = bandG;
        ctx.fillRect(p.x-r, bandY-bandH/2, r*2, bandH);
      });
      ctx.restore();
    }

    /* ── Continents (Earth) ── */
    if (p.continents) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.clip();
      p.continents.forEach(function (c) {
        var rotOff = p.rotAngle * 0.4;
        var cx = p.x + c.cx*r*Math.cos(rotOff) - c.cy*r*Math.sin(rotOff);
        var cy = p.y + c.cx*r*Math.sin(rotOff) + c.cy*r*Math.cos(rotOff);
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.rx*r, c.ry*r, c.rot+rotOff, 0, Math.PI*2);
        /* Land gradient */
        var lg = ctx.createRadialGradient(cx-c.rx*r*0.3, cy-c.ry*r*0.3, 0, cx, cy, c.rx*r);
        lg.addColorStop(0,   '#6dbb50');
        lg.addColorStop(0.5, '#3a8a30');
        lg.addColorStop(1,   '#1a5518');
        ctx.fillStyle = lg;
        ctx.fill();
      });
      /* Ice caps */
      ctx.beginPath();
      ctx.ellipse(p.x, p.y-r*0.82, r*0.42, r*0.20, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(240,248,255,0.82)';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x, p.y+r*0.85, r*0.28, r*0.13, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(240,248,255,0.70)';
      ctx.fill();
      /* Cloud wisps */
      ctx.globalAlpha = 0.35;
      for (var ci = 0; ci < 4; ci++) {
        var ca = p.rotAngle*0.6 + ci*1.57;
        var cx2 = p.x + Math.cos(ca)*r*0.45;
        var cy2 = p.y + Math.sin(ca)*r*0.3;
        ctx.beginPath();
        ctx.ellipse(cx2, cy2, r*0.30, r*0.08, ca, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    /* ── Craters (Mars) ── */
    if (p.craters) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.clip();
      p.craters.forEach(function (cr) {
        var cx = p.x + cr.cx*r;
        var cy = p.y + cr.cy*r;
        var cR = cr.r*r;
        ctx.beginPath();
        ctx.arc(cx, cy, cR, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx-cR*0.25, cy-cR*0.25, cR*0.85, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();
      });
      ctx.restore();
    }

    /* ── Atmosphere rim ── */
    var ar = r * 1.16;
    var ag = ctx.createRadialGradient(p.x,p.y,r*0.75, p.x,p.y,ar);
    ag.addColorStop(0, 'transparent');
    ag.addColorStop(1, rgbGlow(p.glowColor, p.isSun ? 0.35 : 0.20));
    ctx.beginPath();
    ctx.arc(p.x, p.y, ar, 0, Math.PI*2);
    ctx.fillStyle = ag;
    ctx.fill();

    /* ── Terminator shadow (day/night) ── */
    if (!p.isSun) {
      var sh = ctx.createRadialGradient(
        p.x + r*0.5, p.y, r*0.2,
        p.x + r*0.5, p.y, r*1.3
      );
      sh.addColorStop(0,   'transparent');
      sh.addColorStop(0.55,'rgba(0,0,10,0.0)');
      sh.addColorStop(1,   'rgba(0,0,10,0.72)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI*2);
      ctx.fillStyle = sh;
      ctx.fill();
    }

    /* ── Specular highlight ── */
    var hl = ctx.createRadialGradient(
      p.x - r*0.40, p.y - r*0.40, 0,
      p.x - r*0.12, p.y - r*0.12, r*0.72
    );
    hl.addColorStop(0, 'rgba(255,255,255,0.32)');
    hl.addColorStop(0.4,'rgba(255,255,255,0.08)');
    hl.addColorStop(1,  'transparent');
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI*2);
    ctx.fillStyle = hl;
    ctx.fill();
  }

  /* ══════════════════════════════════════
     DRAW RINGS
  ══════════════════════════════════════ */
  function drawRings(p) {
    if (!p.hasRing) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(1, p.ringTilt);
    p.ringBands.forEach(function (rb) {
      var rg = ctx.createRadialGradient(0,0,rb.inner*p.r, 0,0,rb.outer*p.r);
      rg.addColorStop(0,   'transparent');
      rg.addColorStop(0.15, rb.color);
      rg.addColorStop(0.85, rb.color);
      rg.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(0, 0, rb.outer*p.r, 0, Math.PI*2);
      ctx.arc(0, 0, rb.inner*p.r, 0, Math.PI*2, true);
      ctx.fillStyle = rg;
      ctx.fill();
    });
    ctx.restore();
  }

  /* ══════════════════════════════════════
     DRAW MOON
  ══════════════════════════════════════ */
  function drawMoon(p) {
    if (!p.hasMoon) return;
    p.moonAngle += p.moonSpeed * (1 + scrollVel * 0.15);
    var mx = p.x + Math.cos(p.moonAngle) * p.moonOrbit;
    var my = p.y + Math.sin(p.moonAngle) * p.moonOrbit * 0.40;
    var mr = p.moonR;

    /* Moon glow */
    var mg2 = ctx.createRadialGradient(mx,my,mr*0.4, mx,my,mr*2.8);
    mg2.addColorStop(0, 'rgba(200,210,225,0.15)');
    mg2.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(mx, my, mr*2.8, 0, Math.PI*2);
    ctx.fillStyle = mg2;
    ctx.fill();

    /* Moon body */
    var mc = p.moonColors;
    var mbg = ctx.createRadialGradient(
      mx-mr*0.35, my-mr*0.35, 0,
      mx+mr*0.1,  my+mr*0.1,  mr
    );
    mbg.addColorStop(0,   mc[0]);
    mbg.addColorStop(0.5, mc[1]);
    mbg.addColorStop(1,   mc[2]);
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.fillStyle = mbg;
    ctx.fill();

    /* Moon craters */
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.clip();
    [[-0.25,-0.2,0.18],[0.2,0.15,0.14],[-0.1,0.25,0.12]].forEach(function(cr){
      ctx.beginPath();
      ctx.arc(mx+cr[0]*mr, my+cr[1]*mr, cr[2]*mr, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fill();
    });
    ctx.restore();

    /* Moon shadow */
    var msh = ctx.createRadialGradient(mx+mr*0.45,my,mr*0.15, mx+mr*0.45,my,mr*1.2);
    msh.addColorStop(0,   'transparent');
    msh.addColorStop(0.5, 'rgba(0,0,0,0.0)');
    msh.addColorStop(1,   'rgba(0,0,0,0.65)');
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.fillStyle = msh;
    ctx.fill();

    /* Moon shine */
    var mhl = ctx.createRadialGradient(mx-mr*0.38,my-mr*0.38,0, mx,my,mr*0.75);
    mhl.addColorStop(0, 'rgba(255,255,255,0.22)');
    mhl.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI*2);
    ctx.fillStyle = mhl;
    ctx.fill();
  }

  /* ══════════════════════════════════════
     DRAW STARS
  ══════════════════════════════════════ */
  function drawStars() {
    var mdx = mouse.x - W/2;
    var mdy = mouse.y - H/2;

    stars.forEach(function (s) {
      /* Mouse parallax + scroll drift */
      var sx = (s.x + mdx * s.speed + scrollY * s.speed * 0.5) % W;
      var sy = (s.y + mdy * s.speed + scrollY * s.speed * 0.8) % H;
      if (sx < 0) sx += W;
      if (sy < 0) sy += H;

      /* Twinkle */
      s.twinkle += s.twinkleSpeed;
      var tw    = 0.5 + 0.5*Math.sin(s.twinkle);
      var alpha = s.alpha * (0.55 + 0.45*tw);
      var r     = s.baseR  * (0.78 + 0.38*tw);

      var col = s.hue >= 0
        ? 'hsla('+s.hue+',75%,88%,'+alpha+')'
        : 'rgba(255,255,255,'+alpha+')';

      /* Sparkle cross */
      if (r > 1.4) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.42;
        ctx.strokeStyle = col;
        ctx.lineWidth   = r * 0.42;
        ctx.beginPath();
        ctx.moveTo(sx-r*2.8, sy); ctx.lineTo(sx+r*2.8, sy);
        ctx.moveTo(sx, sy-r*2.8); ctx.lineTo(sx, sy+r*2.8);
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI*2);
      ctx.fillStyle = col;
      ctx.fill();
    });
  }

  /* ══════════════════════════════════════
     DRAW SHOOTING STARS
  ══════════════════════════════════════ */
  function drawShoots() {
    shoots = shoots.filter(function (ss) {
      ss.x    += ss.vx;
      ss.y    += ss.vy;
      ss.alpha -= 0.026;
      if (ss.alpha <= 0) return false;
      var tx = ss.x - ss.vx*9, ty = ss.y - ss.vy*9;
      var g  = ctx.createLinearGradient(tx,ty,ss.x,ss.y);
      g.addColorStop(0,'transparent');
      g.addColorStop(1,'hsla('+ss.hue+',90%,84%,'+ss.alpha+')');
      ctx.beginPath();
      ctx.moveTo(tx,ty); ctx.lineTo(ss.x,ss.y);
      ctx.strokeStyle = g;
      ctx.lineWidth   = ss.w;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ss.x,ss.y,ss.w*2,0,Math.PI*2);
      ctx.fillStyle = 'hsla('+ss.hue+',95%,94%,'+ss.alpha+')';
      ctx.fill();
      return true;
    });
  }

  /* ══════════════════════════════════════
     MAIN DRAW LOOP
  ══════════════════════════════════════ */
  function draw() {

    /* Scroll velocity for extra spin */
    scrollVel  = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;

    ctx.clearRect(0, 0, W, H);

    /* Deep space BG */
    var bg = ctx.createRadialGradient(W*0.5,H*0.4,0, W*0.5,H*0.4,Math.max(W,H)*0.95);
    bg.addColorStop(0,   '#0e1522');
    bg.addColorStop(0.4, '#070b14');
    bg.addColorStop(1,   '#020408');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Nebulae */
    nebulae.forEach(function (n) {
      var dx = mouse.x - W/2, dy = mouse.y - H/2;
      n.x = n.bx + dx*n.parallax + scrollY*n.parallax*0.3;
      n.y = n.by + dy*n.parallax + scrollY*n.parallax*0.5;
      drawNebula(n);
    });

    /* Stars */
    drawStars();

    /* Planets */
    planets.forEach(function (p) {
      var dx = mouse.x - W/2, dy = mouse.y - H/2;

      /* Mouse parallax + scroll rotation */
      p.x = p.bx + dx*p.parallax;
      p.y = p.by + dy*p.parallax + scrollY*p.parallax*0.4;

      /* Rotation speeds up while scrolling */
      p.rotAngle += p.rotSpeed * (1 + scrollVel * 0.25);

      /* Rings behind */
      drawRings(p);

      /* Planet body */
      drawPlanetBody(p);

      /* Moon in front */
      drawMoon(p);
    });

    /* Shooting stars */
    drawShoots();

    t++;
    requestAnimationFrame(draw);
  }

  /* ══════════════════════════════════════
     EVENTS
  ══════════════════════════════════════ */

  /* Smooth mouse lerp */
  (function lerpMouse() {
    mouse.x += (mouse.tx - mouse.x) * 0.055;
    mouse.y += (mouse.ty - mouse.y) * 0.055;
    requestAnimationFrame(lerpMouse);
  })();

  window.addEventListener('mousemove', function (e) {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  });

  window.addEventListener('click', function (e) {
    for (var i = 0; i < 10; i++) {
      var angle = (i/10)*Math.PI*2;
      var spd   = 3 + Math.random()*9;
      shoots.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(angle)*spd,
        vy: Math.sin(angle)*spd,
        alpha: 1,
        hue: 160+Math.random()*80,
        w: 1+Math.random()*2.5
      });
    }
  });

  window.addEventListener('resize', function () {
    resize();
    initStars();
    initPlanets();
    initNebulae();
  });

  /* ══════════════════════════════════════
     START
  ══════════════════════════════════════ */
  resize();
  initStars();
  initPlanets();
  initNebulae();
  draw();

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
   CONTACT SECTION — EmailJS Full Fix
════════════════════════════════════════ */

var EMAILJS_PUBLIC_KEY  = '2wz-D-KNNxPzO4ujf';
var EMAILJS_SERVICE_ID  = 'service_7w8hf7a';
var EMAILJS_TEMPLATE_ID = 'template_c9jgohr';

/* ── Init EmailJS immediately when script loads ── */
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    return true;
  }
  return false;
}

function getField(id) { return document.getElementById(id); }

function setError(fieldId, show) {
  var field = getField(fieldId);
  var wrap  = field ? field.closest('.con-field-wrap') : null;
  if (!wrap) return;
  show ? wrap.classList.add('has-error') : wrap.classList.remove('has-error');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  var valid = true;
  var name    = getField('con-name');
  var email   = getField('con-email');
  var subject = getField('con-subject');
  var message = getField('con-message');

  if (!name || name.value.trim().length < 2)            { setError('con-name',    true); valid = false; }
  else                                                   { setError('con-name',    false); }
  if (!email || !validateEmail(email.value.trim()))      { setError('con-email',   true); valid = false; }
  else                                                   { setError('con-email',   false); }
  if (!subject || subject.value.trim().length < 2)       { setError('con-subject', true); valid = false; }
  else                                                   { setError('con-subject', false); }
  if (!message || message.value.trim().length < 5)       { setError('con-message', true); valid = false; }
  else                                                   { setError('con-message', false); }

  return valid;
}

function showToast(id, duration) {
  var toast = document.getElementById(id);
  if (!toast) return;
  document.querySelectorAll('.con-toast.active').forEach(function(t) {
    t.classList.remove('active');
  });
  toast.classList.add('active');
  setTimeout(function() { toast.classList.remove('active'); }, duration || 5000);
}

function setLoading(loading) {
  var submitBtn = document.getElementById('con-submit-btn');
  var btnText   = submitBtn ? submitBtn.querySelector('.con-btn-text')   : null;
  var btnLoad   = submitBtn ? submitBtn.querySelector('.con-btn-loading') : null;
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  if (btnText) btnText.style.display = loading ? 'none'        : 'inline-flex';
  if (btnLoad) btnLoad.style.display = loading ? 'inline-flex' : 'none';
}

/* ── Main send function — called by both form submit AND button click ── */
function sendContactForm() {
  if (!validateForm()) return;

  if (!initEmailJS()) {
    alert('EmailJS not loaded. Make sure the EmailJS script tag is in your <head>.');
    return;
  }

  setLoading(true);

  var templateParams = {
    name    : getField('con-name').value.trim(),
    email   : getField('con-email').value.trim(),
    subject : getField('con-subject').value.trim(),
    message : getField('con-message').value.trim(),
    time    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function(response) {
      console.log('SUCCESS', response);
      setLoading(false);
      showToast('con-toast-success', 6000);
      /* Reset form */
      var form = document.getElementById('con-form');
      if (form) form.reset();
      ['con-name','con-email','con-subject','con-message'].forEach(function(id) {
        setError(id, false);
      });
    })
    .catch(function(err) {
      console.error('FAILED', err);
      setLoading(false);
      showToast('con-toast-error', 7000);
    });
}

/* ── Attach everything after DOM is ready ── */
document.addEventListener('DOMContentLoaded', function() {

  initEmailJS();

  /* Clear errors on typing */
  ['con-name','con-email','con-subject','con-message'].forEach(function(id) {
    var el = getField(id);
    if (el) el.addEventListener('input', function() { setError(id, false); });
  });

  /* Form submit event */
  var form = document.getElementById('con-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      sendContactForm();
    });
  }

  /* Direct button click as backup */
  var btn = document.getElementById('con-submit-btn');
  if (btn) {
    btn.addEventListener('click', function(e) {
      var form = document.getElementById('con-form');
      /* Only fire if button is outside a form OR form submit isn't working */
      if (!form) {
        e.preventDefault();
        sendContactForm();
      }
    });
  }

  /* ── Mouse glow ── */
  var formWrap = document.querySelector('.con-form-wrap');
  if (formWrap) {
    formWrap.addEventListener('mousemove', function(e) {
      var rect = formWrap.getBoundingClientRect();
      formWrap.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
      formWrap.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
    });
  }

  document.querySelectorAll('.con-info-card, .con-social-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
    });
  });

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll('.con-info-card, .con-social-card, .con-form-wrap');
  revealEls.forEach(function(el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease ' + (i * 0.08) + 's, transform 0.6s ease ' + (i * 0.08) + 's';
  });

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(function(el) { io.observe(el); });
    });
  });

});

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




/* ════════════════════════════════════════
   DAY / NIGHT TOGGLE
════════════════════════════════════════ */
(function () {

  var btn      = document.getElementById('theme-toggle-btn');
  var tooltip  = document.getElementById('tog-tooltip');
  var body     = document.body;
  var isDayMode = false;

  if (!btn) return;

  /* ── Apply saved preference ── */
  if (localStorage.getItem('themeMode') === 'day') {
    isDayMode = true;
    body.classList.add('day-mode');
    updateTooltip();
  }

  /* ── Toggle on click ── */
  btn.addEventListener('click', function () {
    isDayMode = !isDayMode;

    /* Show clouds animation */
    btn.classList.add('tog-animating');

    /* Short delay then switch mode — feels like clouds covering then revealing */
    setTimeout(function () {
      if (isDayMode) {
        body.classList.add('day-mode');
        localStorage.setItem('themeMode', 'day');
      } else {
        body.classList.remove('day-mode');
        localStorage.setItem('themeMode', 'night');
      }
      updateTooltip();
    }, 280);

    /* Remove cloud animation class after it finishes */
    setTimeout(function () {
      btn.classList.remove('tog-animating');
    }, 900);
  });

  /* ── Tooltip text ── */
  function updateTooltip() {
    if (!tooltip) return;
    tooltip.textContent = isDayMode
      ? 'Switch to Night Mode'
      : 'Switch to Day Mode';
  }

  updateTooltip();

  /* ── Sun ray CSS variable fix for animation ── */
  var rays = document.querySelectorAll('.tog-sun-rays span');
  var angles = [0,45,90,135,180,225,270,315];
  rays.forEach(function (ray, i) {
    ray.style.setProperty('--r', angles[i] + 'deg');
  });

})();



/* ════════════════════════════════════════
   JOURNEY LOADER — Student to Engineer
════════════════════════════════════════ */
(function () {

  var wrap        = document.getElementById('loader-wrap');
  var progressFill = document.getElementById('loader-progress-fill');
  var progressMsg  = document.getElementById('loader-progress-msg');
  var progressPct  = document.getElementById('loader-progress-pct');
  var stageTag     = document.getElementById('loader-stage-tag');
  var quoteEl      = document.getElementById('loader-quote');
  var ljFill       = document.getElementById('lj-fill');

  if (!wrap) return;

  document.body.classList.add('loading');

  /* ══════════════════════════════════════
     CONFIG
  ══════════════════════════════════════ */

  var stages = [
    { id: 0, label: 'Student',   stepId: 'lj-step-1', pct: 0   },
    { id: 1, label: 'Developer', stepId: 'lj-step-2', pct: 25  },
    { id: 2, label: 'Coder',     stepId: 'lj-step-3', pct: 50  },
    { id: 3, label: 'Cloud Dev', stepId: 'lj-step-4', pct: 75  },
    { id: 4, label: 'Engineer',  stepId: 'lj-step-5', pct: 100 }
  ];

  var quotes = [
    '"Every expert was once a beginner."',
    '"First, solve the problem. Then, write the code."',
    '"Code is poetry written in logic."',
    '"The cloud is just someone else\'s computer — until you master it."',
    '"From student to engineer — the journey makes the difference."'
  ];

  var messages = [
    'Starting the journey...',
    'Learning to code...',
    'Building projects...',
    'Mastering the cloud...',
    'Becoming an engineer! 🚀'
  ];

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  var currentStage = -1;
  var currentPct   = 0;
  var targetPct    = 0;
  var done         = false;

  /* ══════════════════════════════════════
     PROGRESS COUNTER
  ══════════════════════════════════════ */
  function tickProgress() {
    if (done) return;
    if (currentPct < targetPct) {
      currentPct = Math.min(currentPct + 0.8, targetPct);
      var pct = Math.round(currentPct);
      if (progressFill) progressFill.style.width = currentPct + '%';
      if (progressPct)  progressPct.textContent   = pct + '%';
      if (ljFill)       ljFill.style.width         = currentPct + '%';
    }
    requestAnimationFrame(tickProgress);
  }

  requestAnimationFrame(tickProgress);

  /* ══════════════════════════════════════
     ACTIVATE STAGE
  ══════════════════════════════════════ */
  function activateStage(index) {
    if (index === currentStage) return;

    /* Exit old avatar stage */
    if (currentStage >= 0) {
      var oldStage = document.getElementById('ls-' + currentStage);
      if (oldStage) {
        oldStage.classList.remove('ls-active');
        oldStage.classList.add('ls-exit');
        setTimeout(function () {
          oldStage.classList.remove('ls-exit');
        }, 500);
      }
    }

    currentStage = index;
    var s = stages[index];

    /* Activate new avatar stage */
    var newStage = document.getElementById('ls-' + index);
    if (newStage) {
      setTimeout(function () {
        newStage.classList.add('ls-active');
      }, 120);
    }

    /* Update journey step indicators */
    stages.forEach(function (st, i) {
      var stepEl = document.getElementById(st.stepId);
      if (!stepEl) return;
      stepEl.classList.remove('lj-active', 'lj-done');
      if (i < index)      stepEl.classList.add('lj-done');
      else if (i === index) stepEl.classList.add('lj-active');
    });

    /* Update stage tag */
    if (stageTag) {
      stageTag.style.opacity = '0';
      stageTag.style.transform = 'translateY(6px)';
      setTimeout(function () {
        stageTag.textContent = s.label;
        stageTag.style.transition = 'opacity 0.4s, transform 0.4s';
        stageTag.style.opacity = '1';
        stageTag.style.transform = 'translateY(0)';
      }, 200);
    }

    /* Update quote */
    if (quoteEl) {
      quoteEl.classList.add('lq-fade');
      setTimeout(function () {
        quoteEl.textContent = quotes[index];
        quoteEl.classList.remove('lq-fade');
      }, 300);
    }

    /* Update progress message */
    if (progressMsg) {
      setTimeout(function () {
        progressMsg.textContent = messages[index];
      }, 150);
    }

    /* Set target progress */
    targetPct = s.pct;
  }

  /* ══════════════════════════════════════
     RUN TIMELINE
  ══════════════════════════════════════ */
  var timeline = [
    { time: 300,  stage: 0 },
    { time: 1400, stage: 1 },
    { time: 2600, stage: 2 },
    { time: 3800, stage: 3 },
    { time: 5000, stage: 4 }
  ];

  timeline.forEach(function (step) {
    setTimeout(function () {
      activateStage(step.stage);
    }, step.time);
  });

  /* ══════════════════════════════════════
     HIDE LOADER
  ══════════════════════════════════════ */
  setTimeout(function () {
    done = true;
    targetPct = 100;
    currentPct = 100;
    if (progressFill) progressFill.style.width = '100%';
    if (progressPct)  progressPct.textContent   = '100%';
    if (ljFill)       ljFill.style.width         = '100%';

    /* Short pause on engineer stage then exit */
    setTimeout(function () {
      wrap.classList.add('loader-done');
      document.body.classList.remove('loading');
      setTimeout(function () {
        if (wrap && wrap.parentNode) {
          wrap.parentNode.removeChild(wrap);
        }
      }, 1100);
    }, 900);

  }, 6000);

  /* ══════════════════════════════════════
     BACKGROUND CANVAS PARTICLES
  ══════════════════════════════════════ */
  (function () {
    var canvas = document.getElementById('loader-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, pts = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 100; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.45 + 0.08,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.018 + Math.random() * 0.028,
        hue: Math.random() > 0.75 ? 160 + Math.random()*50 : -1
      });
    }

    function drawBg() {
      if (!wrap.parentNode) return;
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        p.twinkle += p.twinkleSpeed;
        var tw    = 0.5 + 0.5 * Math.sin(p.twinkle);
        var alpha = p.alpha * (0.5 + 0.5 * tw);
        var r     = p.r    * (0.8 + 0.4 * tw);

        /* Connect */
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(74,240,196,' + ((1-d/110)*0.07) + ')';
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }

        var col = p.hue >= 0
          ? 'hsla('+p.hue+',75%,78%,'+alpha+')'
          : 'rgba(255,255,255,'+alpha+')';

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI*2);
        ctx.fillStyle = col;
        ctx.fill();
      }

      requestAnimationFrame(drawBg);
    }

    drawBg();
  })();

})();
/* ════════════════════════════════════════
   ROCKET LOADER — Full Interactive
════════════════════════════════════════ */
(function () {

  var wrap        = document.getElementById('rl-wrap');
  var canvas      = document.getElementById('rl-canvas');
  var barFill     = document.getElementById('rl-bar-fill');
  var barMsg      = document.getElementById('rl-bar-msg');
  var barPct      = document.getElementById('rl-bar-pct');
  var statusDot   = document.getElementById('rl-status-dot');
  var statusText  = document.getElementById('rl-status-text');
  var altFill     = document.getElementById('rl-alt-fill');
  var altMarker   = document.getElementById('rl-alt-marker');
  var altVal      = document.getElementById('rl-alt-val');
  var velFill     = document.getElementById('rl-vel-fill');
  var velMarker   = document.getElementById('rl-vel-marker');
  var velVal      = document.getElementById('rl-vel-val');
  var statSpeed   = document.getElementById('rl-stat-speed');
  var statTemp    = document.getElementById('rl-stat-temp');
  var statFuel    = document.getElementById('rl-stat-fuel');
  var quoteOverlay = document.getElementById('rl-quote-overlay');
  var quoteText   = document.getElementById('rl-quote-text');
  var quoteAuthor = document.getElementById('rl-quote-author');
  var quoteBtn    = document.getElementById('rl-quote-btn');

  if (!wrap || !canvas) return;

  document.body.classList.add('rl-loading');

  /* ══════════════════════════════════════
     QUOTES
  ══════════════════════════════════════ */
  var quotes = [
    {
      text  : '"The sky is not the limit — for those who dare to reach the cloud, it is only the beginning."',
      author: '— Raushan Kumar'
    },
    {
      text  : '"Every great engineer was once a student who refused to stop learning."',
      author: '— Unknown'
    },
    {
      text  : '"Build things that matter. Ship things that last. Dream bigger than the code you write."',
      author: '— Developer Wisdom'
    },
    {
      text  : '"The difference between ordinary and extraordinary is that little extra push — like a rocket breaking through clouds."',
      author: '— Unknown'
    },
    {
      text  : '"Your potential is infinite. Your code is just the beginning of what you will create."',
      author: '— Engineering Spirit'
    }
  ];

  var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  /* ══════════════════════════════════════
     CANVAS SETUP
  ══════════════════════════════════════ */
  var ctx = canvas.getContext('2d');
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  /* ══════════════════════════════════════
     STARS
  ══════════════════════════════════════ */
  var stars = [];

  function initStars() {
    stars = [];
    for (var i = 0; i < 320; i++) {
      stars.push({
        x     : Math.random() * W,
        y     : Math.random() * H,
        r     : Math.random() * 1.6 + 0.2,
        alpha : Math.random() * 0.7 + 0.15,
        speed : Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        hue   : Math.random() > 0.82 ? 160 + Math.random() * 60 : -1,
        layer : Math.floor(Math.random() * 3)
      });
    }
  }

  initStars();

  /* ══════════════════════════════════════
     CLOUDS
  ══════════════════════════════════════ */
  var clouds = [];

  function initClouds() {
    clouds = [];
    var cloudData = [
      { x: 0.15, y: 0.25, w: 280, h: 80,  speed: 0.18, alpha: 0.55 },
      { x: 0.55, y: 0.20, w: 340, h: 90,  speed: 0.12, alpha: 0.5  },
      { x: 0.80, y: 0.32, w: 220, h: 70,  speed: 0.22, alpha: 0.45 },
      { x: 0.30, y: 0.42, w: 300, h: 85,  speed: 0.15, alpha: 0.52 },
      { x: 0.65, y: 0.50, w: 260, h: 75,  speed: 0.19, alpha: 0.48 },
      { x: 0.10, y: 0.60, w: 320, h: 88,  speed: 0.14, alpha: 0.50 },
      { x: 0.75, y: 0.68, w: 290, h: 82,  speed: 0.20, alpha: 0.46 },
      { x: 0.40, y: 0.75, w: 350, h: 95,  speed: 0.11, alpha: 0.55 }
    ];
    cloudData.forEach(function (d) {
      clouds.push({
        x    : d.x * W,
        y    : d.y * H,
        w    : d.w, h: d.h,
        speed: d.speed,
        alpha: d.alpha,
        baseAlpha: d.alpha,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.003 + Math.random() * 0.004,
        broken: false,
        breakProgress: 0
      });
    });
  }

  initClouds();

  /* ══════════════════════════════════════
     ROCKET
  ══════════════════════════════════════ */
  var rocket = {
    x       : 0,
    y       : 0,
    targetY : 0,
    velY    : 0,
    scale   : 1,
    trail   : [],
    exhaust : [],
    shake   : 0,
    launched: false,
    speed   : 0,
    cloudBreak: false
  };

  function initRocket() {
    rocket.x        = W / 2;
    rocket.y        = H + 120;
    rocket.targetY  = H * 0.55;
    rocket.velY     = 0;
    rocket.launched = false;
    rocket.speed    = 0;
    rocket.shake    = 0;
    rocket.trail    = [];
    rocket.exhaust  = [];
  }

  initRocket();

  /* ══════════════════════════════════════
     NEBULAE (background atmosphere)
  ══════════════════════════════════════ */
  function drawAtmosphere() {
    /* Deep space gradient */
    var bg = ctx.createRadialGradient(W*0.5, H*0.3, 0, W*0.5, H*0.5, Math.max(W,H)*0.9);
    bg.addColorStop(0,   '#0a1020');
    bg.addColorStop(0.35,'#060c18');
    bg.addColorStop(0.7, '#040810');
    bg.addColorStop(1,   '#020406');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* Subtle nebula glow */
    var neb1 = ctx.createRadialGradient(W*0.2, H*0.3, 0, W*0.2, H*0.3, W*0.4);
    neb1.addColorStop(0,   'rgba(74,240,196,0.03)');
    neb1.addColorStop(0.5, 'rgba(59,130,246,0.02)');
    neb1.addColorStop(1,   'transparent');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, W, H);

    var neb2 = ctx.createRadialGradient(W*0.8, H*0.6, 0, W*0.8, H*0.6, W*0.45);
    neb2.addColorStop(0,   'rgba(167,139,250,0.04)');
    neb2.addColorStop(0.5, 'rgba(59,130,246,0.02)');
    neb2.addColorStop(1,   'transparent');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, W, H);
  }

  /* ══════════════════════════════════════
     DRAW STARS
  ══════════════════════════════════════ */
  function drawStars(progress) {
    /* Stars move upward as rocket launches */
    var starDrift = progress > 20 ? (progress - 20) * 0.4 : 0;

    stars.forEach(function (s) {
      s.twinkle += s.twinkleSpeed;
      var tw    = 0.5 + 0.5 * Math.sin(s.twinkle);
      var alpha = s.alpha * (0.55 + 0.45 * tw);
      var r     = s.r * (0.8 + 0.3 * tw);

      /* Parallax scroll — faster layers move more */
      var sy = (s.y - starDrift * (s.layer + 1) * 0.6) % H;
      if (sy < 0) sy += H;

      var col = s.hue >= 0
        ? 'hsla(' + s.hue + ',75%,85%,' + alpha + ')'
        : 'rgba(255,255,255,' + alpha + ')';

      /* Sparkle on bigger stars */
      if (r > 1.3) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.35;
        ctx.strokeStyle = col;
        ctx.lineWidth   = r * 0.4;
        ctx.beginPath();
        ctx.moveTo(s.x - r*2.5, sy); ctx.lineTo(s.x + r*2.5, sy);
        ctx.moveTo(s.x, sy - r*2.5); ctx.lineTo(s.x, sy + r*2.5);
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(s.x, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });
  }

  /* ══════════════════════════════════════
     DRAW CLOUD
  ══════════════════════════════════════ */
  function drawCloud(c, t) {
    ctx.save();

    var alpha = c.alpha;
    if (c.broken) {
      c.breakProgress = Math.min(c.breakProgress + 0.018, 1);
      alpha = c.baseAlpha * (1 - c.breakProgress);
    }

    if (alpha <= 0.01) { ctx.restore(); return; }

    /* Drift */
    c.drift += c.driftSpeed;
    var cx = c.x + Math.cos(c.drift) * 8;
    var cy = c.y + Math.sin(c.drift * 0.7) * 5;

    /* Break apart */
    var bx = c.broken ? (cx < W/2 ? -c.breakProgress * 60 : c.breakProgress * 60) : 0;
    var by = c.broken ? -c.breakProgress * 30 : 0;

    ctx.globalAlpha = alpha;

    /* Cloud body using ellipses */
    var grad = ctx.createRadialGradient(cx + bx, cy + by, 0, cx + bx, cy + by, c.w * 0.6);
    grad.addColorStop(0,   'rgba(200,220,240,0.9)');
    grad.addColorStop(0.4, 'rgba(180,200,225,0.7)');
    grad.addColorStop(0.8, 'rgba(150,170,200,0.4)');
    grad.addColorStop(1,   'transparent');

    ctx.beginPath();
    ctx.ellipse(cx + bx, cy + by, c.w * 0.5, c.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    /* Cloud puffs */
    var puffs = [
      { dx: -c.w*0.22, dy: -c.h*0.2, r: c.h*0.38 },
      { dx:  c.w*0.0,  dy: -c.h*0.3, r: c.h*0.42 },
      { dx:  c.w*0.22, dy: -c.h*0.18,r: c.h*0.36 },
      { dx: -c.w*0.12, dy:  c.h*0.05,r: c.h*0.32 },
      { dx:  c.w*0.14, dy:  c.h*0.05,r: c.h*0.30 }
    ];

    puffs.forEach(function (p) {
      var pg = ctx.createRadialGradient(
        cx + bx + p.dx, cy + by + p.dy, 0,
        cx + bx + p.dx, cy + by + p.dy, p.r
      );
      pg.addColorStop(0,   'rgba(220,235,248,0.85)');
      pg.addColorStop(0.6, 'rgba(190,210,235,0.55)');
      pg.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx + bx + p.dx, cy + by + p.dy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
    });

    ctx.restore();
  }

  /* ══════════════════════════════════════
     DRAW ROCKET
  ══════════════════════════════════════ */
  function drawRocket(rx, ry, scale, shakeX) {
    ctx.save();
    ctx.translate(rx + shakeX, ry);
    ctx.scale(scale, scale);

    var r = 22; /* base unit */

    /* ── Exhaust plume ── */
    var plumeLen = 80 + Math.random() * 40;
    var plume = ctx.createLinearGradient(0, r, 0, r + plumeLen);
    plume.addColorStop(0,   'rgba(255,200,80,0.95)');
    plume.addColorStop(0.2, 'rgba(255,120,30,0.8)');
    plume.addColorStop(0.5, 'rgba(255,60,0,0.5)');
    plume.addColorStop(0.8, 'rgba(200,30,0,0.2)');
    plume.addColorStop(1,   'transparent');

    ctx.beginPath();
    ctx.moveTo(-r*0.35, r*0.8);
    ctx.quadraticCurveTo(-r*0.6 + Math.random()*8-4, r + plumeLen*0.5, 0, r + plumeLen);
    ctx.quadraticCurveTo( r*0.6 + Math.random()*8-4, r + plumeLen*0.5, r*0.35, r*0.8);
    ctx.fillStyle = plume;
    ctx.fill();

    /* Inner plume core */
    var core = ctx.createLinearGradient(0, r, 0, r + plumeLen*0.4);
    core.addColorStop(0,   'rgba(255,255,200,0.95)');
    core.addColorStop(0.5, 'rgba(255,220,80,0.6)');
    core.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.moveTo(-r*0.15, r*0.85);
    ctx.quadraticCurveTo(0, r + plumeLen*0.25, 0, r + plumeLen*0.4);
    ctx.quadraticCurveTo(0, r + plumeLen*0.25, r*0.15, r*0.85);
    ctx.fillStyle = core;
    ctx.fill();

    /* ── Fins ── */
    ctx.beginPath();
    ctx.moveTo(-r*0.7, r*0.5);
    ctx.lineTo(-r*1.1, r);
    ctx.lineTo(-r*0.35, r*0.8);
    ctx.closePath();
    ctx.fillStyle = '#c0392b';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r*0.7, r*0.5);
    ctx.lineTo(r*1.1, r);
    ctx.lineTo(r*0.35, r*0.8);
    ctx.closePath();
    ctx.fillStyle = '#c0392b';
    ctx.fill();

    /* ── Body ── */
    var bodyGrad = ctx.createLinearGradient(-r*0.7, -r*1.5, r*0.7, r);
    bodyGrad.addColorStop(0,   '#f0f4ff');
    bodyGrad.addColorStop(0.3, '#d0d8f0');
    bodyGrad.addColorStop(0.7, '#a0aac8');
    bodyGrad.addColorStop(1,   '#707890');

    ctx.beginPath();
    ctx.moveTo(-r*0.55, r*0.8);
    ctx.lineTo(-r*0.6,  r*0.2);
    ctx.lineTo(-r*0.55, -r*0.8);
    ctx.lineTo(-r*0.35, -r*1.4);
    ctx.lineTo( r*0.35, -r*1.4);
    ctx.lineTo( r*0.55, -r*0.8);
    ctx.lineTo( r*0.6,   r*0.2);
    ctx.lineTo( r*0.55,  r*0.8);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    /* Body highlight */
    var bodyHL = ctx.createLinearGradient(-r*0.2, -r, r*0.2, r*0.5);
    bodyHL.addColorStop(0,   'rgba(255,255,255,0.35)');
    bodyHL.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.moveTo(-r*0.18, r*0.7);
    ctx.lineTo(-r*0.22, -r*0.6);
    ctx.lineTo( r*0.22, -r*0.6);
    ctx.lineTo( r*0.18,  r*0.7);
    ctx.closePath();
    ctx.fillStyle = bodyHL;
    ctx.fill();

    /* ── Nose cone ── */
    var noseGrad = ctx.createLinearGradient(-r*0.35, -r*1.4, r*0.35, -r*2.6);
    noseGrad.addColorStop(0,   '#e0e8ff');
    noseGrad.addColorStop(0.4, '#4af0c4');
    noseGrad.addColorStop(1,   '#1a9a7a');

    ctx.beginPath();
    ctx.moveTo(-r*0.35, -r*1.4);
    ctx.quadraticCurveTo(-r*0.35, -r*2.0, 0, -r*2.6);
    ctx.quadraticCurveTo( r*0.35, -r*2.0, r*0.35, -r*1.4);
    ctx.closePath();
    ctx.fillStyle = noseGrad;
    ctx.fill();

    /* Nose shine */
    ctx.beginPath();
    ctx.moveTo(-r*0.15, -r*1.45);
    ctx.quadraticCurveTo(-r*0.18, -r*2.0, 0, -r*2.45);
    ctx.quadraticCurveTo(-r*0.04, -r*1.95, -r*0.05, -r*1.45);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();

    /* ── Window ── */
    var winGrad = ctx.createRadialGradient(-r*0.06, -r*0.65, 0, 0, -r*0.6, r*0.22);
    winGrad.addColorStop(0,   '#7dd8ff');
    winGrad.addColorStop(0.5, '#3a9ae8');
    winGrad.addColorStop(1,   '#1a4a80');
    ctx.beginPath();
    ctx.arc(0, -r*0.6, r*0.22, 0, Math.PI*2);
    ctx.fillStyle = winGrad;
    ctx.fill();
    /* Window rim */
    ctx.beginPath();
    ctx.arc(0, -r*0.6, r*0.22, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    /* Window shine */
    ctx.beginPath();
    ctx.arc(-r*0.07, -r*0.68, r*0.1, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    /* ── Glow around rocket ── */
    var glow = ctx.createRadialGradient(0, 0, r*0.5, 0, 0, r*3);
    glow.addColorStop(0,   'rgba(74,240,196,0.08)');
    glow.addColorStop(0.5, 'rgba(59,130,246,0.04)');
    glow.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(0, 0, r*3, 0, Math.PI*2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.restore();
  }

  /* ══════════════════════════════════════
     EXHAUST PARTICLES
  ══════════════════════════════════════ */
  var exhaustParticles = [];

  function spawnExhaust(rx, ry) {
    for (var i = 0; i < 4; i++) {
      exhaustParticles.push({
        x    : rx + (Math.random() - 0.5) * 14,
        y    : ry + 22,
        vx   : (Math.random() - 0.5) * 2.5,
        vy   : 3 + Math.random() * 4,
        r    : 2 + Math.random() * 5,
        alpha: 0.8 + Math.random() * 0.2,
        hue  : Math.random() > 0.5 ? 35 : 15,
        sat  : 90 + Math.random() * 10
      });
    }
  }

  function drawExhaust() {
    exhaustParticles = exhaustParticles.filter(function (p) {
      p.x     += p.vx;
      p.y     += p.vy;
      p.r     *= 0.94;
      p.alpha *= 0.88;
      if (p.alpha < 0.02 || p.r < 0.3) return false;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ',' + p.sat + '%,60%,' + p.alpha + ')';
      ctx.fill();
      return true;
    });
  }

  /* ══════════════════════════════════════
     SHOCK WAVE (on cloud break)
  ══════════════════════════════════════ */
  var shockWaves = [];

  function spawnShockWave(x, y) {
    shockWaves.push({ x: x, y: y, r: 10, alpha: 0.8, maxR: 180 });
  }

  function drawShockWaves() {
    shockWaves = shockWaves.filter(function (sw) {
      sw.r     += 8;
      sw.alpha -= 0.025;
      if (sw.alpha <= 0) return false;

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(74,240,196,' + sw.alpha + ')';
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,' + (sw.alpha * 0.4) + ')';
      ctx.lineWidth   = 1;
      ctx.stroke();
      return true;
    });
  }

  /* ══════════════════════════════════════
     PROGRESS + STATS
  ══════════════════════════════════════ */
  var currentPct = 0;
  var targetPct  = 0;
  var done       = false;

  var phases = [
    { pct: 8,   msg: 'Fueling engines...',         status: 'PRE-LAUNCH',   statusColor: '#f59e0b' },
    { pct: 18,  msg: 'Systems check...',            status: 'T-MINUS 10',   statusColor: '#f59e0b' },
    { pct: 30,  msg: 'Ignition sequence started...', status: 'IGNITION',   statusColor: '#ef4444' },
    { pct: 45,  msg: 'Main engines at full thrust...', status: 'LIFTOFF!',  statusColor: '#4af0c4' },
    { pct: 58,  msg: 'Clearing launch tower...',    status: 'ASCENDING',    statusColor: '#4af0c4' },
    { pct: 70,  msg: 'Entering cloud layer...',     status: 'MAX-Q',        statusColor: '#3b82f6' },
    { pct: 82,  msg: 'Breaking through clouds...',  status: 'SUPERSONIC',   statusColor: '#a78bfa' },
    { pct: 92,  msg: 'Entering upper atmosphere...', status: 'MECO',        statusColor: '#a78bfa' },
    { pct: 100, msg: 'Orbit achieved. Welcome! 🚀', status: 'ORBIT',        statusColor: '#4af0c4' }
  ];

  var phaseIndex = 0;

  function updateHUD(pct) {
    /* Bar */
    if (barFill) barFill.style.width = pct + '%';
    if (barPct)  barPct.textContent  = Math.round(pct) + '%';

    /* Altitude */
    var altKm = Math.round(pct * 4.2);
    if (altFill)   altFill.style.height   = pct + '%';
    if (altMarker) altMarker.style.bottom  = pct + '%';
    if (altVal)    altVal.textContent      = altKm + ' km';

    /* Velocity */
    var vel = Math.round(pct * 78);
    var velPct = Math.min(pct * 1.1, 100);
    if (velFill)   velFill.style.height   = velPct + '%';
    if (velMarker) velMarker.style.bottom  = velPct + '%';
    if (velVal)    velVal.textContent      = vel + ' m/s';

    /* Stats */
    if (statSpeed) {
      statSpeed.textContent = (pct * 0.078).toFixed(2);
      statSpeed.style.color = pct > 50 ? '#4af0c4' : '#e8eaf0';
    }
    if (statTemp) {
      var temp = Math.round(288 + pct * 3.5);
      statTemp.textContent = temp;
      statTemp.style.color = pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#e8eaf0';
    }
    if (statFuel) {
      var fuel = Math.max(0, Math.round(100 - pct * 0.88));
      statFuel.textContent = fuel;
      statFuel.style.color = fuel < 20 ? '#ef4444' : fuel < 50 ? '#f59e0b' : '#e8eaf0';
    }

    /* Phase update */
    while (phaseIndex < phases.length - 1 && pct >= phases[phaseIndex + 1].pct) {
      phaseIndex++;
    }
    var phase = phases[phaseIndex];
    if (barMsg)     barMsg.textContent     = phase.msg;
    if (statusText) {
      statusText.textContent = phase.status;
      statusText.style.color = phase.statusColor;
    }
    if (statusDot) {
      statusDot.style.background  = phase.statusColor;
      statusDot.style.boxShadow   = '0 0 8px ' + phase.statusColor;
    }

    /* Cloud breaking at 70% */
    if (pct >= 70 && !clouds[0].broken) {
      clouds.forEach(function (c) { c.broken = true; });
      spawnShockWave(W / 2, rocket.y);
      spawnShockWave(W / 2, rocket.y + 40);
    }

    /* Rocket position */
    var rocketProgress = Math.max(0, (pct - 15) / 85);
    var easedProgress  = 1 - Math.pow(1 - rocketProgress, 2.5);
    rocket.y = H + 120 - easedProgress * (H + 280);
    rocket.scale = 1 - easedProgress * 0.22;
    rocket.shake = pct > 25 && pct < 85 ? (Math.random() - 0.5) * (pct > 60 ? 5 : 2.5) : 0;

    if (pct > 20) {
      spawnExhaust(W / 2, rocket.y);
    }
  }

  /* ══════════════════════════════════════
     PROGRESS TICKER
  ══════════════════════════════════════ */
  function tickProgress() {
    if (done) return;
    if (currentPct < targetPct) {
      currentPct = Math.min(currentPct + 0.55, targetPct);
      updateHUD(currentPct);
    }
    requestAnimationFrame(tickProgress);
  }

  requestAnimationFrame(tickProgress);

  /* Timeline */
  var timeline = [
    { time: 400,  pct: 8   },
    { time: 1200, pct: 18  },
    { time: 2100, pct: 30  },
    { time: 3000, pct: 45  },
    { time: 3900, pct: 58  },
    { time: 4800, pct: 70  },
    { time: 5600, pct: 82  },
    { time: 6400, pct: 92  },
    { time: 7200, pct: 100 }
  ];

  timeline.forEach(function (step) {
    setTimeout(function () { targetPct = step.pct; }, step.time);
  });

  /* ══════════════════════════════════════
     SHOW QUOTE
  ══════════════════════════════════════ */
  function showQuote() {
    done = true;
    if (quoteText)   quoteText.textContent   = randomQuote.text;
    if (quoteAuthor) quoteAuthor.textContent  = randomQuote.author;

    /* Typewriter effect on quote */
    var fullText = randomQuote.text;
    var charIndex = 0;
    if (quoteText) quoteText.textContent = '';

    function typeChar() {
      if (charIndex < fullText.length) {
        quoteText.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 22);
      }
    }

    if (quoteOverlay) {
      quoteOverlay.classList.add('rl-quote-show');
      setTimeout(typeChar, 400);
    }
  }

  setTimeout(showQuote, 7800);

  /* Enter Portfolio button */
  if (quoteBtn) {
    quoteBtn.addEventListener('click', function () {
      wrap.classList.add('rl-exit');
      document.body.classList.remove('rl-loading');
      setTimeout(function () {
        if (wrap && wrap.parentNode) {
          wrap.parentNode.removeChild(wrap);
        }
      }, 1300);
    });
  }

  /* ══════════════════════════════════════
     MAIN DRAW LOOP
  ══════════════════════════════════════ */
  var frameT = 0;

  function draw() {
    if (!wrap.parentNode) return;
    ctx.clearRect(0, 0, W, H);

    drawAtmosphere();
    drawStars(currentPct);

    /* Draw clouds behind rocket */
    clouds.forEach(function (c) { drawCloud(c, frameT); });

    /* Exhaust behind rocket body */
    drawExhaust();

    /* Rocket */
    if (rocket.y < H + 100) {
      drawRocket(W / 2, rocket.y, rocket.scale, rocket.shake);
    }

    /* Shock waves */
    drawShockWaves();

    frameT++;
    requestAnimationFrame(draw);
  }

  draw();

})();