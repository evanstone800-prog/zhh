'use strict';
/* =========================================================
   Scenes 167–269 s: chorus 3 (together again), chorus 4 (the photo wall),
   verse A3 (the train, the paper plane), outro
   ========================================================= */

/* ---------- chorus 3: the two of them, grown up, through the year ---------- */
function bubble(g, x, y, s, p, icon) {
  if (p <= 0) return;
  const e = E.oBack(p);
  g.save(); g.translate(x, y); g.scale(e, e);
  g.fillStyle = 'rgba(40,20,40,.12)'; g.beginPath(); g.ellipse(6, 8, s, s * .78, 0, 0, TAU); g.fill();
  g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, 0, s, s * .78, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(-s * .3, s * .6); g.lineTo(-s * .55, s * 1.05); g.lineTo(-s * .02, s * .7); g.fill();
  icon(g, s);
  g.restore();
}
const ICON = {
  boat: (g, s) => sailboat(g, 0, s * .2, s * .32, C.coral, C.cream),
  kite: (g, s) => { g.fillStyle = C.coral; g.beginPath(); g.moveTo(0, -s * .45); g.lineTo(s * .3, 0); g.lineTo(0, s * .45); g.lineTo(-s * .3, 0); g.fill(); g.fillStyle = C.gold; g.beginPath(); g.moveTo(0, -s * .45); g.lineTo(s * .3, 0); g.lineTo(0, 0); g.fill(); },
  star: (g, s) => sparkle(g, 0, 0, s * .45, C.gold),
  cap: (g, s) => { g.fillStyle = C.gold; g.beginPath(); g.ellipse(0, s * .1, s * .36, s * .3, 0, PI, TAU); g.fill(); g.beginPath(); g.ellipse(s * .3, s * .1, s * .26, s * .07, 0, 0, TAU); g.fill(); },
  flower: (g, s) => flower(g, 0, 0, s * .4, 1, C.pink, C.gold),
};
SC.twoUnderTree = (g, lt, u) => {
  springSky(g);
  sunDisc(g, 1480, 220, 86 * (1 + .04 * beatHit(lt)), C.gold, { halo: 1, haloCol: C.sun });
  cloud(g, 360 + lt * 10, 240, 160); cloud(g, 1100 + lt * 6, 160, 110, '#ffffff', { sa: .05 });
  hill(g, 720, 60, .0025, 1, '#C9E8C7'); hill(g, 800, 50, .0034, 2.4, C.mint, { seed: 2 });
  hill(g, 870, 30, .002, 4, '#8FCE97', { seed: 5 });
  for (let i = 0; i < 26; i++) flower(g, (R(i, 51) * W * 1.1) - 40, 890 + R(i, 52) * 160, 10 + R(i, 53) * 8, 1, ['#fff', C.pink, C.gold][i % 3], C.gold);
  tree(g, 760, 880, 560, C.pink, '#8A5A48', { t: lt, dots: '#ffffff' });
  // they sit side by side against the trunk and remember out loud
  person(g, 850, 905, 300, POSE.sit(), LOOK.girl, { t: lt, wind: .3 });
  person(g, 1090, 905, 310, POSE.sit(), LOOK.friend, { t: lt, dir: -1 });
  const icons = [ICON.boat, ICON.kite, ICON.star, ICON.cap];
  for (let i = 0; i < 4; i++) { const t0 = .3 + i * .8, p = seg(lt, t0, t0 + .35) * (1 - seg(lt, t0 + 1.2, t0 + 1.5)); bubble(g, i % 2 ? 1140 : 790, 520 - (i % 2) * 30, 70, p, icons[i]); }
  drift(g, lt, 50, 'petal', { wind: -.4, size: 1.3 });
};
SC.twoKites = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#62BDEA'], [1, '#D6F0FB']]));
  cloud(g, 300 + lt * 30, 200, 150); cloud(g, 1300 + lt * 20, 150, 120);
  hill(g, 650, 40, .002, lt * .2, '#9ED7A0'); hill(g, 760, 50, .003, 1 + lt * .3, '#7CC47E', { seed: 3 }); hill(g, 880, 40, .0024, 2 + lt * .4, C.grass, { seed: 6 });
  g.lineCap = 'round';
  for (let i = 0; i < 120; i++) { const x = R(i, 61) * (W + 40) - 20, b = 940 + R(i, 62) * 160, h = 50 + R(i, 63) * 70, w = Math.sin(x * .006 - lt * 4) * 22 + 12; g.strokeStyle = i % 3 ? '#5FAE55' : '#4E9A49'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, b); g.quadraticCurveTo(x + w * .3, b - h * .6, x + w, b - h); g.stroke(); }
  const pp = [[760, LOOK.girl, 1, C.coral, C.gold, 560], [1160, LOOK.friend, -1, C.gold, C.teal, 1360]];
  pp.forEach(([px, L, d, c1, c2, kx0], i) => {
    const out = {}; person(g, px, 930, 330, POSE.reach(.65 + Math.sin(lt * 3 + i) * .05), L, { dir: d, t: lt, out });
    const kx = kx0 + Math.sin(lt * 1.4 + i * 2) * 40, ky = 230 + i * 40 + Math.sin(lt * 2 + i) * 30;
    g.strokeStyle = rgba(C.ink, .5); g.lineWidth = 2; g.beginPath(); g.moveTo(out.hand[0], out.hand[1]); g.quadraticCurveTo((kx + out.hand[0]) / 2, ky + 260, kx, ky + 60); g.stroke();
    g.save(); g.translate(kx, ky); g.rotate(Math.sin(lt * 2 + i) * .15); g.fillStyle = c1; g.beginPath(); g.moveTo(0, -70); g.lineTo(52, 0); g.lineTo(0, 70); g.lineTo(-52, 0); g.fill(); g.fillStyle = c2; g.beginPath(); g.moveTo(0, -70); g.lineTo(52, 0); g.lineTo(0, 0); g.fill(); g.beginPath(); g.moveTo(0, 70); g.lineTo(-52, 0); g.lineTo(0, 0); g.fill(); g.restore();
  });
};
SC.twoBeach = (g, lt, u) => {
  fill(g, vg(g, 0, 560, [[0, '#F59A72'], [1, '#FFD9A0']]));
  sunDisc(g, 1300, 470, 90, '#FFF2C8', { halo: 1, beat: beatHit(lt) });
  cloud(g, 400 + lt * 12, 200, 150, '#FFF0E0'); cloud(g, 1050 + lt * 8, 130, 100, '#FFF0E0');
  flatSea(g, 560, '#E9947A', '#7A5A8E', lt, { sunX: 1300, refl: .7, reflCol: '#FFF2C8', da: .25 });
  for (let i = 0; i < 2; i++) gull(g, 300 + i * 110 + lt * 60, 280 + i * 30 + Math.sin(lt * 2 + i) * 10, 40, lt * 9 + i, '#ffffff');
  const sw = Math.sin(lt * 1.6) * 20;
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 800 + sw); g2.bezierCurveTo(600, 770 + sw, 1300, 810 + sw, W + 20, 780 + sw); g2.lineTo(W + 20, H); g2.closePath(); }, '#ffffff', { sa: 0 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 812 + sw * .5); g2.bezierCurveTo(600, 782 + sw * .5, 1300, 822 + sw * .5, W + 20, 792 + sw * .5); g2.lineTo(W + 20, H); g2.closePath(); }, '#F2C99A', { dy: -8, sa: .1 });
  // a sandcastle between them, two flags on top, like before
  const sx = 960, sy = 930; g.fillStyle = '#E2B47E';
  rr(g, sx - 120, sy - 70, 240, 70, 6); g.fill(); rr(g, sx - 70, sy - 130, 140, 60, 6); g.fill();
  for (const [fx, c] of [[-50, C.coral], [50, C.gold]]) { line(g, sx + fx, sy - 130, sx + fx, sy - 210, 4, C.ink); g.fillStyle = c; g.beginPath(); g.moveTo(sx + fx, sy - 210); g.lineTo(sx + fx + 46 + Math.sin(lt * 6 + fx) * 6, sy - 196); g.lineTo(sx + fx, sy - 182); g.fill(); }
  person(g, 700, 940, 320, POSE.sit(), LOOK.girl, { t: lt, wind: .6 });
  person(g, 1220, 940, 330, POSE.sit(), LOOK.friend, { t: lt, dir: -1 });
};
SC.twoTable = (g, lt, u) => {
  SC.reunionTable(g, lt + 3, 1, { full: true });
};
SC.snowPlatform = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#8C9CC8'], [1, '#E2E9F5']]));
  sunDisc(g, 1450, 240, 70, '#FFF6E0', { halo: .6 });
  for (let i = 0; i < 7; i++) pine(g, 100 + i * 300, 640, 160, true);
  g.fillStyle = '#C3CEE3'; g.fillRect(0, 640, W, 60);
  line(g, 0, 680, W, 680, 6, '#8E9AB8'); line(g, 0, 696, W, 696, 6, '#8E9AB8');
  g.fillStyle = '#F4F7FC'; g.fillRect(0, 720, W, H - 720); g.fillStyle = '#ffffff'; g.fillRect(0, 720, W, 14);
  line(g, 1500, 720, 1500, 380, 10, '#3E3B5A'); circle(g, 1500, 330, 70, '#FFF6E0'); ring(g, 1500, 330, 70, 10, '#3E3B5A');
  const ma = lt * 3, ha = lt * .3; line(g, 1500, 330, 1500 + Math.sin(ma) * 52, 330 - Math.cos(ma) * 52, 6, C.ink); line(g, 1500, 330, 1500 + Math.sin(ha) * 32, 330 - Math.cos(ha) * 32, 9, C.ink);
  // the two stand close, breath clouding in the cold
  person(g, 740, 980, 400, POSE.stand(), LOOK.girl, { t: lt, wind: .3 });
  person(g, 1120, 980, 415, POSE.look(), Object.assign({}, LOOK.friend, { scarf: C.gold }), { t: lt, dir: -1 });
  for (let i = 0; i < 2; i++) for (let k = 0; k < 3; k++) { const ph = (lt * .8 + k / 3 + i * .5) % 1; circle(g, (i ? 1060 : 800) + (i ? -1 : 1) * ph * 50, 600 - ph * 50, 10 + ph * 18, rgba('#ffffff', .7 * (1 - ph))); }
  drift(g, lt, 160, 'snow', { speed: .8, size: 1.2 });
};
SC.stationClock = (g, lt, u) => {
  const k = seg(lt, 0, .8, E.io3);
  if (k < 1) SC.snowPlatform(g, lt + 2, 1, {});
  g.save(); g.globalAlpha = k; fill(g, vg(g, 0, H, [[0, '#4C5E8C'], [1, '#8C9CC8']])); g.restore();
  const cx = lerp(1500, 960, k), cy = lerp(330, 420, k), r = lerp(70, 270, k);
  // the train glides in under the clock
  const tx = lerp(W + 200, -900, seg(lt, .6, 2.8, E.io3));
  g.save(); g.globalAlpha = k; train(g, tx, 880, 90, 6); g.restore();
  circle(g, cx + 12, cy + 18, r + 16, 'rgba(10,10,40,.25)');
  circle(g, cx, cy, r + 16, '#3E3B5A'); circle(g, cx, cy, r, '#FFF6E0');
  for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, l = i % 5 ? 10 : 28; line(g, cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9, cx + Math.cos(a) * (r * .9 - l * k), cy + Math.sin(a) * (r * .9 - l * k), i % 5 ? 3 : 6, C.ink); }
  const ma = -PI / 2 + lt * lt * 3 + 1, ha = -PI / 2 + lt * lt * .25 + 2;
  line(g, cx, cy, cx + Math.cos(ha) * r * .5, cy + Math.sin(ha) * r * .5, 16, C.ink);
  line(g, cx, cy, cx + Math.cos(ma) * r * .75, cy + Math.sin(ma) * r * .75, 9, C.coral);
  circle(g, cx, cy, 16, C.ink);
  drift(g, lt, 100, 'snow', { speed: .8, size: 1.2, alpha: 1 - k * .5 });
};

