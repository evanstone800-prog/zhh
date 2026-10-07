'use strict';
/* =========================================================
   四季之歌 · MG 版 — shared core: canvas, easing, beat clock,
   colour and shape helpers, kinetic type.
   Every frame is a pure function of t (seconds).
   ========================================================= */
const W = 1920, H = 1080, DUR = 269;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const X = cv.getContext('2d');
const mk = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const TAU = Math.PI * 2, PI = Math.PI;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const R = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7 + i * k * .013) * 43758.5453; return x - Math.floor(x); };

/* ---------- easing ---------- */
const E = {
  lin: t => t,
  i2: t => t * t, o2: t => 1 - (1 - t) * (1 - t), io2: t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2,
  i3: t => t * t * t, o3: t => 1 - (1 - t) ** 3, io3: t => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2,
  o5: t => 1 - (1 - t) ** 5, io5: t => t < .5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2,
  oExpo: t => t >= 1 ? 1 : 1 - 2 ** (-10 * t), iExpo: t => t <= 0 ? 0 : 2 ** (10 * t - 10),
  ioExpo: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2,
  oBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; },
  oBack2: t => { const c1 = 3, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; },
  iBack: t => { const c1 = 1.70158; return (c1 + 1) * t ** 3 - c1 * t * t; },
  oElastic: t => t <= 0 ? 0 : t >= 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1,
  sine: t => .5 - .5 * Math.cos(t * PI),
};
// eased progress of t through [a, b]
const seg = (t, a, b, e = E.io3) => e(clamp((t - a) / (b - a), 0, 1));
// rises over [a, a+i], holds, falls over [b-o, b]
const env = (t, a, b, i = .4, o = .4, e = E.io2) => Math.min(seg(t, a, a + i, e), 1 - seg(t, b - o, b, e));

/* ---------- beat clock (measured from the track: ~92.5 BPM) ---------- */
const BPM = 92.5, SPB = 60 / BPM, BEAT0 = .58;
const beatPh = t => (((t - BEAT0) / SPB) % 1 + 1) % 1;
const beatHit = (t, k = 6) => Math.exp(-beatPh(t) * k);
const beatIdx = t => Math.floor((t - BEAT0) / SPB);

