'use strict';
/* =========================================================
   Scenes 0–52 s: opening, verse A1, chorus 1
   ========================================================= */

/* ---------- shared backdrops ---------- */
// flat sea: gradient body, drifting highlight dashes, a column of reflection dashes under the sun
function flatSea(g, hy, top, bot, t, o = {}) {
  g.fillStyle = vg(g, hy, H, [[0, top], [1, bot]]); g.fillRect(0, hy, W, H - hy);
  const n = o.n ?? 46, hl = o.hl || '#ffffff';
  for (let i = 0; i < n; i++) {
    const f = R(i, 11) ** 1.6, y = hy + 8 + f * (H - hy), w = (20 + R(i, 12) * 90) * (.4 + f * 1.4);
    const x = ((R(i, 13) * (W + 400) + t * (14 + R(i, 14) * 26) * (o.flow ?? 1)) % (W + 400)) - 200;
    g.globalAlpha = (o.da ?? .22) * (.35 + .65 * Math.sin(t * 1.7 + i) ** 2); g.fillStyle = hl;
    rr(g, x, y, w, 3 + f * 3, 3); g.fill();
  }
  if (o.sunX != null) {
    for (let i = 0; i < 18; i++) {
      const f = i / 18, y = hy + 6 + f * f * (H - hy) * .9, w = (30 + f * 260) * (.55 + .45 * Math.sin(t * 2.4 + i * 1.7));
      g.globalAlpha = (o.refl ?? .6) * (1 - f * .6); g.fillStyle = o.reflCol || C.sun;
      rr(g, o.sunX - w / 2 + Math.sin(t * 1.3 + i) * 10, y, w, 4 + f * 6, 4); g.fill();
    }
  }
  g.globalAlpha = 1;
}
const seasonSky = [['#F7C9D3', '#FDF0E6'], ['#6FC6EE', '#DDF4FF'], ['#F2A65E', '#FBE1BD'], ['#A9BEDD', '#EEF3FA']];
const seasonGround = ['#A9DDB4', '#6DBB7C', '#E5974A', '#EEF3FA'];
const seasonCrown = [C.pink, '#4FA463', C.orange, '#FFFFFF'];

/* ---------- 0–10 opening: a dot, a line through the night, the ring of seasons, the title ---------- */
SC.opening = (g, lt) => {
  const tilt = seg(lt, 8.5, 10, E.io3), ly = lerp(540, 640, tilt);
  fill(g, vg(g, 0, H, [[0, C.night], [1, mix(C.night, C.night2, .55)]]));
  stars(g, lt, 240, H * .95, seg(lt, .2, 3.2) * (1 - tilt * .3), 1);
  const dot = seg(lt, .7, 1.4, E.oBack2), lineK = seg(lt, 1.5, 3.6, E.ioExpo), ringK = seg(lt, 3.3, 5.1, E.o5), sunK = seg(lt, 8.3, 9.8, E.io3);
  // sea appears under the line as the camera tilts
  if (tilt > 0) { g.save(); g.globalAlpha = tilt; flatSea(g, ly, '#28306A', '#121733', lt, { da: .08 }); g.restore(); }
  if (lineK > 0) {
    const lw = lineK * (W / 2 + 20);
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 960, ly, 140 * lineK, C.sun, .25); g.restore();
    line(g, 960 - lw, ly, 960 + lw, ly, 3, C.cream);
  }
  const cx = 960, cy = ly + lerp(0, 40, sunK);
  if (ringK <= 0) {
    if (dot > 0) { circle(g, cx, cy, 11 * dot, C.cream); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, cx, cy, 60 + 30 * beatHit(lt), C.sun, .5 * dot); g.restore(); }
  } else {
    const r = lerp(11, 175, ringK) * lerp(1, .46, sunK), rot = lt * .35;
    // sun fill takes over the ring at the end
    if (sunK > 0) { sunDisc(g, cx, cy, r, mix(C.cream, C.sun, sunK), { halo: sunK }); }
    g.save(); g.globalAlpha = 1 - sunK;
    ring(g, cx, cy, r, 3, C.cream);
    ring(g, cx, cy, r * .78, 1.5, rgba(C.cream, .35));
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + rot * .3, l = i % 6 ? 6 : 14; line(g, cx + Math.cos(a) * (r * .86), cy + Math.sin(a) * (r * .86), cx + Math.cos(a) * (r * .86 - l * ringK), cy + Math.sin(a) * (r * .86 - l * ringK), 2, rgba(C.cream, .6)); }
    const sc = [C.pink, C.sky, C.orange, C.snow];
    for (let i = 0; i < 4; i++) { const a = rot + i * TAU / 4 - PI / 2, pk = seg(lt, 4 + i * .25, 4.6 + i * .25, E.oBack2); circle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 13 * pk, sc[i]); }
    g.restore();
    // a slow pulse on the beat
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, cx, cy, r * 1.4, C.sun, .12 * beatHit(lt) * (1 - sunK)); g.restore();
  }
  // title
  const out = 1 - seg(lt, 7.9, 8.7, E.io2);
  if (lt > 5 && out > 0) {
    ktext(g, '四季之歌', 960, ly + 300, 112, lt - 5.1, { medium: true, col: C.cream, spacing: 40, stagger: .16, dur: .9, out, shadow: 'rgba(0,0,0,.35)', blur: 24, ease: E.o5, rise: 50, from: .9 });
    ktext(g, 'SONG  OF  THE  FOUR  SEASONS', 960, ly + 392, 22, lt - 6.2, { col: rgba(C.cream, .75), spacing: 6, stagger: .03, dur: .6, out, ease: E.o3, rise: 12 });
  }
};

