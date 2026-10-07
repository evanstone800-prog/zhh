'use strict';
/* =========================================================
   Scenes 52–125 s: verse B (summer memories), verse A2, chorus 2
   ========================================================= */

/* ---------- 52–55 close your eyes: the eye shuts and its lid becomes the horizon ---------- */
function eyeAlmond(g, cx, cy, w, h, lid) {
  // lid: 0 open .. 1 closed; returns nothing, leaves the path set
  const top = cy - h * (1 - lid) + h * lid * .18;
  g.beginPath(); g.moveTo(cx - w / 2, cy);
  g.bezierCurveTo(cx - w * .28, top - h * .1, cx + w * .22, top - h * .12, cx + w / 2, cy - h * .05);
  g.bezierCurveTo(cx + w * .22, cy + h * .78, cx - w * .3, cy + h * .7, cx - w / 2, cy);
  g.closePath();
}
SC.eyeClose = (g, lt) => {
  const cx = 960, cy = 520, w = 900, h = 360;
  const zoom = lerp(3.6, 1, seg(lt, 0, 1.1, E.io3)), lid = seg(lt, 1.5, 2.25, E.io3), morph = seg(lt, 2.2, 3, E.io3);
  g.save(); g.translate(cx, cy); g.scale(zoom, zoom); g.translate(-cx, -cy);
  fill(g, C.skin);
  circle(g, cx + 420, cy + 300, 120, rgba(C.rose, .35));
  g.strokeStyle = C.hair; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 420, cy - 300 + lid * 20); g.quadraticCurveTo(cx - 40, cy - 420 + lid * 30, cx + 420, cy - 300 + lid * 24); g.stroke();
  g.fillStyle = C.hair; g.beginPath(); g.moveTo(-40, -40); g.lineTo(380, -40); g.bezierCurveTo(300, 200, 220, 500, 120, H + 40); g.lineTo(-40, H + 40); g.fill();
  if (lid < 1) {
    g.save(); eyeAlmond(g, cx, cy, w, h, lid); g.fillStyle = '#FFFDF8'; g.fill(); g.clip();
    const ix = cx + 20, iy = cy + 40;
    circle(g, ix, iy, 150, '#7A4E3A'); circle(g, ix, iy, 128, '#8E5E44'); ring(g, ix, iy, 110, 6, 'rgba(255,220,170,.25)');
    circle(g, ix, iy, 92, C.ink);
    circle(g, ix - 46, iy - 50, 30, '#ffffff'); circle(g, ix + 40, iy + 30, 12, rgba('#ffffff', .8));
    // the sky she remembers glints in the eye
    g.save(); g.globalAlpha = .25; g.fillStyle = vg(g, iy - 150, iy + 150, [[0, C.sky], [.5, '#ffffff'], [.51, C.sea], [1, C.seaD]]); g.beginPath(); g.arc(ix, iy, 150, 0, TAU); g.fill(); g.restore();
    g.fillStyle = 'rgba(120,80,60,.18)'; g.fillRect(cx - w, cy - h * 1.5, w * 2, h * .62 + (1 - lid) * 0); // lid shadow
    g.restore();
  }
  // lash line along the upper lid
  const top = cy - h * (1 - lid) + h * lid * .18;
  g.strokeStyle = C.hair; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - w / 2, cy); g.bezierCurveTo(cx - w * .28, top - h * .1, cx + w * .22, top - h * .12, cx + w / 2, cy - h * .05); g.stroke();
  for (let i = 0; i < 7; i++) { const f = .15 + i * .12, x = lerp(cx - w / 2, cx + w / 2, f), y = cy - (h * (1 - lid) * .95 - h * lid * .25) * Math.sin(f * PI) * .95; const a = -PI / 2 + (f - .5) * 1.2 + lid * PI; line(g, x, y, x + Math.cos(a) * 46, y + Math.sin(a) * 46, 9, C.hair); }
  g.restore();
  if (morph > 0) {
    // lid line -> horizon; skin -> summer sky and sea
    g.save(); g.globalAlpha = morph;
    fill(g, vg(g, 0, 540, [[0, '#62BEEC'], [1, '#E1F5FF']])); flatSea(g, 540, '#2F98D0', '#16609A', lt, { sunX: 1300, reflCol: '#ffffff', refl: .4, da: .3 });
    sunDisc(g, 1300, 300, 70, '#FFF8DE', { halo: 1 });
    g.restore();
    line(g, lerp(cx - w / 2, -20, morph), 540, lerp(cx + w / 2, W + 20, morph), 540, lerp(16, 3, morph), mix(C.hair, '#ffffff', morph));
  }
};

/* ---------- 55–58 where sea meets sky; the wind tastes of salt ---------- */
function summerSea(g, lt, pan = 0) {
  fill(g, vg(g, 0, 540, [[0, '#62BEEC'], [1, '#E1F5FF']]));
  sunDisc(g, 1300 - pan * .2, 300, 70, '#FFF8DE', { halo: 1, beat: beatHit(lt) });
  for (let i = 0; i < 4; i++) cloud(g, ((i * 600 + 200 - lt * 26 - pan * .4) % (W + 500) + W + 500) % (W + 500) - 250, 150 + (i % 2) * 90, 110 + i * 14, '#ffffff', { sa: .05 });
  flatSea(g, 540, '#2F98D0', '#16609A', lt, { sunX: 1300 - pan * .2, reflCol: '#ffffff', refl: .4, da: .3 });
}
SC.seaLine = (g, lt, u) => {
  const pan = lt * 40;
  summerSea(g, lt, pan);
  line(g, -20, 540, W + 20, 540, 3, rgba('#ffffff', .9));
  sailboat(g, 640 - pan * .6, 548, 70, C.coral, C.cream, Math.sin(lt * 1.6) * .04);
  for (let i = 0; i < 2; i++) gull(g, 300 + i * 120 + lt * 80, 300 + i * 30 + Math.sin(lt * 2 + i) * 10, 40, lt * 9 + i, '#ffffff');
  // gusts of salty wind
  for (let i = 0; i < 5; i++) swoosh(g, 100 + (i % 3) * 420, 680 + i * 50, 700, ((lt - .3 - i * .35) % 1.6) / 1.1, rgba('#ffffff', .75), 5);
  // salt: tiny crystals sparkle in the gust
  for (let i = 0; i < 26; i++) { const ph = (lt * .6 + R(i, 3)) % 1; sparkle(g, ((R(i, 4) * W + ph * 500) % W), 600 + R(i, 5) * 260 - ph * 60, 7 + R(i, 6) * 6, '#ffffff', Math.sin(ph * PI) * .9); }
};

