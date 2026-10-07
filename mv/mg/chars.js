'use strict';
/* ---------- characters: flat side-view rig, front view, profiles, hands ---------- */
const POSE = {
  stand: () => ({ t1: .03, k1: 0, t2: -.04, k2: 0, a1: .12, e1: .1, a2: -.1, e2: .08, lean: 0 }),
  walk: p => ({ t1: .42 * Math.sin(p), k1: Math.max(0, .7 * Math.sin(p + 1.9)), t2: -.42 * Math.sin(p), k2: Math.max(0, .7 * Math.sin(p + 1.9 + PI)), a1: -.4 * Math.sin(p), e1: .3, a2: .4 * Math.sin(p), e2: .3, lean: .04, hipY: -.012 * Math.abs(Math.cos(p)) }),
  run: p => ({ t1: .95 * Math.sin(p), k1: Math.max(0, 1.4 * Math.sin(p + 1.6)) + .25, t2: -.95 * Math.sin(p), k2: Math.max(0, 1.4 * Math.sin(p + 1.6 + PI)) + .25, a1: -1.0 * Math.sin(p), e1: 1.5, a2: 1.0 * Math.sin(p), e2: 1.5, lean: .26, hipY: -.035 * Math.abs(Math.cos(p)) }),
  sit: () => ({ t1: 1.5, k1: 1.45, t2: 1.42, k2: 1.3, a1: .5, e1: .5, a2: .35, e2: .6, lean: -.06, hipY: .48 }),
  sitChair: () => ({ t1: 1.45, k1: 1.45, t2: 1.4, k2: 1.4, a1: .9, e1: .7, a2: .8, e2: .8, lean: .05, hipY: .22 }),
  lie: () => ({ t1: .05, k1: .1, t2: -.05, k2: .2, a1: 2.6, e1: .6, a2: 2.4, e2: .7, lean: 0 }),
  wave: (f, t) => ({ t1: .03, k1: 0, t2: -.04, k2: 0, a1: lerp(.12, 2.75, f), e1: f * (.35 + .45 * Math.sin(t * 9)), a2: -.1, e2: .08, lean: 0 }),
  reach: f => ({ t1: .05, k1: 0, t2: -.12, k2: .05, a1: lerp(.12, 1.6, f), e1: .05, a2: lerp(-.1, 1.3, f), e2: .1, lean: .1 * f }),
  look: () => ({ t1: .03, k1: 0, t2: -.04, k2: 0, a1: .15, e1: .1, a2: -.1, e2: .05, lean: -.1, head: -.35 }),
  stop: () => ({ t1: .25, k1: .1, t2: -.15, k2: .2, a1: .1, e1: .1, a2: -.05, e2: .1, lean: -.05, head: .25 }),
  leap: f => ({ t1: lerp(.9, 1.2, f), k1: lerp(.2, 1.6, f), t2: lerp(-1.1, -.3, f), k2: lerp(.3, 1.4, f), a1: lerp(-.8, 2.2, f), e1: .3, a2: lerp(1, 2.6, f), e2: .3, lean: lerp(.4, .1, f) }),
};
const lerpPose = (A, B, k) => { const o = {}; for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) o[key] = lerp(A[key] || 0, B[key] || 0, k); return o; };