/* ---------- 10–14 sunrise: two kids wave goodbye across the dawn ---------- */
function dawnSky(g, k, hy) {
  fill(g, vg(g, 0, hy, [[0, mix(C.night, '#4B4C92', k)], [.55, mix(C.night2, '#E58C8A', k)], [1, mix(C.night3, '#FFD39A', k)]]));
}
SC.sunrise = (g, lt, u) => {
  const hy = 640, k = seg(lt, 0, 3.4, E.io2), push = lerp(1, 1.06, E.io2(u));
  g.save(); g.translate(960, 600); g.scale(push, push); g.translate(-960, -600);
  dawnSky(g, k, hy);
  stars(g, lt, 200, hy, 1 - k, 1);
  const sy = lerp(680, 480, seg(lt, .1, 3.8, E.o3)), sr = lerp(80, 92, k);
  g.save(); g.beginPath(); g.rect(0, 0, W, hy); g.clip(); sunDisc(g, 960, sy, sr, mix(C.sun, '#FFF2C8', k), { halo: .4 + .6 * k, beat: beatHit(lt) }); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 960, hy, 700 * (.3 + k), '#FFC98A', .35 * k); g.restore();
  // distant islands
  paper(g, g2 => { g2.beginPath(); g2.ellipse(260, hy, 260, 46, 0, PI, TAU); g2.ellipse(1680, hy, 300, 60, 0, PI, TAU); }, mix('#2A2558', '#8E5A86', k), { dy: 0, sa: 0 });
  flatSea(g, hy, mix('#28306A', '#E7A08E', k), mix('#121733', '#5A4E8E', k), lt, { sunX: 960, refl: .2 + .5 * k, reflCol: '#FFE2A8', da: .12 });
  line(g, 0, hy, W, hy, 3, rgba(C.cream, .6 + .4 * k));
  // foreground shores
  const fg = mix('#1E1B44', '#5B3C6E', k);
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 860); g2.bezierCurveTo(200, 800, 560, 780, 820, 880); g2.lineTo(860, H); g2.closePath(); }, fg, { dy: -10, sa: .15 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(W + 20, H); g2.lineTo(W + 20, 850); g2.bezierCurveTo(1720, 790, 1360, 780, 1100, 880); g2.lineTo(1060, H); g2.closePath(); }, fg, { dy: -10, sa: .15 });
  // the two kids wave
  const wg = seg(lt, .7, 1.2, E.oBack), wf = seg(lt, 1.1, 1.6, E.oBack), osc = Math.sin(lt * 8);
  const down = seg(lt, 3.3, 3.9, E.io2);
  personFront(g, 520, 830, 300, LOOK.girlKid, { t: lt, armR: lerp(.15, 2.55 + osc * .25, wg * (1 - down)), armL: .2, smile: true });
  personFront(g, 1400, 830, 310, LOOK.friendKid, { t: lt, armL: lerp(.15, 2.55 - osc * .25, wf * (1 - down)), armR: .2, smile: true });
  g.restore();
};

/* ---------- 14–18.5 the hug that can't happen: the frame splits between them ---------- */
function hugWorld(g, lt) {
  dawnSky(g, 1, 640);
  sunDisc(g, 960, 470, 92, '#FFF2C8', { halo: 1, beat: beatHit(lt) });
  flatSea(g, 640, '#E7A08E', '#5A4E8E', lt, { sunX: 960, refl: .7, reflCol: '#FFE2A8', da: .12 });
  line(g, 0, 640, W, 640, 3, C.cream);
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 840); g2.bezierCurveTo(500, 800, 1400, 800, W + 20, 840); g2.lineTo(W + 20, H); g2.closePath(); }, '#5B3C6E', { dy: -10, sa: .15 });
  const runK = seg(lt, 0, 1.6, E.o2), ph = lt * 11;
  const gx = lerp(360, 790, runK), fx = lerp(1560, 1130, runK), reach = seg(lt, 1.2, 1.8, E.io2);
  const sway = Math.sin(lt * 2) * .05;
  const Pg = lerpPose(POSE.run(ph), POSE.reach(.95 + sway), reach), Pf = lerpPose(POSE.run(ph + 1.3), POSE.reach(.95 - sway), reach);
  person(g, gx, 860, 330, Pg, LOOK.girlKid, { t: lt, wind: 1 });
  person(g, fx, 860, 340, Pf, LOOK.friendKid, { t: lt, dir: -1 });
}
SC.hugGap = (g, lt, u) => {
  const b = buf('hug'); hugWorld(b.getContext('2d'), lt);
  fill(g, vg(g, 0, H, [[0, C.night], [1, C.night2]])); stars(g, lt, 220, H, 1, 4);
  const sp = seg(lt, 1.5, 3.3, E.io3), away = seg(lt, 3.5, 4.5, E.i3), gap = sp * 420 + away * (W + 200);
  const dyy = sp * 26;
  for (const side of [-1, 1]) {
    g.save(); const ox = side * gap / 2, oy = side * dyy;
    g.translate(ox, oy);
    g.fillStyle = 'rgba(8,6,24,.35)'; g.fillRect(side < 0 ? -20 : 960 + 14, 16, 980, H); // paper shadow
    g.beginPath(); g.rect(side < 0 ? 0 : 960, 0, 960, H); g.clip(); g.drawImage(b, 0, 0);
    g.restore();
    if (sp > 0) line(g, 960 + ox, oy - 10, 960 + ox, H + oy + 10, 4, rgba(C.cream, .85 * sp));
  }
};