/* ---------- colour ---------- */
const _hc = {};
const hex = h => _hc[h] || (_hc[h] = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t, 0, 1))).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => { const c = hex(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const shade = (h, k) => k > 0 ? mix(h, '#ffffff', k) : mix(h, '#10121f', -k);
const C = {
  ink: '#1B1E3A', night: '#141A3C', night2: '#25306A', night3: '#3E3F86',
  cream: '#FFF5E4', paper: '#F7EEDC', coral: '#EF6A55', coralD: '#C9473A', gold: '#F7BE4A', sun: '#FFE7A3',
  peach: '#F8AE8A', rose: '#F49AA3', plum: '#6E4E8F', lilac: '#B7A2DB',
  pink: '#F8C8D4', pinkD: '#E99AB0', mint: '#A9DDB4', leaf: '#6DBB7C', leafD: '#3F8E5C', grass: '#8ACB6A',
  sky: '#59BDEB', skyL: '#BDE6F7', sea: '#2C8CC6', seaD: '#1A5F95', sand: '#F6DFA8', sandD: '#E2C27E',
  orange: '#EE8A3C', rust: '#C9532E', amber: '#F4A93B', maple: '#D8452E',
  snow: '#EEF3FA', ice: '#C3D3E8', frost: '#8DA4C8', slate: '#4C5E8C',
  teal: '#2E9C9A', tealD: '#1F6F75', navy: '#2B3A67', skin: '#FFD9BF', skinD: '#F0B994', hair: '#2B2233',
};
// the two characters
const LOOK = {
  girlKid: { kid: true, skin: C.skin, hair: C.hair, hairStyle: 'bob', top: C.coral, bottom: C.skin, dress: true, shoe: '#5B3A4A', blush: true },
  friendKid: { kid: true, skin: C.skin, hair: C.hair, hairStyle: 'short', top: C.teal, bottom: '#3B4A7A', cap: C.gold, shoe: '#2B2233', blush: true },
  girl: { skin: C.skin, hair: C.hair, hairStyle: 'bob', top: '#3C4F86', bottom: '#2B3359', scarf: C.coral, shoe: '#2B2233', coat: true },
  friend: { skin: C.skin, hair: C.hair, hairStyle: 'short', top: C.teal, bottom: '#34406B', cap: C.gold, shoe: '#2B2233' },
};

/* ---------- shapes ---------- */
function fill(g, s) { g.fillStyle = s; g.fillRect(0, 0, W, H); }
function vg(g, y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); for (const [p, c] of stops) gr.addColorStop(p, c); return gr; }
function hg(g, x0, x1, stops) { const gr = g.createLinearGradient(x0, 0, x1, 0); for (const [p, c] of stops) gr.addColorStop(p, c); return gr; }
function circle(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, TAU); g.fill(); }
function ring(g, x, y, r, w, col) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, TAU); g.stroke(); }
function glow(g, x, y, r, col, a = 1) { if (r <= 0 || a <= 0) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(.35, rgba(col, a * .4)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function line(g, x0, y0, x1, y1, w, col, cap = 'round') { g.strokeStyle = col; g.lineWidth = w; g.lineCap = cap; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
// draw a path with a flat offset shadow beneath it (paper-cut depth)
function paper(g, path, col, o = {}) {
  const dx = o.dx ?? 0, dy = o.dy ?? 10, sa = o.sa ?? .14;
  if (sa > 0) { g.save(); g.translate(dx, dy); path(g); g.fillStyle = rgba(o.sc || '#1a1030', sa); g.fill(); g.restore(); }
  path(g); g.fillStyle = col; g.fill();
}
// smooth layered hill band: y = base - amp * (sum of sines)
function hillPath(base, amp, freq, ph, seed = 0) {
  return g => {
    g.beginPath(); g.moveTo(-20, H + 20);
    for (let x = -20; x <= W + 20; x += 24) {
      const y = base - amp * (.55 * Math.sin(x * freq + ph + seed) + .3 * Math.sin(x * freq * 2.3 + ph * 1.3 + seed * 2.1) + .15 * Math.sin(x * freq * 4.1 + seed * 3.3));
      g.lineTo(x, y);
    }
    g.lineTo(W + 20, H + 20); g.closePath();
  };
}
function hill(g, base, amp, freq, ph, col, o = {}) { paper(g, hillPath(base, amp, freq, ph, o.seed || 0), col, { dy: o.dy ?? -8, sa: o.sa ?? .1 }); }
// flat MG cloud: row of circles on a flat base
function cloudPath(x, y, s) {
  return g => {
    g.beginPath();
    g.arc(x - .55 * s, y - .18 * s, .32 * s, PI * .5, PI * 1.5);
    g.arc(x - .18 * s, y - .42 * s, .42 * s, PI, PI * 1.9);
    g.arc(x + .3 * s, y - .32 * s, .36 * s, PI * 1.2, PI * 2);
    g.arc(x + .62 * s, y - .14 * s, .26 * s, PI * 1.5, PI * .5);
    g.closePath();
  };
}
function cloud(g, x, y, s, col = '#ffffff', o = {}) { paper(g, cloudPath(x, y, s), col, { dy: o.dy ?? 10, sa: o.sa ?? .08 }); }
function stars(g, t, n, y1, a = 1, seed = 1, col = '#FFF5E4') {
  g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const x = R(i, seed) * W, y = R(i, seed + 1) ** 1.3 * y1, tw = .5 + .5 * Math.sin(t * (.8 + R(i, seed + 2) * 2.5) + i);
    g.globalAlpha = a * (.25 + .75 * tw) * (.45 + R(i, seed + 3) * .55);
    const r = 1.2 + R(i, seed + 4) * 2.2;
    if (R(i, seed + 5) < .08) { // a few four-point sparkles
      const s = r * 3.2; g.beginPath(); g.moveTo(x, y - s); g.quadraticCurveTo(x, y, x + s, y); g.quadraticCurveTo(x, y, x, y + s); g.quadraticCurveTo(x, y, x - s, y); g.quadraticCurveTo(x, y, x, y - s); g.fill();
    } else { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  }
  g.globalAlpha = 1;
}
function sparkle(g, x, y, s, col, a = 1) {
  g.save(); g.globalAlpha *= a; g.fillStyle = col; g.beginPath(); g.moveTo(x, y - s); g.quadraticCurveTo(x, y, x + s, y); g.quadraticCurveTo(x, y, x, y + s); g.quadraticCurveTo(x, y, x - s, y); g.quadraticCurveTo(x, y, x, y - s); g.fill(); g.restore();
}
// falling / drifting particles; kinds: petal leaf snow dot spark
function drift(g, t, n, kind, o = {}) {
  const [ax, ay, aw, ah] = o.area || [0, -40, W, H + 80], sp = o.speed || 1, seed = o.seed || 7, wind = o.wind || 0;
  for (let i = 0; i < n; i++) {
    const life = (ah / (60 + R(i, seed) * 90)) / sp, ph = ((t / life) + R(i, seed + 1)) % 1;
    let x = ax + R(i, seed + 2) * aw + Math.sin(t * (.5 + R(i, seed + 3)) + i) * 40 + wind * ph * aw * .35;
    let y = o.up ? ay + ah - ph * ah : ay + ph * ah;
    x = ((x - ax) % aw + aw) % aw + ax;
    const s = (o.size || 1) * (.6 + R(i, seed + 4) * .8), rot = t * (1 + R(i, seed + 5) * 2) + i;
    g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = (o.alpha ?? 1) * Math.min(1, Math.sin(ph * PI) * 3);
    if (kind === 'petal') { g.fillStyle = R(i, 9) < .5 ? '#F8C8D4' : '#FFE4EA'; g.beginPath(); g.ellipse(0, 0, 9 * s, 5 * s * (.35 + .65 * Math.abs(Math.sin(rot * 1.6))), 0, 0, TAU); g.fill(); }
    else if (kind === 'leaf') { g.fillStyle = [C.orange, C.maple, C.amber, C.rust][i % 4]; g.beginPath(); g.moveTo(0, -11 * s); g.quadraticCurveTo(9 * s, 0, 0, 11 * s * Math.abs(Math.cos(rot))); g.quadraticCurveTo(-9 * s, 0, 0, -11 * s); g.fill(); }
    else if (kind === 'snow') { g.fillStyle = o.col || '#ffffff'; g.beginPath(); g.arc(0, 0, 3.6 * s, 0, TAU); g.fill(); }
    else if (kind === 'dot') { g.fillStyle = o.col || '#ffffff'; g.beginPath(); g.arc(0, 0, 3 * s, 0, TAU); g.fill(); }
    else if (kind === 'spark') { g.globalCompositeOperation = 'lighter'; glow(g, 0, 0, 14 * s, o.col || C.sun, .9); }
    g.restore();
  }
}
// sun with soft halo rings (flat MG)
function sunDisc(g, x, y, r, col = C.sun, o = {}) {
  const halo = o.halo ?? 1, b = o.beat ?? 0;
  if (halo > 0) for (let i = 3; i >= 1; i--) circle(g, x, y, r * (1 + i * .28 + b * .05 * i), rgba(o.haloCol || col, .1 * halo));
  circle(g, x, y, r, col);
}
// radial sunburst stripes
function burst(g, x, y, n, len, col, a, rot = 0) {
  g.save(); g.fillStyle = rgba(col, a); g.translate(x, y); g.rotate(rot);
  for (let i = 0; i < n; i++) { const a0 = i / n * TAU, a1 = a0 + TAU / n / 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a0) * len, Math.sin(a0) * len); g.lineTo(Math.cos(a1) * len, Math.sin(a1) * len); g.closePath(); g.fill(); }
  g.restore();
}
// speed / wind swoosh line
function swoosh(g, x, y, len, t, col, w = 4, a = 1) {
  const f = clamp(t, 0, 1), h = E.o3(f), tl = E.i3(f);
  g.save(); g.globalAlpha *= a * (1 - f * .3); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round';
  g.beginPath(); const x0 = x + len * tl, x1 = x + len * h;
  for (let k = 0; k <= 12; k++) { const xx = lerp(x0, x1, k / 12), yy = y + Math.sin((xx - x) / len * PI * 2) * 14; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
  g.stroke(); g.restore();
}

/* ---------- type ---------- */
const FONT = '"WK", "WenQuanYi Zen Hei", sans-serif', FONTM = '"WKM", "WK", "WenQuanYi Zen Hei", sans-serif';
// staggered per-character entrance; returns total width
function ktext(g, str, x, y, size, t, o = {}) {
  const chars = [...str], st = o.stagger ?? .045, dur = o.dur ?? .55, font = `${o.weight || ''} ${size}px ${o.medium ? FONTM : FONT}`.trim();
  g.save(); g.font = font; g.textBaseline = 'middle'; g.textAlign = 'left';
  const sp = o.spacing ?? size * .08, ws = chars.map(c => g.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - tw : x - tw / 2;
  const out = o.out ?? 1;
  for (let i = 0; i < chars.length; i++) {
    const p = clamp((t - i * st) / dur, 0, 1), e = (o.ease || E.oBack)(p);
    if (p > 0) {
      g.save(); g.globalAlpha = (o.alpha ?? 1) * Math.min(1, p * 2.2) * out;
      const dy = (1 - e) * (o.rise ?? size * .55) - (1 - out) * size * .3;
      g.translate(cx + ws[i] / 2, y + dy); const sc = lerp(o.from ?? .6, 1, e); g.scale(sc, sc); if (o.rot) g.rotate((1 - e) * o.rot);
      if (o.shadow) { g.shadowColor = o.shadow; g.shadowBlur = o.blur ?? 18; g.shadowOffsetY = o.sy ?? 3; }
      if (o.stroke) { g.lineWidth = o.strokeW || 6; g.strokeStyle = o.stroke; g.lineJoin = 'round'; g.strokeText(chars[i], -ws[i] / 2, 0); }
      g.fillStyle = o.col || C.cream; g.fillText(chars[i], -ws[i] / 2, 0);
      g.restore();
    }
    cx += ws[i] + sp;
  }
  g.restore();
  return tw;
}

/* ---------- small structures ---------- */
// a reusable offscreen buffer pool keyed by name
const SC = {}; // scenes: SC.name = (g, lt, u, o, t) => draws a full frame
const BUF = {};
const buf = (k, w = W, h = H) => { const b = BUF[k] || (BUF[k] = mk(w, h)); const c = b.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, w, h); return b; };