// side view; faces +x (use o.dir = -1 to face left). y is the ground.
function person(g, x, y, s, P, L, o = {}) {
  g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(o.dir || 1, 1);
  if (o.alpha != null) g.globalAlpha *= o.alpha;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const kid = L.kid, kl = kid ? .72 : 1, kt = kid ? .8 : 1, kh = kid ? 1.42 : 1, hs = s * kh;
  const lean = P.lean || 0;
  const hip = [0, (-.48 + (P.hipY || 0)) * kl * s];
  const sh = [hip[0] + Math.sin(lean) * .3 * kt * s, hip[1] - Math.cos(lean) * .3 * kt * s];
  const hl = lean + (P.head || 0), hoff = .05 * kt + .066 * kh;
  const hd = [sh[0] + Math.sin(hl) * hoff * s, sh[1] - Math.cos(hl) * hoff * s];
  const sil = o.sil; // silhouette colour overrides everything
  const col = c => sil || c;
  const limb = (p0, a1, l1, a2, l2, w, c) => {
    const k = [p0[0] + Math.sin(a1) * l1 * s, p0[1] + Math.cos(a1) * l1 * s], e = [k[0] + Math.sin(a2) * l2 * s, k[1] + Math.cos(a2) * l2 * s];
    g.strokeStyle = c; g.lineWidth = w * s; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(k[0], k[1]); g.lineTo(e[0], e[1]); g.stroke(); return e;
  };
  const foot = (e, a, c) => { g.fillStyle = c; g.save(); g.translate(e[0], e[1]); g.rotate(-a * .5); g.beginPath(); g.ellipse(.025 * s, 0, .05 * s, .026 * s, 0, 0, TAU); g.fill(); g.restore(); };
  const dk = c => sil || shade(c, -.18);
  // back limbs
  const bl = limb(hip, P.t2, .25 * kl, P.t2 - P.k2, .26 * kl, .068, dk(L.bottom)); foot(bl, P.t2 - P.k2, dk(L.shoe));
  const bh = limb(sh, P.a2, .165 * kt, P.a2 + P.e2, .16 * kt, .05, dk(L.top)); circle(g, bh[0], bh[1], .028 * s, dk(L.skin));
  // torso
  g.strokeStyle = col(L.top); g.lineWidth = .15 * s; g.beginPath(); g.moveTo(hip[0], hip[1] - .02 * s); g.lineTo(sh[0], sh[1] + .03 * s); g.stroke();
  if (L.dress) { const dl = .2 * kl, sw = Math.sin((o.t || 0) * 5) * .015 * s; g.fillStyle = col(L.top); g.beginPath(); g.moveTo(hip[0] - .07 * s, hip[1] - .06 * s); g.lineTo(hip[0] + .08 * s, hip[1] - .06 * s); g.lineTo(hip[0] + .14 * s + sw, hip[1] + dl * s); g.quadraticCurveTo(hip[0], hip[1] + (dl + .03) * s, hip[0] - .13 * s + sw, hip[1] + dl * s); g.closePath(); g.fill(); }
  if (L.coat) { const sw = Math.sin((o.t || 0) * 4) * .02 * s; g.fillStyle = col(L.top); g.beginPath(); g.moveTo(sh[0] - .07 * s, sh[1]); g.lineTo(sh[0] + .07 * s, sh[1]); g.lineTo(hip[0] + .1 * s, hip[1] + .17 * s); g.lineTo(hip[0] - .12 * s - sw, hip[1] + .17 * s); g.closePath(); g.fill(); }
  // front limbs
  const fl = limb(hip, P.t1, .25 * kl, P.t1 - P.k1, .26 * kl, .072, col(L.bottom)); foot(fl, P.t1 - P.k1, col(L.shoe));
  // neck + head
  g.strokeStyle = col(L.skin); g.lineWidth = .05 * s; g.beginPath(); g.moveTo(sh[0], sh[1]); g.lineTo(hd[0], hd[1] + .04 * s); g.stroke();
  if (L.scarf) { g.strokeStyle = col(L.scarf); g.lineWidth = .06 * s; g.beginPath(); g.moveTo(sh[0] - .04 * s, sh[1] - .02 * s); g.lineTo(sh[0] + .04 * s, sh[1] - .025 * s); g.stroke(); g.lineWidth = .04 * s; g.beginPath(); g.moveTo(sh[0] - .03 * s, sh[1] - .02 * s); for (let i = 1; i <= 4; i++) g.lineTo(sh[0] - .03 * s - i * .045 * s, sh[1] - .02 * s + Math.sin((o.t || 0) * 8 + i) * .018 * s + i * .012 * s); g.stroke(); }
  circle(g, hd[0], hd[1] - .015 * hs, .066 * hs, col(L.skin));
  const hx = hd[0], hy = hd[1] - .015 * hs;
  if (L.hairStyle === 'bob') {
    const fl2 = Math.sin((o.t || 0) * 3) * .008 * hs + (o.wind || 0) * .03 * hs;
    g.fillStyle = col(L.hair); g.beginPath();
    g.moveTo(hx + .06 * hs, hy - .02 * hs);
    g.bezierCurveTo(hx + .07 * hs, hy - .1 * hs, hx - .06 * hs, hy - .11 * hs, hx - .08 * hs - fl2, hy - .02 * hs);
    g.bezierCurveTo(hx - .09 * hs - fl2, hy + .04 * hs, hx - .08 * hs - fl2 * 1.5, hy + .075 * hs, hx - .05 * hs - fl2 * 1.5, hy + .08 * hs);
    g.lineTo(hx - .005 * hs, hy + .04 * hs); g.quadraticCurveTo(hx + .01 * hs, hy - .03 * hs, hx + .06 * hs, hy - .02 * hs); g.fill();
  } else {
    g.fillStyle = col(L.hair); g.beginPath(); g.arc(hx - .005 * hs, hy - .008 * hs, .068 * hs, PI * .82, PI * 1.95); g.quadraticCurveTo(hx + .02 * hs, hy - .03 * hs, hx - .03 * hs, hy + .02 * hs); g.closePath(); g.fill();
  }
  if (L.cap) { g.fillStyle = col(L.cap); g.beginPath(); g.arc(hx, hy - .012 * hs, .07 * hs, PI * 1.02, PI * 1.98); g.closePath(); g.fill(); g.beginPath(); g.ellipse(hx + .075 * hs, hy - .02 * hs, .055 * hs, .014 * hs, .08, 0, TAU); g.fill(); circle(g, hx, hy - .083 * hs, .01 * hs, col(shade(L.cap, -.2))); }
  if (!sil && o.face !== false) {
    if (o.eyesClosed) { g.strokeStyle = C.hair; g.lineWidth = .008 * hs; g.beginPath(); g.arc(hx + .036 * hs, hy + .002 * hs, .01 * hs, .2, PI - .2); g.stroke(); }
    else circle(g, hx + .038 * hs, hy, .009 * hs, C.hair);
    if (L.blush) circle(g, hx + .03 * hs, hy + .028 * hs, .012 * hs, rgba(C.rose, .6));
  }
  // front arm last
  const fh = limb(sh, P.a1, .165 * kt, P.a1 + P.e1, .16 * kt, .055, col(L.top)); circle(g, fh[0], fh[1], .03 * s, col(L.skin));
  if (o.out) { const d = o.dir || 1; o.out.hand = [x + fh[0] * d, y + fh[1]]; o.out.hand2 = [x + bh[0] * d, y + bh[1]]; o.out.head = [x + hx * d, y + hy]; o.out.top = y + hy - .07 * hs; }
  g.restore();
}