/* ---------- 18.5–22.4 alone across the four seasons: walking on a turning planet ---------- */
function planetProps(g, q, r, t) {
  // q: season 0..3; draw props at fixed angles inside that quadrant (angles relative to planet)
  const base = q * TAU / 4;
  const put = (a, f) => { g.save(); g.rotate(base + a); g.translate(0, -r + 4); f(); g.restore(); };
  const crown = seasonCrown[q];
  put(.18, () => tree(g, 0, 0, 230, crown, '#7A5240', { t, dots: q === 0 ? '#ffffff' : q === 2 ? C.amber : null }));
  put(.52, () => { if (q === 3) { circle(g, 0, -40, 40, '#fff'); circle(g, 0, -105, 30, '#fff'); circle(g, 8, -110, 4, C.ink); g.fillStyle = C.orange; g.beginPath(); g.moveTo(14, -100); g.lineTo(40, -96); g.lineTo(14, -92); g.fill(); line(g, -24, -70, -60, -96, 5, '#7A5240'); } else { for (let i = 0; i < 4; i++) { line(g, -40 + i * 26, 0, -40 + i * 26, -36 - i % 2 * 10, 4, C.leafD); flower(g, -40 + i * 26, -40 - i % 2 * 10, 16, 1, q === 2 ? C.amber : [C.pink, '#fff', C.gold][i % 3], C.gold); } } });
  put(.85, () => { const wc = ['#FFF5E4', '#FFFFFF', '#FBE3C4', '#E7EEF8'][q]; g.fillStyle = wc; rr(g, -60, -110, 120, 110, 6); g.fill(); g.fillStyle = [C.coral, C.sea, C.rust, C.slate][q]; g.beginPath(); g.moveTo(-76, -104); g.lineTo(0, -170); g.lineTo(76, -104); g.fill(); g.fillStyle = q === 3 ? '#fff' : C.gold; rr(g, -20, -70, 40, 40, 4); g.fill(); if (q === 3) { g.fillStyle = '#fff'; rr(g, -80, -116, 160, 18, 9); g.fill(); } });
  put(1.2, () => tree(g, 0, 0, 170, shade(crown, -.08), '#6B4636', { t: t + 1 }));
}
SC.planet = (g, lt, u, o) => {
  const rise = seg(lt, 0, 1, E.o3), ang = -(lt + .2) * (4.9 / (o.d - .6)) + .03, r = 860;
  const fly = seg(lt, o.d - .9, o.d, E.io3);
  const cy = lerp(H + 900, 1530, rise) + fly * 900;
  // season under her feet
  const topA = ((-ang % TAU) + TAU) % TAU, qf = topA / (TAU / 4), qi = Math.floor(qf) % 4, qn = (qi + 1) % 4, qk = E.io2(clamp((qf % 1 - .7) / .3, 0, 1));
  const top = mix(seasonSky[qi][0], seasonSky[qn][0], qk), bot = mix(seasonSky[qi][1], seasonSky[qn][1], qk);
  fill(g, vg(g, 0, H, [[0, mix(C.night, top, rise)], [1, mix(C.night2, bot, rise)]]));
  stars(g, lt, 160, H, 1 - rise, 4);
  if (fly > 0) { g.save(); g.globalAlpha = fly; fill(g, vg(g, 0, H, [[0, '#F7B37A'], [1, '#FFE3B0']])); g.restore(); }
  // sun travels to frame centre for the next shot
  const sx = lerp(1460, 960, fly), sy = lerp(240, 500, fly), srr = lerp(70, 360, E.i2(fly));
  sunDisc(g, sx, sy, srr, C.sun, { halo: .8, beat: beatHit(lt) });
  for (let i = 0; i < 3; i++) cloud(g, ((300 + i * 700 - lt * 40) % (W + 400) + W + 400) % (W + 400) - 200, 200 + i * 60 + fly * 600, 120 + i * 20, '#ffffff', { sa: .05 });
  g.save(); g.translate(960, cy);
  circle(g, 0, 0, r + 26, rgba('#ffffff', .25));
  g.rotate(ang);
  for (let q = 0; q < 4; q++) { g.fillStyle = seasonGround[q]; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -PI / 2 + q * TAU / 4, -PI / 2 + (q + 1) * TAU / 4 + .002); g.closePath(); g.fill(); }
  for (let q = 0; q < 4; q++) { g.fillStyle = shade(seasonGround[q], -.08); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r - 46, -PI / 2 + q * TAU / 4, -PI / 2 + (q + 1) * TAU / 4 + .002); g.closePath(); g.fill(); }
  for (let q = 0; q < 4; q++) planetProps(g, q, r, lt);
  g.restore();
  person(g, 960, cy - r + 4, 250, POSE.walk(lt * 7.5), LOOK.girl, { t: lt, wind: .6 });
  // the season's weather
  const wts = [0, 0, 0, 0]; wts[qi] += 1 - qk; wts[qn] += qk;
  if (wts[0] > .01) drift(g, lt, 50, 'petal', { alpha: wts[0], wind: -.6, size: 1.3 });
  if (wts[1] > .01) drift(g, lt, 26, 'spark', { alpha: wts[1] * .6, up: true, speed: .4 });
  if (wts[2] > .01) drift(g, lt, 40, 'leaf', { alpha: wts[2], wind: -.8, size: 1.4 });
  if (wts[3] > .01) drift(g, lt, 120, 'snow', { alpha: wts[3], speed: .7 });
};

