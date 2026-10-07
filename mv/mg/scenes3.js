'use strict';
/* =========================================================
   Scenes 125–167 s: bridge, interlude, climax ×2
   ========================================================= */

/* ---------- 125–128 your shadow grows long as the sun goes west ---------- */
SC.backWalk = (g, lt, u) => {
  const hy = 520, vx = 960;
  fill(g, vg(g, 0, hy, [[0, '#4A3577'], [.55, '#E0705C'], [1, '#FFC27A']]));
  const sy = lerp(430, 520, u);
  g.save(); g.beginPath(); g.rect(0, 0, W, hy); g.clip(); sunDisc(g, vx, sy, 120, '#FFE2A0', { halo: 1, beat: beatHit(lt) }); g.restore();
  burst(g, vx, hy, 30, 1600, '#ffffff', .05, lt * .04);
  // fields either side of the road
  g.fillStyle = '#B4566A'; g.fillRect(0, hy, W, H - hy);
  for (let i = 0; i < 10; i++) { const f = (i / 10 + lt * .05) % 1, y = hy + f * f * (H - hy); g.fillStyle = rgba('#7A3F66', .25); g.fillRect(0, y, W, 4 + f * 10); }
  g.fillStyle = '#E8A27A'; g.beginPath(); g.moveTo(vx - 18, hy); g.lineTo(vx + 18, hy); g.lineTo(vx + 620, H); g.lineTo(vx - 620, H); g.fill();
  g.strokeStyle = rgba('#FFF1D0', .7); g.lineWidth = 6; g.setLineDash([40, 50]); g.lineDashOffset = lt * 60; g.beginPath(); g.moveTo(vx, hy + 4); g.lineTo(vx, H); g.stroke(); g.setLineDash([]);
  // poles along the road
  for (let i = 0; i < 6; i++) { const f = ((i / 6) + lt * .03) % 1, y = hy + f * f * (H - hy), s = .1 + f * 1.4; for (const d of [-1, 1]) { const x = vx + d * (30 + f * f * 780); line(g, x, y, x, y - 260 * s, 6 * s, '#5B2F55'); } }
  // the child walking away, backlit; the shadow runs back toward us
  const d = lerp(.75, .32, E.io2(u)), y = hy + d * d * (H - hy) + 10, s = 60 + d * d * 600;
  const c = _shc.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 700, 700);
  personFront(c, 350, 680, 600, LOOK.friendKid, { sil: '#4A2346', armL: .2 + Math.sin(lt * 6) * .15, armR: .2 - Math.sin(lt * 6) * .15 });
  g.save(); g.translate(vx, y); g.transform(1, 0, 0, -1.8 * s / 600, 0, 0); g.globalAlpha = .45; g.drawImage(_shc, -350 * s / 600, -680 * s / 600, 700 * s / 600, 700 * s / 600); g.restore();
  personFront(g, vx, y, s, LOOK.friendKid, { back: true, armL: .2 + Math.sin(lt * 6) * .15, armR: .2 - Math.sin(lt * 6) * .15, face: false });
};