// front view, arms given as angles from straight down (0) to straight up (PI), mirrored
function personFront(g, x, y, s, L, o = {}) {
  g.save(); g.translate(x, y); if (o.alpha != null) g.globalAlpha *= o.alpha; g.lineCap = 'round'; g.lineJoin = 'round';
  const kid = L.kid, kl = kid ? .72 : 1, kt = kid ? .8 : 1, kh = kid ? 1.42 : 1, hs = s * kh, sil = o.sil, col = c => sil || c;
  const hip = -.48 * kl * s, sh = hip - .3 * kt * s, hy = sh - (.05 * kt + .066 * kh) * s - .015 * hs;
  const aL = o.armL ?? .15, aR = o.armR ?? .15, t = o.t || 0;
  // legs
  g.strokeStyle = col(L.bottom); g.lineWidth = .075 * s;
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * .04 * s, hip); g.lineTo(d * .055 * s, -.02 * s); g.stroke(); g.fillStyle = col(L.shoe); g.beginPath(); g.ellipse(d * .06 * s, -.01 * s, .045 * s, .025 * s, 0, 0, TAU); g.fill(); }
  // arms
  const arm = (d, a) => { const ex = d * .085 * s + d * Math.sin(a) * .16 * kt * s, ey = sh + .02 * s + Math.cos(a) * .16 * kt * s, a2 = a + (o.bend ?? .15), hx = ex + d * Math.sin(a2) * .15 * kt * s, hy2 = ey + Math.cos(a2) * .15 * kt * s; g.strokeStyle = col(L.top); g.lineWidth = .055 * s; g.beginPath(); g.moveTo(d * .07 * s, sh + .02 * s); g.lineTo(ex, ey); g.lineTo(hx, hy2); g.stroke(); circle(g, hx, hy2, .03 * s, col(L.skin)); return [hx, hy2]; };
  // torso
  const tw = .085 * s; g.fillStyle = col(L.top); g.beginPath(); g.roundRect(-tw, sh - .01 * s, tw * 2, hip - sh + .03 * s, .05 * s); g.fill();
  if (L.dress) { g.beginPath(); g.moveTo(-tw, hip - .08 * s); g.lineTo(tw, hip - .08 * s); g.lineTo(tw + .07 * s + Math.sin(t * 4) * .01 * s, hip + .18 * kl * s); g.lineTo(-tw - .07 * s, hip + .18 * kl * s); g.closePath(); g.fill(); }
  if (L.coat) { g.beginPath(); g.moveTo(-tw, sh); g.lineTo(tw, sh); g.lineTo(tw + .04 * s, hip + .16 * s); g.lineTo(-tw - .04 * s, hip + .16 * s); g.closePath(); g.fill(); }
  const hL = arm(-1, aL), hR = arm(1, aR);
  // head
  g.strokeStyle = col(L.skin); g.lineWidth = .05 * s; g.beginPath(); g.moveTo(0, sh); g.lineTo(0, hy + .05 * hs); g.stroke();
  if (L.scarf) { g.fillStyle = col(L.scarf); g.beginPath(); g.roundRect(-.07 * s, sh - .035 * s, .14 * s, .05 * s, .02 * s); g.fill(); g.fillRect(.02 * s, sh, .035 * s, .12 * s); }
  if (L.hairStyle === 'bob') { g.fillStyle = col(L.hair); g.beginPath(); g.ellipse(0, hy + .01 * hs, .085 * hs, .085 * hs, 0, PI, TAU); g.lineTo(.088 * hs, hy + .07 * hs); g.lineTo(-.088 * hs, hy + .07 * hs); g.closePath(); g.fill(); }
  circle(g, 0, hy, .066 * hs, col(L.skin));
  if (o.back) circle(g, 0, hy - .004 * hs, .068 * hs, col(L.hair));
  else if (L.hairStyle === 'bob') { g.fillStyle = col(L.hair); g.beginPath(); g.ellipse(0, hy - .015 * hs, .075 * hs, .06 * hs, 0, PI, TAU); g.quadraticCurveTo(.03 * hs, hy - .03 * hs, -.075 * hs, hy - .01 * hs); g.fill(); }
  else if (!o.back) { g.fillStyle = col(L.hair); g.beginPath(); g.ellipse(0, hy - .02 * hs, .07 * hs, .055 * hs, 0, PI, TAU); g.fill(); }
  if (L.cap) { g.fillStyle = col(L.cap); g.beginPath(); g.ellipse(0, hy - .03 * hs, .072 * hs, .06 * hs, 0, PI, TAU); g.fill(); g.beginPath(); g.ellipse(0, hy - .028 * hs, .085 * hs, .018 * hs, 0, 0, TAU); g.fill(); }
  if (!sil && o.face !== false) { for (const d of [-1, 1]) circle(g, d * .024 * hs, hy + .005 * hs, .008 * hs, C.hair); if (L.blush) for (const d of [-1, 1]) circle(g, d * .04 * hs, hy + .025 * hs, .011 * hs, rgba(C.rose, .6)); if (o.smile) { g.strokeStyle = C.hair; g.lineWidth = .006 * hs; g.beginPath(); g.arc(0, hy + .02 * hs, .014 * hs, .3, PI - .3); g.stroke(); } }
  if (o.out) { o.out.handL = [x + hL[0], y + hL[1]]; o.out.handR = [x + hR[0], y + hR[1]]; o.out.head = [x, y + hy]; }
  g.restore();
}