/* ---------- chorus 4: a wall of photographs, one for every line ---------- */
const PHOTOS = [
  ['bloom', .95, {}], ['springNap', 2.5, {}], ['twoUnderTree', 1.5, {}], ['grassField', 1, {}], ['summerBeach', 1.5, {}],
  ['moonPeak', 1.4, {}], ['twoTable', 0, {}], ['winterSnow', 1, {}], ['twoBeach', 1, {}],
];
const _photoCache = {};
function photoImg(i) {
  if (_photoCache[i]) return _photoCache[i];
  const c = mk(); const [name, at, o] = PHOTOS[i];
  const g = c.getContext('2d'); g.save(); SC[name](g, at, 1, Object.assign({ d: 4 }, o)); g.restore();
  // a little warmth and fade, like an old print
  g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,190,120,.35)'; g.fillRect(0, 0, W, H);
  return (_photoCache[i] = c);
}
// world layout of the wall, and where the camera looks for each line
const WALL = PHOTOS.map((_, i) => [600 + i * 620, 470 + (i % 2 ? 60 : -40), (R(i, 9) - .5) * .14]);
const WALLCAM = [[0, 600], [1, 900], [5, 1850], [7, 2450], [10, 3050], [12, 3720], [16, 4300], [18, 4950], [21, 5350]];
SC.photoWall = (g, lt, u) => {
  let i = 0; while (i + 1 < WALLCAM.length && WALLCAM[i + 1][0] < lt) i++;
  const [t0, x0] = WALLCAM[i], [t1, x1] = WALLCAM[Math.min(i + 1, WALLCAM.length - 1)];
  const cam = t1 === t0 ? x0 : lerp(x0, x1, E.io3(clamp((lt - t0) / (t1 - t0), 0, 1)));
  const pull = seg(lt, 18.2, 21, E.io3), z = lerp(1, .55, pull);
  corkWall(g);
  g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-cam, -540);
  // fairy lights strung along the wall
  g.strokeStyle = '#5A4A3A'; g.lineWidth = 3; g.beginPath(); for (let x = -400; x < 6400; x += 40) g.lineTo(x, 130 + Math.sin(x * .01) * 40); g.stroke();
  for (let x = -400; x < 6400; x += 160) { const y = 140 + Math.sin(x * .01) * 40, tw = .6 + .4 * Math.sin(lt * 3 + x); glow(g, x, y + 12, 50, C.sun, .5 * tw); circle(g, x, y + 12, 10, mix(C.gold, '#FFF6D0', tw)); }
  WALL.forEach(([x, y, rot], k) => {
    if (Math.abs(x - cam) > 1600 / z) return;
    const appear = seg(lt, k * 2.1 - 1.2, k * 2.1 - .6, E.oBack);
    if (appear <= 0 && k > 0) return;
    g.save(); g.translate(x, y - (1 - Math.max(appear, k === 0 ? 1 : 0)) * 80); g.globalAlpha = k === 0 ? 1 : Math.min(1, appear * 1.5);
    polaroid(g, 0, 0, 480, rot, photoImg(k), { pin: [C.coral, C.gold, C.sky, C.pink][k % 4] });
    g.restore();
  });
  // a red string ties the photos together
  g.strokeStyle = rgba(C.coral, .8); g.lineWidth = 3; g.beginPath(); WALL.forEach(([x, y], k) => { const yy = y - 283 + 18; k ? g.quadraticCurveTo(x - 310, yy + 80, x, yy) : g.moveTo(x, yy); }); g.stroke();
  g.restore();
  // time passes over the wall at the end: the prints yellow and the light goes amber
  const age = seg(lt, 18, 21, E.io2); if (age > 0) { g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = age * .5; fill(g, '#E8B878'); g.restore(); }
};