/* ---------- 22.4–25 your face in the light (and 25–32 the promise grows from it) ---------- */
function warmSun(g, lt, k = 1) {
  fill(g, vg(g, 0, H, [[0, '#F7B37A'], [1, '#FFE3B0']]));
  burst(g, 960, 500, 24, 1500, '#ffffff', .07 * k, lt * .05);
  sunDisc(g, 960, 500, 360 + 8 * beatHit(lt), C.sun, { halo: 1 });
}
SC.profileSun = (g, lt, u, o) => {
  warmSun(g, lt);
  const em = seg(lt, .1, 1.1, E.o3), dis = seg(lt, o.d - .6, o.d, E.io2), who = o.who || 'kid';
  g.save(); g.beginPath(); g.arc(960, 500, 360, 0, TAU); g.clip();
  const grow = who === 'morph' ? seg(lt, .9, 1.8, E.io3) : who === 'adult' ? 1 : 0;
  const pr = (w, a) => profile(g, 1010 + (1 - em) * 40, 540, 300 * lerp(1.08, 1, em), w, { dir: -1, alpha: em * (1 - dis) * a, col: '#6E4E8F', layers: ['#F9A27A', '#F07E65'], eye: 0, eyeCol: rgba(C.cream, .9) });
  if (grow < 1) pr('kid', 1 - grow); if (grow > 0) pr('adult', grow);
  g.restore();
  if (dis > 0) for (let i = 0; i < 70; i++) { const a = R(i, 3) * TAU, rr0 = R(i, 4) * 260, d = dis * (40 + R(i, 5) * 180); circle(g, 990 + Math.cos(a) * rr0 * .7 - d * .6, 520 + Math.sin(a) * rr0 - d * .8, 4 + R(i, 6) * 5, rgba('#FFF5E4', (1 - dis) * .9)); }
  drift(g, lt, 30, 'dot', { up: true, speed: .4, col: '#FFF5E4', alpha: .7, size: 1.3 });
  // her hand reaches into the light
  const hk = seg(lt, .5, 1.9, E.o3) * (1 - seg(lt, 2.1, 2.6, E.i2));
  if (hk > 0) hand(g, lerp(-140, 470, hk), lerp(1000, 760, hk), 120, -.62, LOOK.girl, { curl: .15, thumb: .1 });
};
function promiseHands(g, lt, k, shake, hook = 1) {
  const y = 520 + shake;
  pinkyFist(g, lerp(-500, 750, k), y, 150, LOOK.girlKid, { hook });
  pinkyFist(g, lerp(W + 500, 1084, k), y + 156, 150, LOOK.friendKid, { dir: -1, vflip: true, hook });
  // redraw the left hook's tip over the right one so the fingers interlock
  if (hook > .5) { g.save(); g.beginPath(); g.rect(lerp(-500, 750, k) + 150 * .95, y + 150 * .1, 80, 60); g.clip(); pinkyFist(g, lerp(-500, 750, k), y, 150, LOOK.girlKid, { hook }); g.restore(); }
}
function banner(g, lt, w, text, o = {}) {
  if (w <= 0) return;
  const cx = o.x ?? 960, cy = o.y ?? 840, h = 104, fl = o.flutter || 0;
  g.save(); g.translate(cx, cy); g.rotate(o.rot || 0);
  const wave = x => Math.sin(x * .012 + lt * 6) * 8 * fl;
  g.fillStyle = shade(C.paper, -.15);
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * w / 2, -h / 2 + 14 + wave(d * w / 2)); g.lineTo(d * (w / 2 + 70), -h / 2 + 14 + wave(d * w / 2)); g.lineTo(d * (w / 2 + 44), 14 + wave(d * w / 2)); g.lineTo(d * (w / 2 + 70), h / 2 + 14 + wave(d * w / 2)); g.lineTo(d * w / 2, h / 2 + 14 + wave(d * w / 2)); g.fill(); }
  g.fillStyle = C.paper; g.beginPath(); g.moveTo(-w / 2, -h / 2 + wave(-w / 2));
  for (let x = -w / 2; x <= w / 2; x += 20) g.lineTo(x, -h / 2 + wave(x));
  for (let x = w / 2; x >= -w / 2; x -= 20) g.lineTo(x, h / 2 + wave(x));
  g.closePath(); g.fill();
  g.restore();
}
SC.promise = (g, lt, u) => {
  warmSun(g, lt);
  const k = seg(lt, 0, 1.0, E.o5), hook = seg(lt, .85, 1.15, E.oBack);
  const shake = Math.sin(seg(lt, 1.4, 2.6, E.lin) * TAU * 2) * 26;
  promiseHands(g, lt, k, shake, hook);
  if (lt > 1) { const p = seg(lt, 1, 1.6, E.o3); g.save(); g.translate(960, 660 + shake); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(g, Math.cos(a) * (60 + p * 50), Math.sin(a) * (60 + p * 50), Math.cos(a) * (70 + p * 90), Math.sin(a) * (70 + p * 90), 6 * (1 - p), C.cream); } g.restore(); }
  const bw = seg(lt, 1.9, 2.6, E.o5) * 820;
  banner(g, lt, bw, '', { flutter: seg(lt, 3.3, 4, E.io2) });
  if (lt > 2.2) ktext(g, '拉钩上吊 一百年不许变', 960, 842, 58, lt - 2.25, { medium: true, col: C.ink, stagger: .07, dur: .45, ease: E.oBack });
  for (let i = 0; i < 3; i++) swoosh(g, 200 + i * 300, 260 + i * 120, 500, (lt - 3.2 - i * .15) / .9, rgba('#ffffff', .8), 4);
};
SC.scatter = (g, lt, u, o) => {
  const tilt = seg(lt, .6, 3, E.io3);
  g.save(); g.translate(0, tilt * 700);
  warmSun(g, lt, 1 - tilt);
  g.restore();
  g.save(); g.globalAlpha = tilt; fill(g, vg(g, 0, H, [[0, '#9ED6F2'], [1, '#FCE7EC']])); g.restore();
  const hk = 1 - seg(lt, 0, .6, E.i3);
  if (hk > 0) { if (o.adult) pinkyFist(g, lerp(-500, 760, hk), 520, 170, LOOK.girl, { hook: .35 }); else promiseHands(g, lt, hk, 0, hk); }
  // the paper and its words blow away and turn into petals
  const str = [...'拉钩上吊 一百年不许变'];
  const bw = 820 * (1 - seg(lt, .4, 1.2, E.i3));
  g.save(); g.translate(0, tilt * 420); banner(g, lt, bw, '', { flutter: 1 }); g.restore();
  g.save(); g.font = `58px ${FONTM}`; g.textBaseline = 'middle'; g.textAlign = 'center';
  const ws = str.map(c => g.measureText(c).width + 4), tot = ws.reduce((a, b) => a + b, 0);
  let x0 = 960 - tot / 2;
  str.forEach((ch, i) => {
    const t0 = .2 + i * .09, f = clamp((lt - t0) / 2.2, 0, 1), e = E.i2(f), cx = x0 + ws[i] / 2; x0 += ws[i];
    const x = cx + e * (700 + R(i, 3) * 500) + Math.sin(lt * 3 + i) * 30 * f, y = 842 + tilt * 420 - e * (900 + R(i, 4) * 300);
    g.save(); g.translate(x, y); g.rotate(f * (R(i, 5) - .5) * 6);
    const pet = seg(f, .25, .55, E.io2);
    g.globalAlpha = 1 - pet; g.fillStyle = C.ink; g.fillText(ch, 0, 0);
    g.globalAlpha = pet; g.fillStyle = i % 2 ? C.pink : '#FFE4EA'; g.beginPath(); g.ellipse(0, 0, 16, 8, 0, 0, TAU); g.fill();
    g.restore();
  });
  g.restore();
  drift(g, lt, 40, 'petal', { alpha: tilt, wind: .8, size: 1.3 });
  // a wall of cloud rises to fill the frame
  cloudWall(g, lt, seg(lt, 1.9, 3, E.o3), 0);
};
function cloudWall(g, lt, rise, part) {
  if (rise <= 0) return;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
    const side = i < 3 ? -1 : 1, x0 = 160 + i * 320 + (row % 2) * 140, y0 = lerp(H + 500, 260 + row * 300, E.o3(clamp(rise * 1.3 - row * .15 - R(i, row) * .1, 0, 1)));
    const x = x0 + side * part * (900 + row * 200 + R(i, row + 5) * 200);
    cloud(g, x, y0 + 260, 520 + row * 60, row === 0 ? '#EDF2FA' : row === 1 ? '#F7F9FD' : '#FFFFFF', { sa: .06, dy: 16 });
  }
  if (part < .4) { g.save(); g.globalAlpha = clamp(rise * 2 - 1, 0, 1) * (1 - part * 2.5); fill(g, vg(g, 0, H, [[0, 'rgba(255,255,255,0)'], [.35, '#F6F8FC'], [1, '#FFFFFF']])); g.restore(); }
}