/* ---------- 58–60 your hand in mine: flowers, humming, a boat ---------- */
function note(g, x, y, s, a, col = '#ffffff') {
  g.save(); g.globalAlpha *= a; g.fillStyle = g.strokeStyle = col; g.lineCap = 'round';
  g.beginPath(); g.ellipse(x, y, 10 * s, 7.5 * s, -.4, 0, TAU); g.fill();
  g.lineWidth = 3.4 * s; g.beginPath(); g.moveTo(x + 9 * s, y - 2 * s); g.lineTo(x + 9 * s, y - 38 * s); g.quadraticCurveTo(x + 20 * s, y - 28 * s, x + 22 * s, y - 16 * s); g.stroke();
  g.restore();
}
SC.kidsRun = (g, lt, u, o) => {
  const hy = 560;
  fill(g, vg(g, 0, hy, [[0, '#62BEEC'], [1, '#FFF1CF']]));
  sunDisc(g, 1460, 210, 74, '#FFF8DE', { halo: 1, beat: beatHit(lt) });
  burst(g, 1460, 210, 18, 1600, '#ffffff', .08, lt * .1);
  cloud(g, 360 + lt * 20, 170, 120); cloud(g, 900 + lt * 12, 110, 90);
  g.fillStyle = '#3FA6DA'; g.fillRect(0, hy - 60, W, 66); line(g, 0, hy - 60, W, hy - 60, 3, '#ffffff');
  sailboat(g, 420 + lt * 30, hy - 56, 46, C.gold, C.cream, Math.sin(lt * 2) * .05);
  paper(g, hillPath(hy, 18, .002, 1), '#A8D86E', { dy: -6, sa: .08 });
  paper(g, hillPath(hy + 80, 22, .003, 3), '#8ACB6A', { dy: -6, sa: .08 });
  for (let i = 0; i < 70; i++) { const x = R(i, 71) * W, y = 650 + R(i, 72) * 400; flower(g, x, y, 9 + (y - 650) / 40, 1, ['#ffffff', C.pink, C.gold][i % 3], C.gold, i); }
  const x = lerp(430, 900, u), y = 960, ph = lt * 10, sz = 400;
  const A = {}, B = {};
  const Pg = POSE.run(ph); Pg.a1 = 1.15 + Math.sin(ph) * .08; Pg.e1 = .1; Pg.lean = .2;
  const Pf = POSE.run(ph + 2.4); Pf.a1 = -1.15 + Math.sin(ph) * .08; Pf.e1 = -.1; Pf.lean = .22;
  person(g, x, y, sz, Pg, LOOK.girlKid, { t: lt, wind: 1, out: A, alpha: 0 });
  person(g, x + 200, y, sz * 1.03, Pf, LOOK.friendKid, { t: lt, out: B, alpha: 0 });
  person(g, x + 200, y, sz * 1.03, Pf, LOOK.friendKid, { t: lt });
  line(g, A.hand[0], A.hand[1], B.hand[0], B.hand[1], .05 * sz, C.coral);
  circle(g, (A.hand[0] + B.hand[0]) / 2, (A.hand[1] + B.hand[1]) / 2, .034 * sz, C.skin);
  person(g, x, y, sz, Pg, LOOK.girlKid, { t: lt, wind: 1 });
  // a picked flower in her other hand
  const fx = A.hand2[0], fy = A.hand2[1]; line(g, fx, fy, fx - 8, fy - 50, 4, C.leafD); flower(g, fx - 8, fy - 56, 16, 1, C.pink, C.gold, lt);
  for (let i = 0; i < 6; i++) { const p2 = (lt * .7 + i / 6) % 1, hx = i % 2 ? B.head[0] : A.head[0], hh = i % 2 ? B.head[1] : A.head[1]; note(g, hx + 30 + p2 * 90 + Math.sin(lt * 3 + i) * 10, hh - 60 - p2 * 160, 1.1 + R(i, 3) * .5, Math.sin(p2 * PI) * .95, i % 3 ? '#ffffff' : C.gold); }
  drift(g, lt, 30, 'petal', { wind: -.6, speed: 1.2, size: 1.3 });
};

/* ---------- 60–63 the picture comes back, still fresh: freeze into a polaroid ---------- */
function polaroid(g, x, y, w, rot, img, o = {}) {
  const h = w * 1.18, pw = w * .88;
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = 'rgba(30,20,10,.25)'; g.fillRect(-w / 2 + 10, -h / 2 + 16, w, h);
  g.fillStyle = '#FFFDF6'; g.fillRect(-w / 2, -h / 2, w, h);
  if (img) { g.save(); g.beginPath(); g.rect(-pw / 2, -h / 2 + w * .06, pw, pw); g.clip(); g.drawImage(img, o.sx ?? 240, o.sy ?? 0, o.sw ?? 1440, o.sh ?? 1080, -pw / 2 - pw * .17, -h / 2 + w * .06, pw * 1.34, pw); if (o.develop != null) { g.globalAlpha = 1 - o.develop; g.fillStyle = '#3B2F3F'; g.fillRect(-pw / 2, -h / 2, pw, pw * 1.2); } g.restore(); }
  if (o.caption) ktext(g, o.caption, 0, h / 2 - w * .14, w * .085, o.capT ?? 9, { col: '#4A3A50', stagger: .08 });
  if (o.pin) { circle(g, 0, -h / 2 + 18, 14, o.pin); circle(g, -4, -h / 2 + 14, 4, '#ffffff'); }
  g.restore();
}
function corkWall(g) {
  fill(g, '#E7D3B0');
  for (let i = 0; i < 300; i++) circle(g, R(i, 81) * W, R(i, 82) * H, 2 + R(i, 83) * 4, rgba(i % 2 ? '#C9AE82' : '#F4E6CC', .7));
}
SC.photo = (g, lt, u) => {
  const fr = buf('photoSrc'); SC.kidsRun(fr.getContext('2d'), 1.95, 1, {});
  const k = seg(lt, .15, 1.1, E.io3);
  corkWall(g);
  // other memories already pinned
  const ka = seg(lt, .8, 1.6, E.o3);
  if (ka > 0) { g.save(); g.globalAlpha = ka; polaroid(g, 360, 440, 300, -.12, null, { pin: C.sky }); polaroid(g, 1560, 470, 300, .1, null, { pin: C.coral }); g.restore(); }
  if (ka > 0) for (const [px, py, rot, c] of [[360, 440, -.12, C.sand], [1560, 470, .1, C.pink]]) { g.save(); g.globalAlpha = ka; g.translate(px, py); g.rotate(rot); g.fillStyle = c; g.fillRect(-132, -160, 264, 264); g.restore(); }
  const w = lerp(W * 1.16, 620, k), x = 960, y = lerp(540 + 20, 500, k), rot = lerp(0, -.04, k);
  polaroid(g, x, y, w, rot, fr, { develop: 1, caption: k > .95 ? '那年夏天' : null, capT: lt - 1.3, pin: k > .9 ? C.gold : null });
  // camera flash on the freeze
  const fl = Math.exp(-lt * 8); if (fl > .01) { g.save(); g.globalAlpha = fl * .9; fill(g, '#ffffff'); g.restore(); }
};