/* ---------- 208–216 the train pulls away ---------- */
SC.trainLeave = (g, lt, u) => {
  const k = seg(lt, 0, 3, E.io2);
  platform(g, lt, .4 + .6 * k);
  const tx = lerp(-200, -1900, seg(lt, 1.2, 4, E.i3));
  // one carriage window frames her; she waves through the glass
  train(g, tx, 690, 120, 5);
  const wx = tx + 120 * (4.2 * 2 + .35 + 1 * .92) + 36, wy = 690 - 120 * 1.2 + 30;
  g.save(); g.beginPath(); g.rect(wx - 36, wy - 30, 72, 60); g.clip(); personFront(g, wx, wy + 120, 150, LOOK.girl, { armR: 2.4 + Math.sin(lt * 8) * .25, armL: .15, t: lt }); g.restore();
  // he waves from the platform
  const wv = seg(lt, .3, .7, E.oBack), osc = Math.sin(lt * 8);
  person(g, 1480, 1000, 420, POSE.wave(wv, lt), LOOK.friend, { t: lt, dir: -1 });
  void osc;
};
SC.windowHand = (g, lt, u) => {
  // inside the carriage: the world slides past; the platform and the small figure fall behind
  const pan = lt * 520;
  fill(g, '#3C4F86');
  g.save(); g.beginPath(); rr(g, 260, 140, 1400, 760, 60); g.clip();
  dawnSky(g, 1, 640); sunDisc(g, 1300, 300, 80, '#FFF2C8', { halo: 1 });
  for (let i = 0; i < 10; i++) { const x = ((i * 300 - pan * .4) % (W + 300) + W + 300) % (W + 300) - 150; paper(g, g2 => { g2.beginPath(); g2.ellipse(x, 700, 260, 120 + R(i, 3) * 60, 0, PI, TAU); }, '#8E5A86', { sa: 0 }); }
  g.fillStyle = '#5B3C6E'; g.fillRect(0, 700, W, 400);
  // the platform recedes on the left with him on it
  const px = 1500 - pan * .9; if (px > -400) { g.fillStyle = '#B48A92'; g.fillRect(px - 400, 690, 800, 40); g.fillStyle = C.cream; g.fillRect(px - 400, 690, 800, 8); personFront(g, px, 692, lerp(260, 200, u), LOOK.friend, { armR: 2.4 + Math.sin(lt * 8) * .25, armL: .15, smile: true }); }
  for (let i = 0; i < 4; i++) { const x = ((i * 600 - pan * 1.4) % (W + 600) + W + 600) % (W + 600) - 300; line(g, x, 900, x, 300, 12, '#4A3060'); }
  // reflection sheen on the glass
  g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(300, 140); g.lineTo(700, 140); g.lineTo(400, 900); g.lineTo(260, 900); g.fill();
  g.restore();
  g.strokeStyle = '#2B3A67'; g.lineWidth = 40; rr(g, 260, 140, 1400, 760, 60); g.stroke();
  // her palm pressed to the glass
  const hk = seg(lt, .4, 1.4, E.o3);
  g.save(); g.globalAlpha = hk; hand(g, 1000, lerp(1240, 760, hk), 160, -PI / 2, LOOK.girl, { curl: 0, thumb: 0 }); g.restore();
  const fog = seg(lt, 1.2, 2.4, E.io2); if (fog > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 1000, 560, 160, '#ffffff', .18 * fog); g.restore(); }
};
/* ---------- 216–220 the train goes round the year ---------- */
SC.trainPlanet = (g, lt, u, o) => {
  const ang = -(lt + .2) * 1.3, r = 760, cy = 1420;
  const topA = ((-ang % TAU) + TAU) % TAU, qf = topA / (TAU / 4), qi = Math.floor(qf) % 4, qn = (qi + 1) % 4, qk = E.io2(clamp((qf % 1 - .7) / .3, 0, 1));
  fill(g, vg(g, 0, H, [[0, mix(seasonSky[qi][0], seasonSky[qn][0], qk)], [1, mix(seasonSky[qi][1], seasonSky[qn][1], qk)]]));
  const fly = seg(lt, o.d - .9, o.d, E.io3);
  if (fly > 0) { g.save(); g.globalAlpha = fly; fill(g, vg(g, 0, H, [[0, '#F7B37A'], [1, '#FFE3B0']])); g.restore(); }
  const sx = lerp(1460, 960, fly), sy = lerp(240, 500, fly), srr = lerp(70, 360, E.i2(fly));
  sunDisc(g, sx, sy, srr, C.sun, { halo: .8, beat: beatHit(lt) });
  g.save(); g.translate(960, cy + fly * 900); g.rotate(ang);
  for (let q = 0; q < 4; q++) { g.fillStyle = seasonGround[q]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -PI / 2 + q * TAU / 4, -PI / 2 + (q + 1) * TAU / 4 + .002); g.closePath(); g.fill(); }
  for (let q = 0; q < 4; q++) planetProps(g, q, r, lt);
  ring(g, 0, 0, r + 30, 8, '#6B4636'); ring(g, 0, 0, r + 44, 4, '#8E7A9A');
  g.restore();
  // the train rides the rails round the top
  g.save(); g.translate(960, cy + fly * 900); g.rotate(-.18); g.translate(0, -(r + 40)); train(g, -4.2 * 2 * 60, 0, 60, 4); g.restore();
  drift(g, lt, 40, ['petal', 'spark', 'leaf', 'snow'][qi], { wind: -.6, size: 1.3, alpha: .8 });
};