/* ---------- 128–131 the flower's strange scent I never forgot ---------- */
SC.scent = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#3D2C5E'], [1, '#8A4A6E']]));
  drift(g, lt, 26, 'spark', { up: true, speed: .3, col: '#FFC9D6', alpha: .5 });
  const z = lerp(1.08, 1, E.o3(u));
  g.save(); g.translate(960, 620); g.scale(z, z); g.translate(-960, -620);
  // a single flower in a small glass
  g.fillStyle = 'rgba(255,255,255,.18)'; rr(g, 880, 760, 160, 220, 30); g.fill(); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 4; g.stroke();
  line(g, 960, 980, 960, 620, 8, C.leafD); g.fillStyle = C.leaf; g.beginPath(); g.ellipse(1010, 740, 50, 18, -.5, 0, TAU); g.fill();
  flower(g, 960, 600, 150, 1, C.pink, C.gold, lt * .2, 7);
  // scent ribbons curl upward, and in their loops two small figures appear
  for (let k = 0; k < 3; k++) {
    const draw = seg(lt, .1 + k * .25, 1.6 + k * .25, E.io2);
    g.strokeStyle = rgba(['#FFD9E3', '#FFE7A3', '#FFFFFF'][k], .75); g.lineWidth = 10 - k * 2; g.lineCap = 'round'; g.beginPath();
    const N = 90;
    for (let i = 0; i <= N * draw; i++) { const f = i / N, a = f * TAU * 1.4 + k * 2.1 + lt * .6, rad = 60 + f * 520; const x = 960 + Math.cos(a) * rad * (k === 1 ? -1 : 1) + Math.sin(f * 7 + lt) * 30, y = 540 - f * 470 + Math.sin(a) * rad * .3; i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  const ap = seg(lt, 1.4, 2.2, E.io2) * (1 - seg(lt, 2.6, 3, E.io2));
  if (ap > 0) { person(g, 700, 330, 230, POSE.run(lt * 9), LOOK.girlKid, { alpha: ap * .85, t: lt }); person(g, 1240, 290, 230, POSE.run(lt * 9 + 1.5), LOOK.friendKid, { alpha: ap * .85, t: lt, dir: -1 }); }
  g.restore();
};

/* ---------- 131–133 if it's fate, point me home ---------- */
SC.compass = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#2B2F5E'], [1, '#4B3A72']]));
  const cx = 960, cy = 500, r = 330, z = lerp(.9, 1, E.oBack(seg(lt, 0, .6)));
  g.save(); g.translate(cx, cy); g.scale(z, z);
  circle(g, 10, 18, r + 30, 'rgba(10,6,30,.4)');
  circle(g, 0, 0, r + 30, '#C9A46A'); circle(g, 0, 0, r + 12, '#E8CC8F'); circle(g, 0, 0, r, '#FFF6E4');
  for (let i = 0; i < 72; i++) { const a = i / 72 * TAU, l = i % 9 ? 12 : 30; line(g, Math.cos(a) * (r - 10), Math.sin(a) * (r - 10), Math.cos(a) * (r - 10 - l), Math.sin(a) * (r - 10 - l), i % 9 ? 2 : 5, C.ink); }
  g.fillStyle = C.ink; g.font = `56px ${FONTM}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  [['北', 0, -r + 80], ['东', r - 80, 0], ['南', 0, r - 80], ['西', -r + 80, 0]].forEach(([c, x, y]) => g.fillText(c, x, y));
  // star rose
  g.fillStyle = rgba(C.coral, .25); for (let i = 0; i < 8; i++) { g.save(); g.rotate(i / 8 * TAU); g.beginPath(); g.moveTo(0, -r * .62); g.lineTo(26, 0); g.lineTo(-26, 0); g.fill(); g.restore(); }
  // a little house marks home, west by the setting sun
  g.save(); g.translate(-r * .48, -r * .3); g.fillStyle = C.coral; g.beginPath(); g.moveTo(-34, 0); g.lineTo(0, -30); g.lineTo(34, 0); g.fill(); g.fillRect(-26, 0, 52, 36); g.fillStyle = C.gold; g.fillRect(-9, 12, 18, 24); g.restore();
  // the needle swings, hunts, then settles toward home
  const settle = seg(lt, .4, 1.8, E.oElastic), target = -PI / 2 - .99, spin = lt * 9;
  const ang = lerp(spin, target, settle);
  g.rotate(ang + PI / 2);
  g.fillStyle = C.coral; g.beginPath(); g.moveTo(0, -r * .78); g.lineTo(30, 0); g.lineTo(-30, 0); g.fill();
  g.fillStyle = '#8A8FA8'; g.beginPath(); g.moveTo(0, r * .78); g.lineTo(30, 0); g.lineTo(-30, 0); g.fill();
  circle(g, 0, 0, 22, C.ink); circle(g, 0, 0, 9, C.gold);
  g.restore();
};

/* ---------- 133–137 why did I stop; only tears falling ---------- */
SC.feetStop = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#4B3A72'], [1, '#2A2350']]));
  const gy = 780, walk = 1 - seg(lt, .4, 1.1, E.o3), pan = lt * 160 * walk + 60;
  g.fillStyle = '#5E4A7E'; g.fillRect(0, gy, W, H - gy);
  for (let i = 0; i < 12; i++) { const x = ((i * 200 - pan) % (W + 200) + W + 200) % (W + 200) - 100; g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(x, gy + 40, 140, 6); }
  // close on her shoes: the walk slows to a stop
  const ph = (lt - .4 * (1 - walk)) * 7 * walk + 1.2 * (1 - walk);
  const P = lerpPose(POSE.walk(ph), POSE.stop(), 1 - walk);
  g.save(); g.translate(0, 0);
  person(g, 900, gy + 4, 1800, P, LOOK.girl, { t: lt, face: false });
  g.restore();
  // drops fall into frame and ring out on the ground
  for (let i = 0; i < 6; i++) {
    const t0 = 1 + i * .45, f = (lt - t0) / .55; if (f < 0) continue;
    const x = 760 + R(i, 3) * 420;
    if (f < 1) { const y = lerp(-40, gy + 30, E.i2(f)); g.fillStyle = 'rgba(200,225,255,.95)'; g.beginPath(); g.moveTo(x, y - 30); g.quadraticCurveTo(x + 16, y + 4, x, y + 12); g.quadraticCurveTo(x - 16, y + 4, x, y - 30); g.fill(); }
    else { const k = clamp((f - 1) / 2, 0, 1); for (let j = 0; j < 3; j++) { const kk = clamp(k * 1.4 - j * .2, 0, 1); if (kk <= 0) continue; g.strokeStyle = rgba('#CFE0FF', .7 * (1 - kk)); g.lineWidth = 4; g.beginPath(); g.ellipse(x, gy + 30, 20 + kk * 160, 6 + kk * 34, 0, 0, TAU); g.stroke(); } }
  }
};
SC.tearProfile = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#2A2350'], [1, '#4B3A72']]));
  drift(g, lt, 30, 'dot', { up: true, speed: .3, col: '#CFE0FF', alpha: .5, size: 1.3 });
  const z = lerp(1, 1.06, E.io2(u));
  g.save(); g.translate(960, 560); g.scale(z, z); g.translate(-960, -560);
  profile(g, 900, 540, 440, 'girl', { col: '#6E5A9A', hairCol: '#2B2233', layers: ['#3A2F66'], eye: 0, rim: rgba('#CFE0FF', .7) });
  // tears run down her cheek and drop
  for (let i = 0; i < 4; i++) {
    const f = ((lt - .3 - i * .55) / 1.3); if (f < 0 || f > 1) continue;
    const ex = 900 + .25 * 440, ey = 540 + .1 * 440;
    const x = ex + (f < .4 ? f * 40 : 16 + (f - .4) * 10), y = ey + (f < .4 ? f * 300 : 120 + (f - .4) ** 2 * 1400);
    g.fillStyle = rgba('#DCEBFF', .95 * (1 - Math.max(0, f - .85) / .15)); g.beginPath(); g.moveTo(x, y - 20); g.quadraticCurveTo(x + 11, y + 2, x, y + 10); g.quadraticCurveTo(x - 11, y + 2, x, y - 20); g.fill();
    sparkle(g, x - 2, y - 4, 7, '#ffffff', .9);
  }
  g.restore();
};

/* ---------- 137–145 interlude: tears rise and become stars; then the rush ---------- */
SC.tearsToStars = (g, lt, u) => {
  const k = seg(lt, 0, 2.5, E.io2);
  fill(g, vg(g, 0, H, [[0, mix('#2A2350', '#0A0E26', k)], [1, mix('#4B3A72', C.night2, k)]]));
  stars(g, lt, 300, H, k, 31);
  for (let i = 0; i < 60; i++) {
    const t0 = R(i, 1) * 2.4, f = clamp((lt - t0) / 3, 0, 1); if (f <= 0) continue;
    const x0 = 960 + (R(i, 2) - .5) * 900, y0 = 980, x1 = R(i, 3) * W, y1 = 60 + R(i, 4) * 600;
    const e = E.io3(f), x = lerp(x0, x1, e), y = lerp(y0, y1, e);
    if (f < .6) { g.fillStyle = rgba('#DCEBFF', .9); g.beginPath(); g.moveTo(x, y + 22); g.quadraticCurveTo(x + 10, y - 2, x, y - 8); g.quadraticCurveTo(x - 10, y - 2, x, y + 22); g.fill(); }
    const st = seg(f, .4, .8, E.io2); if (st > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, 26 * st, '#BFD4FF', .7); g.restore(); sparkle(g, x, y, 12 * st * (.8 + .2 * Math.sin(lt * 4 + i)), '#ffffff'); }
  }
  // the horizon of her world, far below
  paper(g, hillPath(1040, 30, .002, 1), '#1B1A40', { sa: 0 });
};
SC.warp = (g, lt, u) => {
  fill(g, C.night);
  const sp = E.iExpo(seg(lt, 0, 4, E.lin)) * 1 + lt * .15;
  g.save(); g.translate(960, 540); g.lineCap = 'round';
  for (let i = 0; i < 260; i++) {
    const a = R(i, 1) * TAU, z0 = R(i, 2), z = ((z0 + lt * (.12 + sp * 1.4)) % 1), d = 40 + z * z * 1300, len = 4 + sp * z * 360;
    g.strokeStyle = rgba(i % 7 ? '#E6EEFF' : C.gold, .2 + z * .8); g.lineWidth = 1 + z * 3;
    g.beginPath(); g.moveTo(Math.cos(a) * d, Math.sin(a) * d * .7); g.lineTo(Math.cos(a) * (d + len), Math.sin(a) * (d + len) * .7); g.stroke();
  }
  g.restore();
  const core = seg(lt, 2.5, 4, E.i3); glow(g, 960, 540, 80 + core * 900, '#FFF2D0', .4 + core * .6);
  circle(g, 960, 540, 6 + core * 60 + beatHit(lt) * 6, '#ffffff');
  if (lt > 3.6) { g.save(); g.globalAlpha = seg(lt, 3.6, 4, E.i2); fill(g, '#ffffff'); g.restore(); }
};

/* ---------- 145–167 climax ---------- */
function nightSky(g, lt, seed = 41) { fill(g, vg(g, 0, H, [[0, '#070A22'], [.7, '#16205A'], [1, '#2C3478']])); stars(g, lt, 320, H, 1, seed); }
function meteor(g, x0, y0, x1, y1, f, w, tail = .3) {
  const x = lerp(x0, x1, f), y = lerp(y0, y1, f), tx = lerp(x0, x1, Math.max(0, f - tail)), ty = lerp(y0, y1, Math.max(0, f - tail));
  const gr = g.createLinearGradient(tx, ty, x, y); gr.addColorStop(0, 'rgba(255,240,210,0)'); gr.addColorStop(1, 'rgba(255,250,235,1)');
  g.strokeStyle = gr; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, w * 7, '#FFF0C8', .9); g.restore();
}
SC.meteorSlash = (g, lt, u) => {
  const b = buf('slash'); const c = b.getContext('2d');
  nightSky(c, lt);
  paper(c, hillPath(900, 50, .002, 2), '#1B1A40', { sa: 0 });
  person(c, 1300, 905, 260, POSE.look(), LOOK.girl, { t: lt, wind: 1, sil: '#0E0C26' });
  const f = seg(lt, 0, .45, E.o3);
  meteor(c, 1900, 60, 200, 760, f, 14, .9);
  // the sky splits along the meteor's path
  const sp = seg(lt, .3, .9, E.o5) * 18;
  const nx = -700 / Math.hypot(1700, 700) * 0 + .38, ny = .92;
  for (const s of [-1, 1]) { g.save(); g.beginPath(); if (s < 0) { g.moveTo(-50, -50); g.lineTo(2100, -50); g.lineTo(2100, 18); g.lineTo(-50, 900); } else { g.moveTo(2100, 18); g.lineTo(2100, 1200); g.lineTo(-50, 1200); g.lineTo(-50, 900); } g.closePath(); g.clip(); g.drawImage(b, s * sp * nx, s * sp * ny); g.restore(); }
  const fl = Math.exp(-lt * 5); if (fl > .01) { g.save(); g.globalAlpha = fl; fill(g, '#ffffff'); g.restore(); }
};
SC.tearMeteor = (g, lt, u) => {
  nightSky(g, lt, 43);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 8; k++) { const t0 = k * .24, f = (lt - t0) / .7; if (f > 0 && f < 1.3) { const x0 = 300 + R(k, 3) * 1400, y0 = R(k, 4) * 200; meteor(g, x0, y0, x0 - 600, y0 + 360, clamp(f, 0, 1), 3 + R(k, 5) * 3); } }
  g.restore();
  const z = lerp(1, 1.05, u);
  g.save(); g.translate(1000, 560); g.scale(z, z); g.translate(-1000, -560);
  // looking up: the profile tilts back
  g.save(); g.translate(1000, 620); g.rotate(-.28); profile(g, 0, 0, 470, 'girl', { col: '#2A2F66', hairCol: '#14122E', eye: 1, rim: rgba('#FFE8C0', .9) }); g.restore();
  const tx = 1000 + Math.cos(-.28) * .25 * 470 - Math.sin(-.28) * .12 * 470, ty = 620 + Math.sin(-.28) * .25 * 470 + Math.cos(-.28) * .12 * 470;
  const tf = seg(lt, .3, 1.6, E.io2);
  g.fillStyle = rgba('#E8F2FF', .95); g.beginPath(); g.ellipse(tx + tf * 8, ty + tf * 70, 9, 14, 0, 0, TAU); g.fill();
  sparkle(g, tx + tf * 8 - 3, ty + tf * 70 - 4, 18 + 8 * Math.sin(lt * 9), '#ffffff');
  g.restore();
};
SC.fearless = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#0E1236'], [1, '#3A2F72']]));
  stars(g, lt, 200, 700, .8, 45);
  const pan = lt * 900, gy = 860;
  paper(g, hillPath(780, 40, .002, -pan * .002), '#241F52', { sa: 0 });
  g.fillStyle = '#1A1640'; g.fillRect(0, gy, W, H - gy);
  for (let i = 0; i < 14; i++) { const x = ((i * 240 - pan) % (W + 240) + W + 240) % (W + 240) - 120; g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x, gy + 30 + (i % 3) * 40, 120, 5); }
  // dark shards stand in her way and burst as she reaches them
  const px = 760;
  for (let i = 0; i < 5; i++) {
    const wx = 1500 + i * 700, x = wx - pan; if (x < -300 || x > W + 300) continue;
    const hit = clamp((px + 120 - x) / 260, 0, 1);
    if (hit <= 0) { g.fillStyle = '#4A2F6E'; g.beginPath(); g.moveTo(x - 90, gy); g.lineTo(x - 30, gy - 300 - (i % 2) * 80); g.lineTo(x + 20, gy - 180); g.lineTo(x + 70, gy - 340); g.lineTo(x + 110, gy); g.fill(); }
    else for (let k = 0; k < 14; k++) { const a = -PI * (R(k, i) * .9 + .05), d = E.o3(hit) * (120 + R(k, i + 3) * 400); g.save(); g.translate(x + Math.cos(a) * d + hit * 200, gy - 160 + Math.sin(a) * d + hit * hit * 300); g.rotate(hit * 6 * (R(k, i + 7) - .5)); g.globalAlpha = 1 - hit; g.fillStyle = k % 3 ? '#4A2F6E' : C.gold; g.beginPath(); g.moveTo(0, -26); g.lineTo(22, 16); g.lineTo(-20, 12); g.fill(); g.restore(); }
  }
  for (let i = 0; i < 9; i++) { const y = 300 + R(i, 3) * 520; swoosh(g, W - ((lt * 1.6 + R(i, 4)) % 1) * (W + 600), y, 380, .6, rgba('#ffffff', .35), 3); }
  person(g, px, gy + 4, 380, POSE.run(lt * 12), LOOK.girl, { t: lt, wind: 1.4 });
};
SC.goldSignal = (g, lt, u, o) => {
  const hy = 640, k = seg(lt, 0, 1.6, E.io3), st = o.strong ? 1.25 : 1;
  fill(g, vg(g, 0, hy, [[0, mix('#16205A', '#F08A5C', k)], [.6, mix('#3A2F72', '#FFB46A', k)], [1, mix('#5A4E8E', '#FFE6A8', k)]]));
  stars(g, lt, 200, hy, 1 - k, 47);
  const sy = lerp(760, 520, seg(lt, 0, 2, E.o3)) - (o.strong ? 60 : 0);
  g.save(); g.beginPath(); g.rect(0, 0, W, hy); g.clip();
  burst(g, 960, sy, 28, 2000, '#FFF4D0', .14 * k * st, lt * .12);
  burst(g, 960, sy, 14, 2000, C.gold, .1 * k * st, -lt * .08);
  sunDisc(g, 960, sy, 120 * st, '#FFF0C0', { halo: 1, beat: beatHit(lt) });
  g.restore();
  flatSea(g, hy, mix('#28306A', '#F2A877', k), mix('#121733', '#7A4E86', k), lt, { sunX: 960, refl: .8 * k, reflCol: '#FFF0C0', da: .2 });
  line(g, 0, hy, W, hy, 4 + 6 * k, rgba('#FFF4D0', .9));
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 960, hy, 900 * k, '#FFC870', .5 * k); g.restore();
  // she stands on the near shore, and the first light reaches her
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 900); g2.bezierCurveTo(400, 860, 900, 880, 1200, 960); g2.lineTo(1260, H); g2.closePath(); }, mix('#1B1A40', '#7A3F66', k), { dy: -10 });
  person(g, 520, 885, 300, POSE.look(), LOOK.girl, { t: lt, wind: 1, dir: 1 });
  const hit = seg(lt, 1.2, 1.8, E.o3); if (hit > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 560, 640, 260 * hit, '#FFD27A', .5 * hit); g.restore(); }
};
SC.chaseLight = (g, lt, u, o) => {
  const hy = 640;
  fill(g, vg(g, 0, hy, [[0, '#F08A5C'], [.6, '#FFB46A'], [1, '#FFE6A8']]));
  burst(g, 1380, 520, 28, 2200, '#FFF4D0', .16, lt * .12);
  sunDisc(g, 1380, 500, 150, '#FFF0C0', { halo: 1, beat: beatHit(lt) });
  flatSea(g, hy, '#F2A877', '#7A4E86', lt, { sunX: 1380, refl: .8, reflCol: '#FFF0C0', da: .2 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 870); g2.bezierCurveTo(600, 840, 1300, 850, W + 20, 880); g2.lineTo(W + 20, H); g2.closePath(); }, '#8A4A6E', { dy: -10 });
  // the friend waits inside the light
  const fa = seg(lt, .3, 1.4, E.io2);
  personFront(g, 1380, 870, 320, LOOK.friend, { alpha: o.meet ? 1 : .35 + .65 * fa, armL: o.meet ? lerp(.15, 2.3, seg(lt, 1.5, 2.1, E.oBack)) : .15, armR: .15, smile: true, t: lt });
  // she runs, stumbles, gets up and runs on
  const x = o.meet ? lerp(160, 1150, E.o3(clamp(lt / 2.1, 0, 1))) : lerp(160, 900, E.io2(u));
  const trip = o.meet ? 0 : seg(lt, 1.1, 1.35, E.io2) * (1 - seg(lt, 1.7, 2.1, E.io2));
  let P = trip > 0 ? lerpPose(POSE.run(lt * 11), Object.assign(POSE.sit(), { a1: 1.2, a2: 1.4 }), trip) : POSE.run(lt * 11);
  if (o.meet) P = lerpPose(P, Object.assign(POSE.stand(), { a1: 2.45, e1: .1 }), seg(lt, 1.7, 2.1, E.io2));
  person(g, x, 880, 330, P, LOOK.girl, { t: lt, wind: 1.3, rot: trip * .5 });
  if (trip > .5) for (let i = 0; i < 8; i++) circle(g, x + 60 + R(i, 1) * 80, 880 - R(i, 2) * 40, 8, rgba('#F7D6C0', .6 * trip));
};
SC.meteorShower = (g, lt, u) => {
  const rot = lerp(-.04, .04, E.io2(u));
  g.save(); g.translate(960, 540); g.rotate(rot); g.scale(1.1, 1.1); g.translate(-960, -540);
  nightSky(g, lt, 49);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 40; k++) { const t0 = k * .07 + R(k, 1) * .2, f = (lt - t0) / .8; if (f > 0 && f < 1.3) { const x0 = 200 + R(k, 3) * 2000, y0 = R(k, 4) * 300 - 100; meteor(g, x0, y0, x0 - 700, y0 + 420, clamp(f, 0, 1), 2 + R(k, 5) * 4); } }
  meteor(g, 2000, -100, 300, 700, seg(lt, .1, .7, E.o3), 12, .8);
  g.restore();
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-60, H + 60); g2.lineTo(-60, 860); g2.quadraticCurveTo(700, 700, 1300, 820); g2.lineTo(W + 60, 900); g2.lineTo(W + 60, H + 60); g2.closePath(); }, '#0E0C26', { sa: 0 });
  person(g, 760, 760, 300, POSE.look(), LOOK.girl, { t: lt, wind: 1.6, sil: '#0E0C26' });
  g.restore();
};
SC.leap = (g, lt, u) => {
  nightSky(g, lt, 51);
  const dawn = seg(lt, .5, 2, E.io2);
  g.save(); g.globalAlpha = dawn * .6; fill(g, vg(g, 0, H, [[0, 'rgba(0,0,0,0)'], [1, '#F08A5C']])); g.restore();
  // two cliffs and a gap of nothing
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 760); g2.lineTo(620, 740); g2.lineTo(700, H); g2.closePath(); }, '#1A1640', { sa: 0 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(W + 20, H); g2.lineTo(W + 20, 740); g2.lineTo(1300, 760); g2.lineTo(1220, H); g2.closePath(); }, '#1A1640', { sa: 0 });
  const f = seg(lt, .1, 1.9, E.sine), x = lerp(500, 1440, f), arc = Math.sin(f * PI) * 300, slow = 1;
  const P = f <= 0 ? POSE.run(lt * 12) : f >= 1 ? POSE.run(lt * 12) : POSE.leap(Math.sin(f * PI));
  person(g, x, lerp(745, 750, f) - arc, 330, P, LOOK.girl, { t: lt, wind: 1.6, rot: (f - .5) * .3 * (f > 0 && f < 1 ? 1 : 0) });
  void slow;
  for (let i = 0; i < 20; i++) sparkle(g, x - 120 - i * 26, 745 - Math.sin(clamp(f - i * .02, 0, 1) * PI) * 300 - 160, 8 * (1 - i / 20), C.gold, f > 0 && f < 1 ? .9 : 0);
};
SC.highFive = (g, lt, u) => {
  SC.chaseLight(g, lt, u, { meet: true });
  // the two hands meet in a burst of light
  const hit = seg(lt, 2.15, 2.3, E.o3), after = seg(lt, 2.3, 3, E.o3);
  if (hit > 0) {
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 1268, 590, 160 + after * 900, '#FFF2C8', 1 - after * .3); g.restore();
    g.save(); g.translate(1268, 590); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r0 = 60 + after * 260, r1 = 90 + after * 520; line(g, Math.cos(a) * r0, Math.sin(a) * r0, Math.cos(a) * r1, Math.sin(a) * r1, 10 * (1 - after), i % 2 ? '#ffffff' : C.gold); } g.restore();
    g.save(); g.globalAlpha = seg(lt, 2.5, 3, E.i2); fill(g, '#FFF8E8'); g.restore();
  }
};