/* ---------- 63–66 months turn, the moon waxes and wanes ---------- */
function calPage(g, big, sub, col) {
  g.fillStyle = '#FFFDF6'; rr(g, -230, -290, 460, 560, 14); g.fill();
  g.fillStyle = col; rr(g, -230, -290, 460, 110, [14, 14, 0, 0]); g.fill();
  g.fillStyle = '#ffffff'; g.font = `40px ${FONTM}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sub, 0, -235);
  g.fillStyle = C.ink; g.font = `150px ${FONTM}`; g.fillText(big, 0, 30);
  g.fillStyle = rgba(C.ink, .25); for (let i = 0; i < 7; i++) circle(g, -180 + i * 60, 200, 6, rgba(C.ink, .25));
}
SC.calendar = (g, lt, u) => {
  corkWall(g);
  const pan = lerp(0, -40, u);
  g.save(); g.translate(pan, 0);
  const flip = seg(lt, .9, 1.6, E.io3);
  g.save(); g.translate(700, 470); g.rotate(-.03);
  g.fillStyle = 'rgba(30,20,10,.25)'; rr(g, -220, -270, 460, 560, 14); g.fill();
  calPage(g, '文月', '七月 · 7', C.sky);
  if (flip < 1) { g.save(); g.translate(0, -290); g.scale(1, Math.max(.001, 1 - flip)); g.translate(0, 290); calPage(g, '叶月', '八月 · 8', C.orange); g.fillStyle = `rgba(0,0,0,${flip * .3})`; g.fillRect(-230, -290, 460, 560); g.restore(); }
  else { g.save(); g.translate(0, -290); g.scale(1, -Math.min(.25, (flip - 1) + .25)); g.restore(); }
  for (const dx of [-120, 120]) { circle(g, dx, -296, 16, '#8A8A96'); circle(g, dx, -296, 7, '#4A4A56'); }
  g.restore();
  // the moon goes round its phases
  for (let i = 0; i < 8; i++) {
    const p = seg(lt, .3 + i * .16, .7 + i * .16, E.oBack2); if (p <= 0) continue;
    const mx = 1100 + (i % 4) * 170, my = 330 + Math.floor(i / 4) * 230, r = 62 * p;
    circle(g, mx, my, r + 10, rgba(C.night, .9)); circle(g, mx, my, r, '#FFF1C9');
    const ph = i / 8; g.save(); g.beginPath(); g.arc(mx, my, r, 0, TAU); g.clip(); circle(g, mx + (ph < .5 ? -1 : 1) * lerp(0, 2 * r, ph < .5 ? 1 - ph * 2 : (ph - .5) * 2), my, r * 1.02, C.night); g.restore();
  }
  g.restore();
};

/* ---------- 66–68 how to go back: the rewind stalls ---------- */
SC.rewind = (g, lt, u) => {
  corkWall(g);
  g.save(); g.globalAlpha = seg(lt, 0, .5) * .85; fill(g, vg(g, 0, H, [[0, C.night2], [1, '#4A2E5E']])); g.restore();
  const spin = -(lt * 6 - seg(lt, .9, 1.9, E.o3) * 4) , stall = seg(lt, .9, 1.9, E.o3);
  const cx = 960, cy = 470, r = 240;
  // pages and photos fly backwards round the arrow
  for (let i = 0; i < 10; i++) { const a = spin * .7 + i / 10 * TAU, d = r + 140 + Math.sin(lt * 3 + i) * 20; g.save(); g.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7); g.rotate(a); g.globalAlpha = .9 - stall * .5; g.fillStyle = i % 3 ? '#FFFDF6' : [C.sky, C.orange, C.pink][i % 3]; g.fillRect(-46, -56, 92, 112); g.restore(); }
  g.strokeStyle = C.cream; g.lineWidth = 34; g.lineCap = 'round';
  g.beginPath(); g.arc(cx, cy, r, spin, spin + TAU * .8); g.stroke();
  const ea = spin; g.fillStyle = C.cream; g.beginPath(); g.moveTo(cx + Math.cos(ea) * (r - 50), cy + Math.sin(ea) * (r - 50)); g.lineTo(cx + Math.cos(ea) * (r + 50), cy + Math.sin(ea) * (r + 50)); g.lineTo(cx + Math.cos(ea + .35) * r, cy + Math.sin(ea + .35) * r); g.fill();
  // two triangles: rewind
  g.fillStyle = C.coral; for (const dx of [-60, 30]) { g.beginPath(); g.moveTo(cx + dx + 70, cy - 70); g.lineTo(cx + dx, cy); g.lineTo(cx + dx + 70, cy + 70); g.fill(); }
  // it cracks and stops
  if (stall > .6) { const c = seg(lt, 1.4, 1.8, E.o3); g.strokeStyle = C.night; g.lineWidth = 8; g.beginPath(); g.moveTo(cx + 20, cy - r - 30); g.lineTo(cx - 10, cy - r + 30 * c); g.lineTo(cx + 26, cy - r + 70 * c); g.stroke(); }
};

/* ---------- 68–71 only my shadow for company ---------- */
SC.shadowWalk = (g, lt, u) => {
  const hy = 640, pan = lt * 120;
  fill(g, vg(g, 0, hy, [[0, '#6E4E8F'], [.6, '#E6826A'], [1, '#FFC27A']]));
  sunDisc(g, 1560, 520, 90, '#FFE1A0', { halo: 1 });
  // flat town skyline
  for (let i = 0; i < 16; i++) { const x = ((i * 170 - pan * .3) % (W + 340) + W + 340) % (W + 340) - 170, h = 120 + R(i, 91) * 220, w = 110 + R(i, 92) * 60; g.fillStyle = mix('#5B3F7E', '#7A4F86', R(i, 93)); g.fillRect(x, hy - h, w, h); for (let k = 0; k < 6; k++) if (R(i * 7 + k, 94) < .4) { g.fillStyle = rgba(C.sun, .8); g.fillRect(x + 16 + (k % 3) * 32, hy - h + 24 + Math.floor(k / 3) * 46, 16, 22); } }
  g.fillStyle = '#C7826E'; g.fillRect(0, hy, W, H - hy);
  g.fillStyle = '#B4705E'; g.fillRect(0, hy, W, 16);
  for (let i = 0; i < 6; i++) { const x = ((i * 420 - pan) % (W + 420) + W + 420) % (W + 420) - 210; line(g, x, hy + 10, x, 300, 10, '#3E2B4D'); line(g, x, 300, x + 60, 300, 10, '#3E2B4D'); glow(g, x + 60, 316, 80, C.sun, .5); circle(g, x + 60, 314, 14, '#FFF1C9'); }
  // she walks; the sun throws her shadow long across the pavement
  const P = POSE.walk(lt * 6.5), x = 760, y = 860;
  shadowCast(g, x, y, 340, P, LOOK.girl, lt, -1.6, .55);
  person(g, x, y, 340, P, LOOK.girl, { t: lt, wind: .4 });
};
// lay a figure's shadow on the ground; k skews it away from the light
const _shc = mk(700, 700);
function shadowCast(g, x, y, s, P, L, t, k, sy, col = '#5B3355', a = .5) {
  const c = _shc.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 700, 700);
  person(c, 350, 680, s, P, L, { t, sil: col });
  g.save(); g.translate(x, y); g.transform(1, 0, k, -sy, 0, 0); g.globalAlpha = a; g.drawImage(_shc, -350, -680); g.restore();
}

/* ---------- 71–73 setting out to find you: a route across the map ---------- */
const ROUTE = [[330, 760], [520, 600], [760, 650], [930, 470], [1180, 520], [1360, 360], [1580, 300]];
function routePt(f) { const n = ROUTE.length - 1, i = Math.min(n - 1, Math.floor(f * n)), k = f * n - i; return [lerp(ROUTE[i][0], ROUTE[i + 1][0], k), lerp(ROUTE[i][1], ROUTE[i + 1][1], k)]; }
function mapBase(g, night) {
  fill(g, mix('#8FD3EC', C.night, night));
  const land = mix('#F6E7C1', '#25306A', night), land2 = mix('#CDE7B0', '#2E3A78', night);
  paper(g, g2 => { g2.beginPath(); g2.moveTo(140, 980); g2.bezierCurveTo(60, 700, 300, 480, 600, 520); g2.bezierCurveTo(900, 560, 900, 300, 1200, 260); g2.bezierCurveTo(1500, 220, 1800, 160, 1840, 420); g2.bezierCurveTo(1880, 700, 1500, 760, 1200, 820); g2.bezierCurveTo(900, 880, 700, 1040, 140, 980); g2.fill(); }, land, { dy: 14, sa: .12 * (1 - night) });
  for (const [x, y, r] of [[600, 760, 120], [1300, 520, 160], [1600, 380, 90]]) { g.fillStyle = land2; g.beginPath(); g.ellipse(x, y, r * 1.4, r, .3, 0, TAU); g.fill(); }
  g.strokeStyle = rgba(night ? '#ffffff' : '#4FA0C8', .25); g.lineWidth = 2; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 120 + i * 120); g.lineTo(W, 120 + i * 120); g.stroke(); g.beginPath(); g.moveTo(120 + i * 240, 0); g.lineTo(120 + i * 240, H); g.stroke(); }
}
SC.mapTrip = (g, lt, u) => {
  mapBase(g, 0);
  const f = seg(lt, .1, 1.9, E.io2);
  g.strokeStyle = C.coral; g.lineWidth = 8; g.setLineDash([2, 22]); g.lineCap = 'round'; g.beginPath();
  for (let i = 0; i <= 80; i++) { const ff = i / 80 * f, [x, y] = routePt(ff); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
  ROUTE.forEach(([x, y], i) => { const p = seg(f, i / (ROUTE.length - 1) - .05, i / (ROUTE.length - 1) + .08, E.oBack2); if (p <= 0) return; const last = i === ROUTE.length - 1; g.save(); g.translate(x, y - 50 * p); g.scale(p, p); g.fillStyle = last ? C.gold : C.coral; g.beginPath(); g.arc(0, -24, 26, PI * .8, PI * 2.2); g.lineTo(0, 24); g.closePath(); g.fill(); circle(g, 0, -24, 10, '#ffffff'); if (last) { g.fillStyle = C.ink; g.font = `30px ${FONTM}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 0, -24); } g.restore(); });
  const [hx, hy] = routePt(f); circle(g, hx, hy, 18, C.ink); circle(g, hx, hy, 9, '#ffffff');
};
/* ---------- 73–78 memory right before my eyes, like summer stars ---------- */
const CONST = [[700, 380], [740, 470], [700, 560], [680, 660], [760, 660], [650, 480], [820, 430], [900, 440], [980, 430], [1060, 470], [1020, 560], [1000, 660], [1080, 660], [1120, 520]];
const CLINKS = [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5], [1, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [10, 12], [9, 13]];
SC.constellation = (g, lt, u) => {
  const night = seg(lt, 0, 1, E.io3);
  mapBase(g, night);
  if (night < 1) { g.save(); g.globalAlpha = 1 - night; SC.mapTrip(g, 2, 1, {}); g.restore(); }
  stars(g, lt, 260, H, night, 12);
  // two kids holding hands, drawn in stars
  const pts = CONST.map(([x, y]) => [x + 60, y - 40]);
  const head = [[700 + 60, 300], [1060 + 60, 390]];
  CLINKS.forEach(([a, b], i) => { const p = seg(lt, 1 + i * .12, 1.4 + i * .12, E.io2); if (p <= 0) return; const [x0, y0] = pts[a], [x1, y1] = pts[b]; line(g, x0, y0, lerp(x0, x1, p), lerp(y0, y1, p), 3, rgba('#CFE0FF', .7)); });
  head.forEach(([x, y], i) => { const p = seg(lt, 2.2 + i * .3, 2.8 + i * .3, E.io2); if (p > 0) ring(g, x, y, 44 * p, 3, rgba('#CFE0FF', .7)); });
  [...pts, ...head].forEach(([x, y], i) => { const p = seg(lt, .8 + i * .07, 1.2 + i * .07, E.oBack2), tw = .75 + .25 * Math.sin(lt * 3 + i); if (p > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, 34 * p, '#BFD4FF', .6 * tw); g.restore(); sparkle(g, x, y, 14 * p * tw, '#ffffff'); } });
  // a cap of stars over the friend's head
  const cp = seg(lt, 3, 3.6, E.io2); if (cp > 0) { g.strokeStyle = rgba(C.gold, .8 * cp); g.lineWidth = 4; g.beginPath(); g.arc(1120, 380, 46, PI * 1.05, PI * 1.95); g.lineTo(1190, 372); g.stroke(); }
};
/* ---------- 78–83 shoulder to shoulder with the gulls, flying to you ---------- */
SC.gullFlight = (g, lt, u) => {
  const tilt = 1 - seg(lt, 0, 1.2, E.io3), dawn = seg(lt, .2, 2, E.io2);
  fill(g, mix('#121733', '#5A4E8E', dawn));
  g.save(); g.translate(0, -tilt * 700);
  fill(g, vg(g, -700, H, [[0, C.night], [.45, mix(C.night2, '#7C6FB8', dawn)], [.8, mix(C.night3, '#F7A88A', dawn)], [1, mix(C.night3, '#FFE0A6', dawn)]]));
  stars(g, lt, 200, 0, 1 - dawn, 12);
  const sunGrow = seg(lt, 3.6, 5, E.i3), sy = lerp(640, 560, dawn), sr = lerp(70, 520, sunGrow);
  sunDisc(g, 960, sy, sr, '#FFF2C8', { halo: dawn });
  flatSea(g, 640, mix('#28306A', '#E7A08E', dawn), mix('#121733', '#5A4E8E', dawn), lt, { sunX: 960, refl: .6 * dawn, reflCol: '#FFE2A8', da: .15 });
  line(g, 0, 640, W, 640, 3, rgba(C.cream, .8));
  g.restore();
  for (let i = 0; i < 4; i++) cloud(g, ((i * 520 - lt * 260) % (W + 600) + W + 600) % (W + 600) - 300, 820 + (i % 2) * 120, 160, '#FFF6EE', { sa: .05 });
  // two gulls side by side, banking toward the sun
  const k = seg(lt, .3, 4.6, E.io2);
  for (let i = 0; i < 2; i++) {
    const s = lerp(150, 40, k) * (i ? .95 : 1), x = lerp(520 + i * 260, 920 + i * 70, k) + Math.sin(lt * 1.3 + i) * 20, y = lerp(470 + i * 70, 560, k) + Math.sin(lt * 2.2 + i) * 16;
    gull(g, x, y, s, lt * 7 + i * .8, '#ffffff', {});
  }
  if (sunGrow > 0) { g.save(); g.globalAlpha = sunGrow ** 2; fill(g, '#FFF2C8'); g.restore(); }
};