/* ---------- 222–230 the promise, folded into a paper plane and let go ---------- */
function planeShape(g, s, fold) {
  // fold 0: flat strip; 1: a paper plane pointing right
  g.save(); g.scale(s, s);
  const w = lerp(1.6, 1.1, fold), h = lerp(.22, .5, fold);
  g.fillStyle = C.paper; g.beginPath(); g.moveTo(-w / 2, -h / 2 * (1 - fold)); g.lineTo(w / 2, -h / 2 * (1 - fold)); g.lineTo(w / 2, h / 2 * (1 - fold)); g.lineTo(-w / 2, h / 2 * (1 - fold) + h * fold); g.closePath(); g.fill();
  if (fold > 0) { g.fillStyle = shade(C.paper, -.12); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(-w / 2, h * fold * .5); g.lineTo(-w / 2 + .15 * fold, -h * fold * .5); g.closePath(); g.fill(); }
  g.restore();
}
SC.paperPlane = (g, lt, u) => {
  warmSun(g, lt);
  // her open hand holds the old strip of paper; she folds it
  const k = seg(lt, 0, .8, E.o5);
  hand(g, 960, lerp(1300, 900, k), 210, -PI / 2, LOOK.girl, { curl: .1, thumb: .05 });
  const fold = seg(lt, 1.4, 2.8, E.io3);
  g.save(); g.translate(960 + fold * 40, lerp(1100, 640, k) - fold * 60); g.rotate(-.1 * fold);
  planeShape(g, 300, fold);
  if (fold < .5) { g.globalAlpha = 1 - fold * 2; g.save(); g.filter = 'sepia(.5)'; ktext(g, '拉钩上吊 一百年不许变', 0, 0, 34, 9, { col: '#7A5A4A', medium: true }); g.restore(); }
  g.restore();
};
SC.planeFly = (g, lt, u) => {
  const tilt = seg(lt, .4, 4, E.io3);
  g.save(); g.translate(0, tilt * 600); warmSun(g, lt, 1 - tilt); g.restore();
  g.save(); g.globalAlpha = tilt; fill(g, vg(g, 0, H, [[0, '#7CC6F2'], [1, '#FFE9C8']])); g.restore();
  for (let i = 0; i < 5; i++) cloud(g, ((i * 520 + 100) % (W + 400)) - 200, 1100 - tilt * (700 + i * 80) + i * 60, 140 + i * 20, '#ffffff', { sa: .05 });
  // thrown: up and away on the wind
  const f = seg(lt, .3, 3.8, E.io2), x = lerp(1000, 1500, f) + Math.sin(f * 7) * 80, y = lerp(600, 180, f) + Math.sin(f * 5) * 40, s = lerp(320, 90, f);
  const hk = 1 - seg(lt, 0, .6, E.i3); if (hk > 0) hand(g, 900, lerp(1300, 900, hk), 210, -PI / 2 + (1 - hk) * .4, LOOK.girl, { curl: .1 });
  for (let j = 1; j <= 12; j++) { const ff = clamp(f - j * .02, 0, 1); circle(g, lerp(1000, 1500, ff) + Math.sin(ff * 7) * 80 - 10, lerp(600, 180, ff) + Math.sin(ff * 5) * 40 + 8, 5 * (1 - j / 12), rgba('#ffffff', .8 * (1 - j / 12))); }
  g.save(); g.translate(x, y); g.rotate(-.3 + Math.cos(f * 7) * .25); planeShape(g, s, 1); g.restore();
};