/* big side profiles, facing +x in unit space (head ~ 1 unit tall) */
function adultProfilePath(g) {
  g.beginPath();
  g.moveTo(-.55, 1.25); g.lineTo(-.3, .78);
  g.bezierCurveTo(-.2, .7, -.12, .66, -.08, .6);
  g.bezierCurveTo(-.38, .55, -.5, .05, -.28, -.32);
  g.bezierCurveTo(-.12, -.58, .24, -.52, .34, -.26);
  g.lineTo(.37, -.06); g.bezierCurveTo(.4, -.01, .42, .01, .4, .04);
  g.lineTo(.5, .2); g.bezierCurveTo(.5, .23, .46, .245, .42, .245);
  g.lineTo(.43, .29); g.lineTo(.4, .315); g.lineTo(.425, .35);
  g.bezierCurveTo(.4, .42, .37, .47, .3, .49);
  g.bezierCurveTo(.2, .51, .13, .5, .11, .56);
  g.lineTo(.14, .8); g.bezierCurveTo(.3, .86, .55, .95, .7, 1.25); g.closePath();
}
function kidProfilePath(g) {
  g.beginPath();
  g.moveTo(-.6, 1.25); g.lineTo(-.36, .86);
  g.bezierCurveTo(-.24, .74, -.16, .68, -.13, .6);
  g.bezierCurveTo(-.5, .52, -.62, 0, -.38, -.38);
  g.bezierCurveTo(-.15, -.68, .3, -.6, .38, -.25);
  g.lineTo(.4, -.02); g.bezierCurveTo(.44, .04, .48, .1, .45, .14);
  g.lineTo(.4, .16); g.lineTo(.41, .22); g.lineTo(.39, .245); g.lineTo(.405, .275);
  g.bezierCurveTo(.39, .36, .3, .42, .2, .42);
  g.bezierCurveTo(.12, .43, .08, .48, .08, .55);
  g.lineTo(.1, .8); g.bezierCurveTo(.25, .86, .5, .95, .62, 1.25); g.closePath();
}
function capPath(g) { g.beginPath(); g.moveTo(-.48, -.06); g.bezierCurveTo(-.53, -.68, .27, -.76, .41, -.24); g.lineTo(.74, -.2); g.quadraticCurveTo(.76, -.15, .7, -.14); g.lineTo(.36, -.15); g.quadraticCurveTo(-.05, -.13, -.48, -.02); g.closePath(); }
function bobPath(g) { g.beginPath(); g.moveTo(.34, -.3); g.bezierCurveTo(.2, -.62, -.42, -.62, -.48, -.1); g.bezierCurveTo(-.52, .22, -.46, .5, -.34, .6); g.lineTo(-.06, .52); g.bezierCurveTo(-.02, .12, .18, -.04, .37, -.12); g.closePath(); }
// layered paper profile. who: 'kid' (friend as a child), 'adult' (friend grown up), 'girl'
function profile(g, x, y, s, who, o = {}) {
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s); if (o.alpha != null) g.globalAlpha *= o.alpha;
  const body = who === 'kid' ? kidProfilePath : adultProfilePath;
  const layers = o.layers || [];
  layers.forEach((c, i) => { g.save(); const k = 1 + (layers.length - i) * .045; g.translate(-.04 * (layers.length - i), .02 * (layers.length - i)); g.scale(k, k); body(g); g.fillStyle = c; g.fill(); g.restore(); });
  body(g); g.fillStyle = o.col || C.ink; g.fill();
  if (who === 'girl') { g.fillStyle = o.hairCol || o.col || C.hair; bobPath(g); g.fill(); }
  if (who !== 'girl' && o.cap !== false) { capPath(g); g.fillStyle = o.capCol || C.gold; g.fill(); }
  if (o.rim) { g.save(); g.beginPath(); g.rect(.15, -.42, 1, .9); g.clip(); g.strokeStyle = o.rim; g.lineWidth = .016; body(g); g.stroke(); g.restore(); }
  if (o.eye != null) { g.strokeStyle = o.eyeCol || 'rgba(255,245,228,.85)'; g.lineWidth = .014; g.lineCap = 'round'; g.beginPath(); const ex = who === 'kid' ? .27 : .25, ey = who === 'kid' ? .02 : .05; if (o.eye < .5) { g.moveTo(ex - .05, ey); g.quadraticCurveTo(ex, ey + .035, ex + .05, ey); } else { g.moveTo(ex - .05, ey + .01); g.quadraticCurveTo(ex, ey - .025, ex + .05, ey + .01); } g.stroke(); }
  g.restore();
}

