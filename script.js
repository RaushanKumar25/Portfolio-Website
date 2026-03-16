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