/* ---------- 230–269 outro: the plane circles a small world; two people on it, far apart ---------- */
SC.outroWorld = (g, lt, u, o) => {
  const zoom = lerp(1, .32, seg(lt, 0, 9, E.io3));
  fill(g, vg(g, 0, H, [[0, mix('#7CC6F2', C.night, seg(lt, 2, 9))], [1, mix('#FFE9C8', C.night2, seg(lt, 2, 9))]]));
  stars(g, lt, 300, H, seg(lt, 3, 9), 61);
  const cx = 960, cy = lerp(1500, 540, seg(lt, 0, 9, E.io3)), r = 760;
  // sun on one side, moon on the other
  sunDisc(g, cx + 700 * zoom * 2.4, cy - 260 * zoom * 2.4, 90 * zoom * 2, C.sun, { halo: 1 });
  moonDisc(g, cx - 760 * zoom * 2.4, cy - 200 * zoom * 2.4, 60 * zoom * 2, { halo: .6 });
  g.save(); g.translate(cx, cy); g.scale(zoom, zoom);
  circle(g, 0, 0, r + 60, rgba('#ffffff', .12)); circle(g, 0, 0, r + 30, rgba('#ffffff', .12));
  const ang = -lt * .12;
  g.save(); g.rotate(ang);
  // a crust of four seasons around a warm core
  for (let q = 0; q < 4; q++) { g.fillStyle = seasonGround[q]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -PI / 2 + q * TAU / 4, -PI / 2 + (q + 1) * TAU / 4 + .002); g.closePath(); g.fill(); }
  const core = g.createRadialGradient(-r * .3, -r * .3, 0, 0, 0, r); core.addColorStop(0, '#FFE3B0'); core.addColorStop(1, '#F29E7A');
  circle(g, 0, 0, r - 70, '#7A5A6E'); circle(g, 0, 0, r - 86, '#FFFFFF'); g.fillStyle = core; g.beginPath(); g.arc(0, 0, r - 86, 0, TAU); g.fill();
  for (let i = 1; i <= 3; i++) ring(g, 0, 0, (r - 86) * i / 4, 6, rgba('#ffffff', .25));
  for (let q = 0; q < 4; q++) planetProps(g, q, r, lt);
  // two small people on opposite sides of the world, both looking up
  for (const [a, L, wv] of [[.62, LOOK.girl, 0], [.62 + PI, LOOK.friend, 1.3]]) { g.save(); g.rotate(a); g.translate(0, -r + 2); const w = seg(lt, 9 + wv, 10 + wv, E.oBack) * (1 - seg(lt, 13 + wv, 14 + wv)); person(g, 0, 0, 320, w > 0 ? POSE.wave(w, lt) : POSE.look(), L, { t: lt }); g.restore(); }
  g.restore();
  // the paper plane goes round and round between them
  const pa = lt * .55 - 1.2, pr = r + 150 + Math.sin(lt * 1.3) * 30;
  for (let j = 1; j <= 24; j++) { const aa = pa - j * .025; circle(g, Math.cos(aa) * pr, Math.sin(aa) * pr, 6 * (1 - j / 24), rgba('#ffffff', .7 * (1 - j / 24))); }
  g.save(); g.translate(Math.cos(pa) * pr, Math.sin(pa) * pr); g.rotate(pa + PI / 2); planeShape(g, 110, 1); g.restore();
  g.restore();
  // titles
  if (lt > 13) {
    const out = 1 - seg(lt, 26, 27.5, E.io2);
    ktext(g, '四季之歌', 960, 900, 92, lt - 14, { medium: true, col: C.cream, spacing: 34, stagger: .16, dur: .9, ease: E.o5, rise: 40, from: .9, out, shadow: 'rgba(0,0,0,.35)', blur: 20 });
    ktext(g, '致 那个记不清名字的你', 960, 990, 34, lt - 16, { col: rgba(C.cream, .85), spacing: 8, stagger: .09, dur: .7, ease: E.o3, rise: 14, out });
  }
  // and the world shrinks back to the dot on the line it started from
  const end = seg(lt, 27, 32, E.io3);
  if (end > 0) { g.save(); g.globalAlpha = end; fill(g, C.night); stars(g, lt, 240, H, 1 - seg(lt, 32, 36), 1); const lw = (1 - seg(lt, 31, 34.5, E.ioExpo)) * (W / 2 + 20); line(g, 960 - lw, 540, 960 + lw, 540, 3, C.cream); circle(g, 960, 540, 11 * (1 - seg(lt, 35, 37)), C.cream); g.restore(); }
};