/* ---------- chorus 1 (32–52): four seasons, each opening out of the last ---------- */
function springSky(g) { fill(g, vg(g, 0, H, [[0, '#A9D9F3'], [.7, '#FBDDE4'], [1, '#FEF1EC']])); }
SC.bloom = (g, lt) => {
  springSky(g);
  const op = seg(lt, .05, .75, E.ioExpo);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + .3, p = seg(lt, .35 + i * .03, .8 + i * .03, E.oBack2); if (p > 0) flower(g, 960 + Math.cos(a) * 330, 540 + Math.sin(a) * 210, 46 * p, 1, [C.pink, '#fff', C.rose][i % 3], C.gold, lt * .4); }
  const p = seg(lt, .2, .95, E.oBack);
  flower(g, 960, 540, 230 * p, p, C.pink, C.gold, lt * .3 - (1 - p) * 1.2, 8);
  cloudWall(g, lt, 1, op);
};
SC.springNap = (g, lt, u) => {
  springSky(g);
  const mo = seg(lt, 0, .8, E.io3);
  const sx = lerp(960, 1480, mo), sy = lerp(540, 220, mo), sr = lerp(60, 86, mo) * (1 + .04 * beatHit(lt));
  sunDisc(g, sx, sy, sr, C.gold, { halo: mo, haloCol: C.sun });
  // petals of the big flower fall away
  if (mo < 1) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + lt * .3, d = mo * 300; g.save(); g.globalAlpha = 1 - mo; g.translate(960 + Math.cos(a) * (130 + d), 540 + Math.sin(a) * (130 + d) + mo * 200); g.rotate(a + PI / 2 + mo * 2); g.fillStyle = C.pink; g.beginPath(); g.ellipse(0, 0, 60 * (1 - mo * .5), 120 * (1 - mo * .5), 0, 0, TAU); g.fill(); g.restore(); }
  const pan = lerp(0, -50, E.io2(u));
  g.save(); g.translate(pan, 0);
  cloud(g, 360, 240, 160); cloud(g, 1100, 160, 110, '#ffffff', { sa: .05 });
  const up = k => lerp(700, 0, E.o3(seg(lt, .1 + k * .12, .9 + k * .12)));
  g.save(); g.translate(0, up(0)); hill(g, 720, 60, .0025, 1, '#C9E8C7'); g.restore();
  g.save(); g.translate(0, up(1)); hill(g, 800, 50, .0034, 2.4, C.mint, { seed: 2 }); g.restore();
  g.save(); g.translate(0, up(2));
  hill(g, 870, 30, .002, 4, '#8FCE97', { seed: 5 });
  for (let i = 0; i < 26; i++) flower(g, (R(i, 51) * W * 1.1) - 40, 890 + R(i, 52) * 160, 10 + R(i, 53) * 8, 1, ['#fff', C.pink, C.gold][i % 3], C.gold);
  tree(g, 780, 880, 520, C.pink, '#8A5A48', { t: lt, dots: '#ffffff' });
  person(g, 960, 905, 300, POSE.stand(), LOOK.girlKid, { rot: -PI / 2, eyesClosed: true });
  // dozing z's
  for (let i = 0; i < 3; i++) { const ph = ((lt * .5 + i / 3) % 1); ktext(g, 'z', 740 + ph * 90 + Math.sin(lt * 2 + i) * 10, 780 - ph * 160, 40 + ph * 20, 1, { col: rgba('#6E4E8F', Math.sin(ph * PI)), dur: .01 }); }
  // two butterflies
  for (let b = 0; b < 2; b++) { const bx = 1180 + Math.sin(lt * 1.3 + b * 2) * 140 + b * 60, by = 640 + Math.sin(lt * 2.1 + b) * 60, fl = Math.abs(Math.sin(lt * 14 + b)); g.save(); g.translate(bx, by); g.fillStyle = b ? C.gold : C.coral; for (const d of [-1, 1]) { g.beginPath(); g.ellipse(d * 12 * fl, -6, 13 * fl, 16, d * .4, 0, TAU); g.fill(); } g.restore(); }
  g.restore();
  g.restore();
  drift(g, lt, 50, 'petal', { wind: -.4, size: 1.3 });
};
SC.grassField = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#62BDEA'], [1, '#D6F0FB']]));
  cloud(g, 300 + lt * 30, 200, 150); cloud(g, 1300 + lt * 20, 150, 120);
  hill(g, 650, 40, .002, lt * .2, '#9ED7A0'); hill(g, 760, 50, .003, 1 + lt * .3, '#7CC47E', { seed: 3 });
  hill(g, 880, 40, .0024, 2 + lt * .4, C.grass, { seed: 6 });
  // wind waves through the grass
  for (let i = 0; i < 5; i++) { const x = ((i * 520 + lt * 700) % (W + 600)) - 300; g.fillStyle = 'rgba(230,255,190,.22)'; g.beginPath(); g.ellipse(x, 960 + i % 2 * 50, 300, 22, 0, 0, TAU); g.fill(); }
  g.lineCap = 'round';
  for (let i = 0; i < 140; i++) { const x = R(i, 61) * (W + 40) - 20, b = 940 + R(i, 62) * 160, h = 50 + R(i, 63) * 70, w = Math.sin(x * .006 - lt * 4) * 22 + 12; g.strokeStyle = i % 3 ? '#5FAE55' : '#4E9A49'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, b); g.quadraticCurveTo(x + w * .3, b - h * .6, x + w, b - h); g.stroke(); }
  // the friend flies a kite
  const out = {}; person(g, 1180, 930, 300, POSE.reach(.6 + Math.sin(lt * 3) * .05), LOOK.friendKid, { dir: -1, t: lt, out });
  const kx = 620 + Math.sin(lt * 1.4) * 40, ky = 250 + Math.sin(lt * 2) * 30;
  g.strokeStyle = rgba(C.ink, .6); g.lineWidth = 2; g.beginPath(); g.moveTo(out.hand[0], out.hand[1]); g.quadraticCurveTo((kx + out.hand[0]) / 2, ky + 260, kx, ky + 60); g.stroke();
  g.save(); g.translate(kx, ky); g.rotate(Math.sin(lt * 2) * .15); g.fillStyle = C.coral; g.beginPath(); g.moveTo(0, -70); g.lineTo(52, 0); g.lineTo(0, 70); g.lineTo(-52, 0); g.closePath(); g.fill(); g.fillStyle = C.gold; g.beginPath(); g.moveTo(0, -70); g.lineTo(52, 0); g.lineTo(0, 0); g.fill(); g.beginPath(); g.moveTo(0, 70); g.lineTo(-52, 0); g.lineTo(0, 0); g.fill();
  g.strokeStyle = C.ink; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 70); for (let i = 1; i < 6; i++) g.lineTo(Math.sin(lt * 5 + i) * 14, 70 + i * 24); g.stroke(); g.restore();
};
SC.summerBeach = (g, lt, u) => {
  const sunset = seg(lt, 2.7, 3.4, E.i2);
  fill(g, vg(g, 0, 560, [[0, mix('#4FB3E8', '#E86F5A', sunset)], [1, mix('#CDEFFC', '#FFC27A', sunset)]]));
  sunDisc(g, 1500, lerp(200, 520, sunset), 80, mix('#FFF7DA', C.gold, sunset), { halo: 1, beat: beatHit(lt) });
  cloud(g, 400 + lt * 12, 200, 150); cloud(g, 1050 + lt * 8, 130, 100);
  flatSea(g, 520, mix('#3BA7DD', '#D9786A', sunset), mix('#1C6FA8', '#5E3F78', sunset), lt, { sunX: 1500, refl: .4 + .3 * sunset, reflCol: '#FFF7DA', da: .3 });
  for (let i = 0; i < 3; i++) gull(g, ((200 + i * 260 + lt * 90) % (W + 300)) - 150, 260 + i * 40 + Math.sin(lt * 2 + i) * 14, 42, lt * 9 + i, '#ffffff');
  // waves rolling in
  const push = lerp(1, 1.07, E.io2(u));
  g.save(); g.translate(1140, 850); g.scale(push, push); g.translate(-1140, -850);
  for (let b = 0; b < 3; b++) { const yy = 600 + b * 60, ph = lt * (1 + b * .3) + b; paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, yy); for (let x = -20; x <= W + 20; x += 30) g2.lineTo(x, yy + Math.sin(x * .008 + ph) * 10); g2.lineTo(W + 20, H); g2.closePath(); }, mix(['#3A9ED6', '#55B3E0', '#79C8EA'][b], '#B06A80', sunset * .6), { dy: -6, sa: .08 }); }
  const sw = Math.sin(lt * 1.6) * 24;
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 790 + sw); g2.bezierCurveTo(600, 760 + sw, 1300, 800 + sw, W + 20, 770 + sw); g2.lineTo(W + 20, H); g2.closePath(); }, '#FFFFFF', { sa: 0 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(-20, 800 + sw * .6); g2.bezierCurveTo(600, 770 + sw * .6, 1300, 810 + sw * .6, W + 20, 780 + sw * .6); g2.lineTo(W + 20, H); g2.closePath(); }, mix(C.sand, '#E9A87E', sunset), { dy: -8, sa: .1 });
  // sandcastle with two flags, footprints, the yellow cap left on the sand
  const sx = 700, sy = 900; g.fillStyle = C.sandD;
  rr(g, sx - 120, sy - 70, 240, 70, 6); g.fill(); rr(g, sx - 70, sy - 130, 140, 60, 6); g.fill();
  for (const tx of [-120, 80]) { rr(g, sx + tx, sy - 120, 40, 50, 4); g.fill(); }
  g.fillStyle = shade(C.sandD, -.15); rr(g, sx - 22, sy - 50, 44, 50, 22); g.fill();
  for (const [fx, c] of [[-100, C.coral], [100, C.gold]]) { line(g, sx + fx, sy - 120, sx + fx, sy - 200, 4, C.ink); g.fillStyle = c; g.beginPath(); g.moveTo(sx + fx, sy - 200); g.lineTo(sx + fx + 46 + Math.sin(lt * 6 + fx) * 6, sy - 186); g.lineTo(sx + fx, sy - 172); g.fill(); }
  for (let i = 0; i < 8; i++) { g.fillStyle = rgba('#C7A266', .6); g.beginPath(); g.ellipse(960 + i * 70 + (i % 2) * 10, 1010 - i * 22 + (i % 2) * 18, 12, 7, -.3, 0, TAU); g.fill(); }
  const cx = 1140, cy = 860;
  g.fillStyle = 'rgba(120,80,40,.18)'; g.beginPath(); g.ellipse(cx + 10, cy + 26, 110, 18, 0, 0, TAU); g.fill();
  g.fillStyle = C.gold; g.beginPath(); g.ellipse(cx + 70, cy + 14, 70, 16, -.05, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(cx, cy, 72, 58, 0, PI, TAU); g.closePath(); g.fill();
  g.fillStyle = shade(C.gold, -.15); g.beginPath(); g.ellipse(cx, cy, 72, 14, 0, 0, PI); g.fill(); circle(g, cx, cy - 58, 9, shade(C.gold, -.25));
  g.restore();
  drift(g, lt, 20, 'spark', { up: true, speed: .3, alpha: .4 });
};
SC.moonPeak = (g, lt, u, o = {}) => {
  const k = seg(lt, 0, .45, E.io2);
  fill(g, vg(g, 0, H, [[0, mix('#E86F5A', C.night, k)], [1, mix('#FFC27A', '#5B3F7E', k)]]));
  stars(g, lt, 200, 700, k, 6);
  const my = lerp(640, 330, seg(lt, .15, 1.3, E.o3));
  moonDisc(g, 1180, my, 160);
  const up = (i, h) => lerp(H + 300, h, seg(lt, .05 + i * .1, .7 + i * .1, E.oBack));
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(200, up(0, 640)); g2.lineTo(520, up(0, 720)); g2.lineTo(900, up(0, 600)); g2.lineTo(1500, up(0, 700)); g2.lineTo(W + 20, up(0, 620)); g2.lineTo(W + 20, H); g2.fill(); }, '#6B4F8E', { dy: -10 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(-20, H); g2.lineTo(380, up(1, 760)); g2.lineTo(760, up(1, 820)); g2.lineTo(1260, up(1, 740)); g2.lineTo(W + 20, up(1, 830)); g2.lineTo(W + 20, H); g2.fill(); }, '#4B3970', { dy: -10 });
  paper(g, g2 => { g2.beginPath(); g2.moveTo(380, H); g2.lineTo(700, up(2, 690)); g2.lineTo(760, up(2, 680)); g2.lineTo(1100, H); g2.fill(); }, '#2E2453', { dy: -10 });
  const py = up(2, 690);
  if (o.adults) { person(g, 700, py + 4, 150, POSE.look(), LOOK.girl, { t: lt, wind: 1 }); person(g, 770, py + 2, 156, POSE.look(), LOOK.friend, { t: lt, dir: -1 }); }
  else person(g, 726, py, 150, POSE.look(), LOOK.girlKid, { t: lt, wind: 1 });
};
SC.reunionTable = (g, lt, u, o = {}) => {
  fill(g, '#4A2E4E');
  for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#52344F' : '#4A2E4E'; g.fillRect(0, i * 130 - 20, W, 130); }
  const rot = lt * .06 - .1;
  g.save(); g.translate(960, 540); g.rotate(rot);
  circle(g, 14, 22, 430, 'rgba(15,5,20,.35)');
  circle(g, 0, 0, 430, '#B97A4C'); circle(g, 0, 0, 404, '#C98B5A'); ring(g, 0, 0, 300, 3, 'rgba(120,70,40,.25)'); ring(g, 0, 0, 200, 3, 'rgba(120,70,40,.2)');
  // mooncakes on a plate
  circle(g, 0, 0, 130, '#F4ECE0'); ring(g, 0, 0, 112, 3, '#D7C6AE');
  for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .4, x = Math.cos(a) * 58, y = Math.sin(a) * 58; circle(g, x, y, 42, '#D99A4E'); ring(g, x, y, 30, 4, '#B9783A'); flower(g, x, y, 14, 1, '#E6B060', '#B9783A', 0, 5); }
  // two places
  const clink = o.full ? seg(lt, 4.3, 4.7, E.io3) * (1 - seg(lt, 5.1, 5.6, E.io3)) : 0;
  for (const side of [-1, 1]) {
    const px = side * 270;
    circle(g, px, 0, 78, '#F7F1E6'); circle(g, px, 0, 60, '#EADFCD');
    line(g, px + side * -8, 96, px + side * -8, 200, 7, '#6B3E2E'); line(g, px + side * 10, 96, px + side * 10, 200, 7, '#6B3E2E');
    const cxp = px - side * clink * 200, cyp = -150 - clink * 40;
    circle(g, cxp, cyp, 46, '#F7F1E6'); circle(g, cxp, cyp, 36, side < 0 ? '#9C6B3A' : '#B98A55');
    if (side < 0 || o.full) circle(g, cxp - 8, cyp - 8, 10, '#FFF1C9'); // the moon in the tea
  }
  // her hands at her place; the other place stays empty
  const pk = seg(lt, .1, .8, E.o3);
  for (const dy of [-110, 110]) { g.fillStyle = o.full ? '#3C4F86' : C.coral; rr(g, -560 - (1 - pk) * 200, dy - 32, 160, 64, 30); g.fill(); circle(g, -400 - (1 - pk) * 200, dy, 34, C.skin); }
  if (o.full) for (const dy of [-110, 110]) { g.fillStyle = C.teal; rr(g, 400, dy - 32, 160, 64, 30); g.fill(); circle(g, 400, dy, 34, C.skin); }
  if (clink > .9) { g.save(); g.translate(0, -190); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; line(g, Math.cos(a) * 50, Math.sin(a) * 50, Math.cos(a) * 80, Math.sin(a) * 80, 6, C.gold); } g.restore(); }
  g.restore();
  // a maple leaf drifts down and settles on the empty place
  if (!o.full) {
  const lk = seg(lt, .5, 2.6, E.o3), ang0 = rot, lx = lerp(1500, 960 + Math.cos(ang0) * 270, lk) + Math.sin(lt * 3) * 60 * (1 - lk), ly = lerp(-60, 540 + Math.sin(ang0) * 270, lk);
  g.save(); g.translate(lx + 10, ly + 14 + (1 - lk) * 40); g.globalAlpha = .25 * lk; g.rotate(lt * 2 * (1 - lk)); mapleLeaf(g, 0, 0, 60, '#000'); g.restore();
  g.save(); g.translate(lx, ly); g.rotate(lt * 2 * (1 - lk) + .3); mapleLeaf(g, 0, 0, 60, C.maple); g.restore();
  }
  drift(g, lt, 18, 'leaf', { wind: -1.2, size: 2, speed: .6 });
};
function mapleLeaf(g, x, y, s, col) {
  g.save(); g.translate(x, y); g.scale(s / 100, s / 100); g.fillStyle = col; g.beginPath();
  const pts = [[0, -100], [18, -48], [62, -66], [48, -18], [96, -4], [52, 22], [64, 62], [14, 42], [0, 90], [-14, 42], [-64, 62], [-52, 22], [-96, -4], [-48, -18], [-62, -66], [-18, -48]];
  pts.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath(); g.fill();
  g.strokeStyle = shade(col, -.25); g.lineWidth = 5; g.beginPath(); g.moveTo(0, 120); g.lineTo(0, -60); g.stroke();
  g.restore();
}
function pine(g, x, y, s, snowy) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#6B4636'; g.fillRect(-.05, -.15, .1, .15);
  for (let i = 0; i < 3; i++) { const yy = -.15 - i * .28, w = .5 - i * .12; g.fillStyle = '#3F7A6A'; g.beginPath(); g.moveTo(-w, yy); g.lineTo(0, yy - .45); g.lineTo(w, yy); g.fill(); if (snowy) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(-w * .55, yy - .2); g.lineTo(0, yy - .45); g.lineTo(w * .55, yy - .2); g.quadraticCurveTo(0, yy - .14, -w * .55, yy - .2); g.fill(); } }
  g.restore();
}
SC.winterSnow = (g, lt, u) => {
  fill(g, vg(g, 0, H, [[0, '#A9BEDD'], [1, '#EEF3FA']]));
  sunDisc(g, 1400, 260, 80, '#FFF6E0', { halo: .7 });
  const z = lerp(1, 1.05, E.io2(u));
  g.save(); g.translate(960, 700); g.scale(z, z); g.translate(-960, -700);
  hill(g, 640, 40, .0022, 1, '#DCE6F3'); hill(g, 760, 40, .003, 3, '#E9EFF8', { seed: 4 });
  for (let i = 0; i < 7; i++) pine(g, 120 + i * 290 + (i % 2) * 60, 700 + (i % 3) * 20, 170 + (i % 2) * 40, true);
  hill(g, 880, 26, .0018, 2, '#FFFFFF', { seed: 8 });
  // snowman and the girl in a scarf
  circle(g, 1260, 860, 80, '#fff'); circle(g, 1260, 760, 56, '#fff'); circle(g, 1260, 690, 40, '#fff');
  circle(g, 1274, 682, 5, C.ink); g.fillStyle = C.orange; g.beginPath(); g.moveTo(1290, 692); g.lineTo(1332, 698); g.lineTo(1290, 704); g.fill();
  g.fillStyle = C.gold; g.beginPath(); g.ellipse(1260, 656, 50, 10, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(1260, 650, 34, 30, 0, PI, TAU); g.fill();
  line(g, 1210, 760, 1150, 720, 6, '#6B4636'); line(g, 1310, 760, 1370, 720, 6, '#6B4636');
  const look = Object.assign({}, LOOK.girlKid, { scarf: '#FFFFFF', top: C.coral });
  person(g, 1080, 930, 320, POSE.reach(.4 + .1 * Math.sin(lt * 2)), look, { t: lt });
  for (let i = 0; i < 3; i++) { const ph = (lt * .8 + i / 3) % 1; circle(g, 1150 + ph * 40, 700 - ph * 40, 10 + ph * 16, rgba('#ffffff', .7 * (1 - ph))); }
  g.restore();
  drift(g, lt, 160, 'snow', { speed: .8, size: 1.2 });
};
SC.clock = (g, lt, u) => {
  const k = seg(lt, 0, .9, E.io3);
  if (k < 1) { SC.winterSnow(g, lt + 2.2, 1, {}); }
  g.save(); g.globalAlpha = k; fill(g, vg(g, 0, H, [[0, C.night], [1, C.night2]])); stars(g, lt, 160, H, .8, 9); g.restore();
  const cx = lerp(1400, 960, k), cy = lerp(260, 500, k), r = lerp(80, 330, k);
  const dark = seg(lt, 2.2, 2.8, E.io3);
  // season ring
  const sc = [C.pink, C.sky, C.orange, C.ice], spin = lt * lt * 1.2;
  for (let i = 0; i < 4; i++) { g.strokeStyle = sc[i]; g.lineWidth = 26 * k * (1 - dark); g.beginPath(); g.arc(cx, cy, r + 46, spin + i * TAU / 4 + .06, spin + (i + 1) * TAU / 4 - .06); g.stroke(); }
  circle(g, cx, cy, r + 14, mix('#2B3A67', C.ink, dark));
  circle(g, cx, cy, r, mix(mix('#FFF6E0', C.cream, k), C.ink, dark));
  if (dark < 1) {
    g.save(); g.globalAlpha = 1 - dark;
    for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, l = i % 5 ? 10 : 30; line(g, cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9, cx + Math.cos(a) * (r * .9 - l * k), cy + Math.sin(a) * (r * .9 - l * k), i % 5 ? 3 : 7, C.ink); }
    const ma = -PI / 2 + lt * lt * 4.5, ha = -PI / 2 + lt * lt * .4;
    for (let j = 1; j <= 6; j++) { const aa = ma - j * .06 * Math.min(1, lt); line(g, cx, cy, cx + Math.cos(aa) * r * .75, cy + Math.sin(aa) * r * .75, 12, rgba(C.coral, .12)); }
    line(g, cx, cy, cx + Math.cos(ha) * r * .5, cy + Math.sin(ha) * r * .5, 18, C.ink);
    line(g, cx, cy, cx + Math.cos(ma) * r * .75, cy + Math.sin(ma) * r * .75, 10, C.coral);
    circle(g, cx, cy, 18, C.ink);
    // icons orbiting
    const ic = [(x, y) => flower(g, x, y, 22, 1, C.pink, C.gold), (x, y) => sunDisc(g, x, y, 18, C.gold, { halo: 0 }), (x, y) => mapleLeaf(g, x, y, 40, C.maple), (x, y) => sparkle(g, x, y, 22, '#ffffff')];
    for (let i = 0; i < 4; i++) { const a = -spin * .5 + i * TAU / 4; ic[i](cx + Math.cos(a) * (r + 110) * k, cy + Math.sin(a) * (r + 110) * k); }
    g.restore();
  }
};