// a stylised hand seen from the side: palm, four fingers, thumb. curl 0 = open, 1 = fist; pinky 0..1 extends the little finger
function hand(g, x, y, s, ang, L, o = {}) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s * (o.flip ? -1 : 1));
  g.lineCap = 'round'; g.lineJoin = 'round';
  const skin = o.skin || L.skin, sl = o.sleeve || L.top;
  // sleeve + wrist
  g.fillStyle = sl; g.beginPath(); g.moveTo(-3, -.36); g.lineTo(-.55, -.3); g.lineTo(-.55, .3); g.lineTo(-3, .36); g.closePath(); g.fill();
  g.fillStyle = shade(sl, -.15); g.fillRect(-.62, -.32, .1, .64);
  g.fillStyle = skin; g.beginPath(); g.moveTo(-.55, -.24); g.quadraticCurveTo(-.1, -.3, .25, -.22); g.quadraticCurveTo(.4, -.05, .3, .22); g.quadraticCurveTo(-.1, .3, -.55, .24); g.closePath(); g.fill();
  const curl = o.curl ?? 0, pk = o.pinky ?? 0;
  g.strokeStyle = skin;
  for (let i = 0; i < 4; i++) {
    const isP = i === 3, c = isP ? curl * (1 - pk) : curl, w = .13 - i * .012, by = -.15 + i * .1, len = .42 - Math.abs(i - 1) * .05 - (isP ? .08 : 0);
    g.lineWidth = w; g.beginPath(); g.moveTo(.25, by); const a = c * 2.2; const mx = .25 + Math.cos(a * .5) * len * .5, my = by + Math.sin(a * .5) * len * .5; g.lineTo(mx, my); g.lineTo(mx + Math.cos(a) * len * .5, my + Math.sin(a) * len * .5); g.stroke();
  }
  g.lineWidth = .13; const tc = o.thumb ?? curl; g.beginPath(); g.moveTo(.05, -.22); g.quadraticCurveTo(.25, -.42 + tc * .2, .38 - tc * .12, -.36 + tc * .22); g.stroke();
  g.restore();
}