/* ---------- 83–87 dawn platform: a train comes between us ---------- */
function train(g, x, y, s, cars = 5) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < cars; i++) {
    const cx = i * 4.2;
    g.fillStyle = 'rgba(0,0,0,.18)'; rr(g, cx + .08, -1.4 + .12, 4, 1.5, .3); g.fill();
    g.fillStyle = '#F4F1EA'; rr(g, cx, -1.5, 4, 1.5, i === 0 ? [.9, .2, .2, .3] : .2); g.fill();
    g.fillStyle = C.coral; g.fillRect(cx + (i === 0 ? .3 : 0), -.42, 4 - (i === 0 ? .3 : 0), .16);
    g.fillStyle = '#2B3A67'; for (let w = 0; w < 4; w++) { rr(g, cx + .35 + w * .92, -1.2, .6, .5, .08); g.fill(); }
    g.fillStyle = rgba(C.sun, .5); for (let w = 0; w < 4; w++) g.fillRect(cx + .38 + w * .92, -1.17, .2, .44);
    for (const wx of [.6, 3.4]) { circle(g, cx + wx, 0, .22, '#3B3B4A'); circle(g, cx + wx, 0, .08, '#9A9AA8'); }
  }
  g.restore();
}
function platform(g, lt, k) {
  dawnSky(g, k, 560);
  sunDisc(g, 1400, lerp(640, 360, k), 80, '#FFF2C8', { halo: k });
  stars(g, lt, 120, 500, 1 - k, 2);
  g.fillStyle = mix('#2A2558', '#8E5A86', k); g.fillRect(0, 560, W, 120);
  g.fillStyle = '#5D4A6E'; g.fillRect(0, 680, W, 40); // rails
  line(g, 0, 700, W, 700, 6, '#8E7A9A'); line(g, 0, 716, W, 716, 6, '#8E7A9A');
  g.fillStyle = mix('#3E3363', '#B48A92', k); g.fillRect(0, 730, W, H - 730);
  g.fillStyle = C.cream; g.fillRect(0, 730, W, 14);
  // station sign and lamp
  line(g, 300, 730, 300, 420, 10, '#3E2B4D'); g.fillStyle = '#ffffff'; rr(g, 200, 400, 200, 70, 8); g.fill(); g.fillStyle = C.teal; rr(g, 200, 400, 200, 16, [8, 8, 0, 0]); g.fill();
  g.fillStyle = C.ink; g.font = `34px ${FONTM}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('四季站', 300, 444);
}
SC.trainBye = (g, lt, u) => {
  const k = seg(lt, 0, 3, E.io2);
  platform(g, lt, k);
  // the friend steps onto the train at the far side; the train pulls through between us
  const tx = lerp(W + 100, -4.2 * 5 * 120 - 200, seg(lt, 1.2, 3.9, E.io3));
  const gone = lt > 2.3;
  const wv = seg(lt, .2, .6, E.oBack) * (1 - seg(lt, 3.4, 3.9)), osc = Math.sin(lt * 8);
  if (!gone) personFront(g, 1350, 690, 380, LOOK.friend, { armR: lerp(.15, 2.6 + osc * .25, wv), armL: .15, t: lt, smile: true });
  train(g, tx, 690, 120, 5);
  personFront(g, 620, 980, 420, LOOK.girl, { armL: lerp(.15, 2.6 - osc * .25, wv), armR: .15, t: lt, smile: lt < 2.2 });
};
/* ---------- 87–91 a hug made of light ---------- */
let _ghostPts = null;
function ghostPts() {
  // sample the friend's outline once into a list of points
  if (_ghostPts) return _ghostPts;
  const c = buf('ghostHug', 600, 700), cx = c.getContext('2d'); personFront(cx, 300, 690, 420, LOOK.friend, { sil: '#ffffff', armL: 1.3, armR: 1.3 });
  const d = cx.getImageData(0, 0, 600, 700).data, pts = [];
  const inside = (x, y) => x >= 0 && y >= 0 && x < 600 && y < 700 && d[(y * 600 + x) * 4 + 3] > 128;
  for (let y = 0; y < 700; y += 7) for (let x = 0; x < 600; x += 7) if (inside(x, y) && (!inside(x - 7, y) || !inside(x + 7, y) || !inside(x, y - 7) || !inside(x, y + 7) || R(x, y) < .12)) pts.push([x, y]);
  return (_ghostPts = pts);
}
SC.airHug = (g, lt, u) => {
  platform(g, lt + 4, 1);
  const open = seg(lt, .2, 1.2, E.io3), close = seg(lt, 2, 2.8, E.io3), z = lerp(1, 1.12, E.io2(u));
  g.save(); g.translate(960, 900); g.scale(z, z); g.translate(-960, -900);
  // the remembered friend, as a dashed outline that comes apart
  const ga = seg(lt, .9, 1.6) * (1 - seg(lt, 2.4, 3.6));
  if (ga > 0) { const pts = ghostPts(); const fade = seg(lt, 2.4, 3.6, E.io2); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < pts.length; i++) { const [px, py] = pts[i], d = fade * (60 + R(i, 7) * 260), tw = .6 + .4 * Math.sin(lt * 4 + i); glow(g, 1000 - 300 + px + d * (R(i, 8) - .5), 980 - 690 + py - d, 9, '#FFF1D6', ga * tw * (1 - fade * .5)); } g.restore(); }
  personFront(g, 960, 980, 440, LOOK.girl, { armL: lerp(.15, 1.9, open) - close * .9, armR: lerp(.15, 1.9, open) - close * .9, bend: lerp(.15, -.9, close), t: lt });
  if (lt > 2.2) for (let i = 0; i < 40; i++) { const f = clamp((lt - 2.2 - R(i, 1) * .6) / 1.4, 0, 1); if (f <= 0 || f >= 1) continue; circle(g, 1000 + (R(i, 2) - .5) * 260 + f * 200 * (R(i, 3) - .3), 640 + R(i, 4) * 320 - f * 300, 5 * (1 - f) + 2, rgba('#ffffff', .8 * (1 - f))); }
  g.restore();
};
/* ---------- 97–101 the promise, years later ---------- */
SC.promise2 = (g, lt, u) => {
  warmSun(g, lt);
  // the paper has yellowed; her grown-up hand holds out a little finger to no one
  const k = seg(lt, 0, 1, E.o5);
  pinkyFist(g, lerp(-500, 760, k), 520, 170, LOOK.girl, { hook: .35 });
  const gh = seg(lt, 1, 1.6) * (1 - seg(lt, 2.6, 3.4));
  if (gh > 0) { g.save(); g.globalAlpha = gh * .4; pinkyFist(g, 1084, 676, 150, LOOK.friendKid, { dir: -1, vflip: true }); g.restore(); }
  const bw = seg(lt, .6, 1.3, E.o5) * 820;
  g.save(); g.filter = 'sepia(.6)'; banner(g, lt, bw, '', { flutter: seg(lt, 3.2, 4, E.io2) }); g.restore();
  if (lt > .9) ktext(g, '拉钩上吊 一百年不许变', 960, 842, 58, lt - .95, { medium: true, col: '#7A5A4A', stagger: .05, dur: .45, ease: E.o3 });
};

/* ---------- 104–125 chorus 2: one long tracking shot through the year ---------- */
// world x ranges for each stretch of the walk
const STRIP = { bloom: 0, tree: 1700, grass: 3600, beach: 5200, peak: 7400, table: 8900, snow: 10700, clock: 12300, end: 13900 };
const CAMK = [[0, 0], [1, 700], [5, 2350], [7, 4100], [10, 6050], [12, 7700], [16, 9450], [18, 11150], [21, 12750]];
function camAt(lt) {
  const k = CAMK; if (lt <= k[0][0]) return k[0][1]; if (lt >= k[k.length - 1][0]) return k[k.length - 1][1];
  let i = 0; while (k[i + 1][0] < lt) i++;
  const [t0, x0] = k[i], [t1, x1] = k[i + 1], f = (lt - t0) / (t1 - t0);
  // gentle ease inside each leg, but keep moving
  return lerp(x0, x1, f * .6 + E.sine(f) * .4);
}
const STRIP_SKY = [[0, '#A9D9F3', '#FCE3EA'], [3600, '#62BDEA', '#D6F0FB'], [5200, '#4FB3E8', '#CDEFFC'], [7000, '#F59A72', '#FFD49A'], [7700, C.night, '#5B3F7E'], [9300, '#2A2350', '#6E3F5E'], [10400, '#A9BEDD', '#EEF3FA'], [12100, '#7C88B8', '#E6C9B8'], [13900, '#5B5F9A', '#F2B49A']];
function stripSky(wx) { const s = STRIP_SKY; let i = 0; while (i + 1 < s.length && s[i + 1][0] <= wx) i++; if (i + 1 >= s.length) return [s[i][1], s[i][2]]; const f = E.io2(clamp((wx - s[i][0]) / (s[i + 1][0] - s[i][0]) * 1.6 - .3, 0, 1)); return [mix(s[i][1], s[i + 1][1], f), mix(s[i][2], s[i + 1][2], f)]; }
function groundCol(wx) { const s = [[0, '#9AD6A0'], [3600, '#7CC46A'], [5000, C.sand], [7300, '#4B3970'], [8800, '#6B4A4A'], [10500, '#F4F7FC'], [13900, '#E6E9F2']]; let i = 0; while (i + 1 < s.length && s[i + 1][0] <= wx) i++; if (i + 1 >= s.length) return s[i][1]; return mix(s[i][1], s[i + 1][1], E.io2(clamp((wx - s[i + 1][0] + 300) / 300, 0, 1))); }
SC.chorusTrack = (g, lt, u, o) => {
  const cam = camAt(lt), mid = cam + 960, gy = 860;
  const [s0, s1] = stripSky(mid);
  fill(g, vg(g, 0, gy, [[0, s0], [1, s1]]));
  const night = clamp(1 - Math.abs(mid - 8300) / 1100, 0, 1);
  stars(g, lt, 200, 700, night, 21);
  // sun / moon ride along in the sky
  if (mid < 7400) sunDisc(g, 1480 - (mid > 6500 ? (mid - 6500) * .5 : 0), 220 + Math.max(0, mid - 6500) * .45, 80, '#FFF6DA', { halo: 1, beat: beatHit(lt) });
  if (night > .05) { g.save(); g.globalAlpha = night; moonDisc(g, 1200, lerp(420, 260, night), 140); g.restore(); }
  if (mid > 10300) sunDisc(g, 1450, 250, 70, '#FFF6E0', { halo: .6 });
  // far layer (parallax .3)
  const far = cam * .3;
  for (let i = 0; i < 4; i++) { const idx = Math.floor(far / 900) + i, x = idx * 900 - far - 300; const c = night > .3 ? mix('#3E2F66', '#2A2350', night) : mix(groundCol(cam + x + 450), '#ffffff', .4); paper(g, g2 => { g2.beginPath(); g2.ellipse(x + 450, gy + 10, 620, 150 + R(idx, 5) * 110, 0, PI, TAU); }, c, { sa: 0 }); }
  // mid layer (parallax .6): clouds and distant things
  const md = cam * .6;
  for (let i = 0; i < 6; i++) { const idx = Math.floor(md / 700) + i, x = idx * 700 - md - 200; if (night < .5 && mid < 10300) cloud(g, x, 180 + R(idx, 9) * 140, 100 + R(idx, 8) * 50, '#ffffff', { sa: .04 }); }
  // the ground, coloured by where we are
  { const gr = g.createLinearGradient(0, 0, W, 0); for (let i = 0; i <= 16; i++) gr.addColorStop(i / 16, groundCol(cam + i * W / 16)); g.fillStyle = gr; g.fillRect(0, gy, W, H - gy); }
  g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, gy, W, 12);
  const at = (wx, f) => { const x = wx - cam; if (x > -700 && x < W + 700) { g.save(); g.translate(x, gy); f(); g.restore(); } };
  // spring: flowers bloom as she passes
  for (let i = 0; i < 18; i++) { const wx = 200 + i * 90 + R(i, 3) * 40; at(wx, () => { const p = clamp((cam + 1100 - wx) / 260, 0, 1); line(g, 0, 0, 0, -60 - R(i, 4) * 60, 5, C.leafD); flower(g, 0, -64 - R(i, 4) * 60, 30 * E.oBack(p), p, [C.pink, '#ffffff', C.rose][i % 3], C.gold, lt * .3 + i); }); }
  at(STRIP.tree + 400, () => { tree(g, 0, 0, 560, C.pink, '#8A5A48', { t: lt, dots: '#ffffff' }); person(g, 120, -4, 300, POSE.stand(), LOOK.girlKid, { rot: -PI / 2, eyesClosed: true, alpha: .45 }); for (let i = 0; i < 3; i++) { const ph = (lt * .5 + i / 3) % 1; ktext(g, 'z', -40 + ph * 70, -150 - ph * 140, 40, 1, { col: rgba('#6E4E8F', Math.sin(ph * PI) * .7), dur: .01 }); } });
  // grass and a kite
  for (let i = 0; i < 60; i++) { const wx = STRIP.grass - 200 + i * 30; at(wx, () => { const w = Math.sin(wx * .01 - lt * 4) * 18 + 8, h = 60 + R(i, 7) * 50; g.strokeStyle = i % 3 ? '#5FAE55' : '#4E9A49'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(w * .3, -h * .6, w, -h); g.stroke(); }); }
  at(STRIP.grass + 900, () => { const kx = Math.sin(lt * 1.4) * 40, ky = -620 + Math.sin(lt * 2) * 30; g.strokeStyle = rgba(C.ink, .5); g.lineWidth = 2; g.beginPath(); g.moveTo(-300, -10); g.quadraticCurveTo(-100, -200, kx, ky + 60); g.stroke(); g.save(); g.translate(kx, ky); g.rotate(Math.sin(lt * 2) * .15); g.fillStyle = C.coral; g.beginPath(); g.moveTo(0, -60); g.lineTo(44, 0); g.lineTo(0, 60); g.lineTo(-44, 0); g.fill(); g.fillStyle = C.gold; g.beginPath(); g.moveTo(0, -60); g.lineTo(44, 0); g.lineTo(0, 0); g.fill(); g.restore(); });
  // beach: sea band behind, the cap on the sand, a sandcastle
  at(STRIP.beach + 1100, () => { g.fillStyle = '#3BA7DD'; rr(g, -1250, -200, 2150, 200, [0, 120, 0, 0]); g.fill(); line(g, -1250, -200, 780, -200, 3, '#ffffff'); for (let i = 0; i < 10; i++) { g.fillStyle = 'rgba(255,255,255,.35)'; rr(g, -1200 + i * 250 + Math.sin(lt * 2 + i) * 20, -150 + (i % 3) * 40, 120, 5, 3); g.fill(); } g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(-180, -2, 1070, 10 + Math.sin(lt * 2) * 4, 0, PI, TAU); g.fill(); });
  at(STRIP.beach + 1400, () => { g.fillStyle = C.gold; g.beginPath(); g.ellipse(60, 14, 70, 16, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, 0, 72, 58, 0, PI, TAU); g.fill(); });
  at(STRIP.beach + 700, () => { g.fillStyle = C.sandD; rr(g, -100, -60, 200, 60, 6); g.fill(); rr(g, -60, -110, 120, 50, 6); g.fill(); for (const [fx, c] of [[-80, C.coral], [80, C.gold]]) { line(g, fx, -100, fx, -170, 4, C.ink); g.fillStyle = c; g.beginPath(); g.moveTo(fx, -170); g.lineTo(fx + 40, -158); g.lineTo(fx, -146); g.fill(); } });
  // peak with the moon
  at(STRIP.peak + 900, () => { paper(g, g2 => { g2.beginPath(); g2.moveTo(-900, 0); g2.lineTo(-300, -380); g2.lineTo(-180, -420); g2.lineTo(500, 0); g2.fill(); }, '#2E2453', { dy: -10 }); });
  // a table set for two, one chair empty, under a lantern
  at(STRIP.table + 900, () => {
    line(g, 0, -800, 0, -520, 3, '#2A2030'); glow(g, 0, -470, 240, C.orange, .5); g.save(); g.translate(0, -470); g.rotate(Math.sin(lt * 1.6) * .06); g.fillStyle = '#E8432F'; g.beginPath(); g.ellipse(0, 0, 44, 54, 0, 0, TAU); g.fill(); g.fillStyle = C.gold; g.fillRect(-28, -60, 56, 10); g.fillRect(-28, 50, 56, 10); g.restore();
    g.fillStyle = '#8A5A3C'; rr(g, -230, -230, 460, 24, 8); g.fill(); g.fillRect(-14, -210, 28, 210);
    for (const [cx, c] of [[-160, '#F4ECE0'], [160, '#F4ECE0']]) { circle(g, cx, -244, 18, c); }
    circle(g, 0, -248, 30, '#D99A4E');
    for (const d of [-1, 1]) { g.fillStyle = '#6B4636'; g.fillRect(d * 300 - 50, -150, 100, 18); g.fillRect(d * 300 + d * 40 - 6, -330, 12, 330); g.fillRect(d * 300 - 46, -132, 10, 132); g.fillRect(d * 300 + 36, -132, 10, 132); }
    g.save(); g.translate(300, -150); mapleLeaf(g, 0, -6, 46, C.maple); g.restore();
  });
  // snow: pines and a snowman in a yellow cap
  for (let i = 0; i < 6; i++) at(STRIP.snow + 100 + i * 280, () => pine(g, 0, 0, 220 + (i % 2) * 60, true));
  at(STRIP.snow + 1200, () => { circle(g, 0, -60, 64, '#fff'); circle(g, 0, -150, 46, '#fff'); circle(g, 12, -158, 5, C.ink); g.fillStyle = C.gold; g.beginPath(); g.ellipse(0, -192, 40, 34, 0, PI, TAU); g.fill(); g.beginPath(); g.ellipse(26, -190, 30, 8, 0, 0, TAU); g.fill(); });
  // the town clock at the end of the year
  at(STRIP.clock + 900, () => { g.fillStyle = '#7A5A7A'; g.fillRect(-120, -720, 240, 720); g.beginPath(); g.moveTo(-150, -720); g.lineTo(0, -880); g.lineTo(150, -720); g.fill(); circle(g, 0, -580, 92, '#FFF6E0'); ring(g, 0, -580, 92, 10, '#4A3A5A'); const ma = lt * 6, ha = lt * .5; line(g, 0, -580, Math.sin(ma) * 70, -580 - Math.cos(ma) * 70, 8, C.ink); line(g, 0, -580, Math.sin(ha) * 46, -580 - Math.cos(ha) * 46, 12, C.ink); for (let w = 0; w < 4; w++) { g.fillStyle = rgba(C.sun, .8); g.fillRect(-60 + (w % 2) * 80, -420 + Math.floor(w / 2) * 140, 40, 70); } });
  // weather over the stretches
  const wSpring = clamp(1 - Math.abs(mid - 1500) / 2000, 0, 1), wLeaf = clamp(1 - Math.abs(mid - 9600) / 1100, 0, 1), wSnow = clamp((mid - 10300) / 400, 0, 1);
  if (wSpring > .02) drift(g, lt, 40, 'petal', { alpha: wSpring, wind: -.6, size: 1.3 });
  if (wLeaf > .02) drift(g, lt, 30, 'leaf', { alpha: wLeaf, wind: -1, size: 1.6 });
  if (wSnow > .02) drift(g, lt, 140, 'snow', { alpha: wSnow, speed: .7 });
  // and her, keeping pace with the camera
  const v = (camAt(lt + .05) - camAt(lt - .05)) * 10, runK = clamp((v - 500) / 500, 0, 1);
  const P = lerpPose(POSE.walk(lt * 8), POSE.run(lt * 10), runK);
  const look = mid > 10300 ? LOOK.girl : Object.assign({}, LOOK.girl, { scarf: mid > 8800 ? C.coral : null, coat: mid > 7300 });
  person(g, 900, gy + 6, 330, P, look, { t: lt, wind: .6 + runK * .5 });
  if (lt < 1) cloudWall(g, lt, 1, seg(lt, 0, .75, E.ioExpo));
};