/* ---------- props ---------- */
function gull(g, x, y, s, flap, col = C.cream, o = {}) {
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s); const k = Math.sin(flap);
  g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, .55, .17, 0, 0, TAU); g.fill();
  g.beginPath(); g.arc(.48, -.08, .14, 0, TAU); g.fill();
  g.fillStyle = C.gold; g.beginPath(); g.moveTo(.6, -.08); g.lineTo(.8, -.04); g.lineTo(.6, -.01); g.fill();
  g.fillStyle = col; g.beginPath(); g.moveTo(-.1, -.05); g.quadraticCurveTo(-.3, -.6 - .5 * k, -.75, -.35 - .9 * k); g.quadraticCurveTo(-.2, -.25 - .2 * k, .2, -.05); g.fill();
  g.fillStyle = shade(col, -.12); g.beginPath(); g.moveTo(-.5, 0); g.lineTo(-.8, -.1); g.lineTo(-.75, .08); g.fill();
  circle(g, .52, -.1, .025, C.ink);
  g.restore();
}
function sailboat(g, x, y, s, hull = C.coral, sail = C.cream, rock = 0) {
  g.save(); g.translate(x, y); g.rotate(rock); g.scale(s, s);
  g.fillStyle = hull; g.beginPath(); g.moveTo(-1, -.2); g.lineTo(1.05, -.2); g.quadraticCurveTo(.9, .2, .7, .22); g.lineTo(-.75, .22); g.quadraticCurveTo(-.9, .1, -1, -.2); g.fill();
  g.strokeStyle = C.ink; g.lineWidth = .04; g.beginPath(); g.moveTo(.05, -.2); g.lineTo(.05, -1.6); g.stroke();
  g.fillStyle = sail; g.beginPath(); g.moveTo(.1, -1.55); g.quadraticCurveTo(.75, -.9, .85, -.32); g.lineTo(.1, -.32); g.fill();
  g.fillStyle = shade(sail, -.1); g.beginPath(); g.moveTo(0, -1.4); g.lineTo(-.6, -.35); g.lineTo(0, -.35); g.fill();
  g.restore();
}
function flower(g, x, y, s, open, col = C.pink, center = C.gold, rot = 0, n = 6) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  for (let i = 0; i < n; i++) { g.save(); g.rotate(i / n * TAU); const e = open; g.fillStyle = i % 2 ? col : shade(col, -.06); g.beginPath(); g.ellipse(0, -.55 * e, .28, .55 * e + .02, 0, 0, TAU); g.fill(); g.restore(); }
  circle(g, 0, 0, .26, center); circle(g, -.06, -.06, .08, shade(center, .4));
  g.restore();
}
function tree(g, x, y, s, crown, trunk = '#7A5240', o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = trunk; g.beginPath(); g.moveTo(-.07, 0); g.lineTo(-.04, -.6); g.lineTo(.04, -.6); g.lineTo(.07, 0); g.fill();
  const sw = Math.sin((o.t || 0) * 1.2) * .02;
  const blob = (bx, by, r, c) => { circle(g, bx + sw, by, r, c); };
  blob(0, -.85, .42, shade(crown, -.12)); blob(-.3, -.7, .3, crown); blob(.32, -.72, .3, shade(crown, -.05)); blob(0, -1.05, .32, shade(crown, .08)); blob(-.12, -.82, .3, crown);
  if (o.dots) for (let i = 0; i < 14; i++) circle(g, (R(i, 41) - .5) * .8 + sw, -.6 - R(i, 42) * .65, .035, o.dots);
  g.restore();
}
function moonDisc(g, x, y, r, o = {}) {
  sunDisc(g, x, y, r, o.col || '#FFF1C9', { halo: o.halo ?? .8, haloCol: '#FFF1C9' });
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
  for (const [cx, cy, cr] of [[-.3, -.2, .16], [.25, .15, .12], [.05, -.38, .08], [-.12, .32, .1]]) circle(g, x + cx * r, y + cy * r, cr * r, 'rgba(225,190,120,.35)');
  if (o.phase != null) { const p = o.phase; circle(g, x + lerp(2.1, 0, p) * r * (o.wax ? -1 : 1), y, r * 1.02, o.sky || C.night); }
  g.restore();
}
// a fist seen from the side with the little finger out, facing +x; vflip mirrors it top-to-bottom
function pinkyFist(g, x, y, s, L, o = {}) {
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s * (o.vflip ? -1 : 1)); g.lineCap = 'round'; g.lineJoin = 'round';
  const skin = L.skin, sd = C.skinD, sl = L.top;
  g.fillStyle = sl; rr(g, -4.2, -.78, 3.3, 1.56, .2); g.fill();
  g.fillStyle = shade(sl, -.15); rr(g, -1.05, -.84, .28, 1.68, .12); g.fill();
  g.fillStyle = skin; rr(g, -.9, -.66, 1.3, 1.32, .45); g.fill();
  // curled fingers
  for (let i = 0; i < 3; i++) { circle(g, .42, -.42 + i * .36, .22, skin); }
  g.strokeStyle = sd; g.lineWidth = .05;
  for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo(.18, -.42 + i * .36 - .18); g.lineTo(.52, -.42 + i * .36 - .18); g.stroke(); }
  // thumb along the top
  g.strokeStyle = skin; g.lineWidth = .3; g.beginPath(); g.moveTo(-.5, -.6); g.lineTo(.3, -.66); g.stroke();
  g.strokeStyle = sd; g.lineWidth = .05; g.beginPath(); g.moveTo(-.45, -.47); g.lineTo(.3, -.5); g.stroke();
  // little finger reaching out and hooking
  const k = o.hook ?? 1;
  g.strokeStyle = skin; g.lineWidth = .26; g.beginPath(); g.moveTo(.3, .56); g.lineTo(.95, .6);
  g.arc(.95, .6 - .28, .28, PI / 2, PI / 2 - PI * 1.15 * k, true); g.stroke();
  if (o.nail !== false) { g.strokeStyle = sd; g.lineWidth = .04; g.beginPath(); g.moveTo(.55, .5); g.lineTo(.75, .51); g.stroke(); }
  g.restore();
}
