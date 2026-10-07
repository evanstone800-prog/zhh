'use strict';
/* =========================================================
   Timeline: shots, transitions, lyrics, finishing.
   Section times come from the lyric video's subtitles.
   ========================================================= */
// [start, scene, opts, transition-in]
const SHOTS = [
  [0, 'opening', {}],
  [10, 'sunrise', {}],
  [14, 'hugGap', {}],
  [18.5, 'planet', { ly: 'dark' }],
  [22.4, 'profileSun', { who: 'kid', ly: 'dark' }, { type: 'fade', d: .35 }],
  [25, 'promise', { ly: 'dark' }],
  [29, 'scatter', { ly: 'dark' }],
  [32, 'bloom', { ly: 'dark' }],
  [33.2, 'springNap', { ly: 'dark' }],
  [36.8, 'grassField', {}, { type: 'slide', d: .55, dir: 1 }],
  [38.6, 'summerBeach', {}, { type: 'wipe', d: .7, cols: [C.sand, C.skyL] }],
  [42, 'moonPeak', {}, { type: 'fade', d: .3 }],
  [43.6, 'reunionTable', {}, { type: 'iris', d: .7, x: 1180, y: 330 }],
  [47, 'winterSnow', {}, { type: 'white', d: .8 }],
  [49.2, 'clock', {}],
  [52, 'eyeClose', {}, { type: 'fade', d: .35 }],
  [55, 'seaLine', { ly: 'dark' }],
  [58, 'kidsRun', {}, { type: 'wipe', d: .5, cols: [C.gold, C.coral] }],
  [60, 'photo', { ly: 'dark' }],
  [63, 'calendar', { ly: 'dark' }, { type: 'slide', d: .6, dir: 1 }],
  [66, 'rewind', {}, { type: 'fade', d: .3 }],
  [68, 'shadowWalk', {}, { type: 'iris', d: .6, x: 960, y: 470 }],
  [71, 'mapTrip', { ly: 'dark' }, { type: 'wipe', d: .6, cols: [C.sky, C.sand] }],
  [73, 'constellation', {}],
  [78, 'gullFlight', {}],
  [83, 'trainBye', {}, { type: 'fade', d: .5 }],
  [87, 'airHug', {}],
  [91, 'planet', { ly: 'dark' }, { type: 'fade', d: .5 }],
  [94.5, 'profileSun', { who: 'morph', ly: 'dark' }, { type: 'fade', d: .35 }],
  [97, 'promise2', { ly: 'dark' }],
  [101, 'scatter', { ly: 'dark', adult: true }],
  [104, 'chorusTrack', { lyAt: [[0, 'dark'], [9.6, ''], [15.6, 'dark']] }],
  [125, 'backWalk', {}, { type: 'fade', d: .6 }],
  [128, 'scent', {}, { type: 'fade', d: .5 }],
  [131, 'compass', {}, { type: 'iris', d: .6, x: 960, y: 600, col: C.gold }],
  [133, 'feetStop', {}, { type: 'fade', d: .4 }],
  [135, 'tearProfile', {}, { type: 'fade', d: .5 }],
  [137, 'tearsToStars', {}, { type: 'fade', d: .6 }],
  [141, 'warp', {}, { type: 'fade', d: .8 }],
  [145, 'meteorSlash', {}],
  [146, 'tearMeteor', {}, { type: 'fade', d: .25 }],
  [148, 'fearless', {}, { type: 'wipe', d: .45, cols: [C.gold] }],
  [151, 'goldSignal', {}, { type: 'white', d: .5 }],
  [153, 'chaseLight', {}],
  [156, 'meteorShower', {}, { type: 'white', d: .4 }],
  [159, 'leap', {}],
  [161, 'goldSignal', { strong: true }, { type: 'white', d: .5 }],
  [164, 'highFive', {}],
  [167, 'bloom', { ly: 'dark' }, { type: 'fade', d: .4 }],
  [168.2, 'twoUnderTree', { ly: 'dark' }, { type: 'iris', d: .6, x: 960, y: 540, col: C.gold }],
  [172, 'twoKites', {}, { type: 'slide', d: .55, dir: 1 }],
  [173.2, 'twoBeach', {}, { type: 'wipe', d: .6, cols: [C.peach, C.gold] }],
  [177, 'moonPeak', { adults: true }, { type: 'fade', d: .4 }],
  [178.2, 'twoTable', {}, { type: 'iris', d: .6, x: 1180, y: 330 }],
  [182, 'snowPlatform', { ly: 'dark' }, { type: 'white', d: .7 }],
  [184.2, 'stationClock', {}],
  [187, 'photoWall', { ly: 'dark' }, { type: 'fade', d: .6 }],
  [208, 'trainLeave', {}, { type: 'fade', d: .8 }],
  [212, 'windowHand', {}, { type: 'fade', d: .5 }],
  [216, 'trainPlanet', { ly: 'dark' }, { type: 'fade', d: .5 }],
  [219.6, 'profileSun', { who: 'kid', ly: 'dark' }, { type: 'fade', d: .35 }],
  [222, 'paperPlane', { ly: 'dark' }],
  [226, 'planeFly', { ly: 'dark' }],
  [230, 'outroWorld', {}, { type: 'fade', d: 1 }],
  ...(typeof SHOTS2 !== 'undefined' ? SHOTS2 : []),
];
const LYRICS = [
  [10, 13.9, '当太阳划破黑夜又要说再见'], [14, 17.9, '拥抱只是无法实现的心愿'], [18.6, 24.9, '我只身穿过四季 在光中追寻昔日你的侧脸'], [25, 28.9, '那些漫不经心拂过的诺言'], [29, 31.2, '随风飘散天边'],
  [32, 32.9, '花开拨云见'], [33, 36.3, '暖阳中梦一场春眠'], [36.8, 37.9, '芳草碧连天'], [38, 41.2, '还在怀恋夏日的海边'], [41.8, 42.9, '登高望明月'], [43, 46.9, '是秋风送爽还是寂寞的团圆'], [47, 48.9, '又是一年冬天'], [49, 51.9, '一切都逃不过时间'],
  [52, 54.9, '闭上眼仿佛在昨天 回忆里的夏天'], [55, 57.9, '海与天连成一线（海风很咸）'], [58, 59.9, '你紧紧牵着我的手 采花哼歌泛舟'], [60, 62.9, '那画面清晰浮现（还很新鲜）'], [63, 65.9, '叶月转眼到文月 月总有阴晴圆缺'], [66, 67.9, '又该如何回到从前'], [68, 70.9, '不知不觉和影子作伴的自己'], [71, 72.9, '踏上旅途寻找你踪迹'], [73, 73.9, '回忆就在眼前'], [74, 77.9, '如夏夜星辰点点'], [78, 79.9, '与海鸥一起并肩'], [80, 82.9, '振翅飞到你身边'],
  [83, 86.9, '当太阳划破黑夜又要说再见'], [87, 90.9, '拥抱只是无法实现的心愿'], [91, 96.9, '我只身穿过四季 在光中追寻昔日你的侧脸'], [97, 100.9, '那些漫不经心拂过的诺言'], [101, 103.9, '随风飘散天边'],
  [104, 104.9, '花开拨云见'], [105, 108.9, '暖阳中梦一场春眠'], [109, 110.9, '芳草碧连天'], [111, 113.9, '还在怀恋夏日的海边'], [114, 115.9, '登高望明月'], [116, 119.9, '是秋风送爽还是寂寞的团圆'], [120, 121.9, '又是一年冬天'], [122, 124.9, '一切都逃不过时间'],
  [125, 127.9, '拉长你的背影 太阳也渐渐向西'], [128, 130.9, '那花儿神秘的味道我从来不曾忘记'], [131, 132.9, '若是命中注定 指引我要归去'], [133, 136.9, '又为何停下脚步 只剩眼泪簌簌'],
  [145, 145.9, '此刻划破长空'], [146, 147.9, '泪水和着流星的光闪'], [148, 150.9, '再没有什么恐惧能将我阻拦'], [151, 152.9, '黎明带来金黄色的讯号'], [153, 155.9, '我追着光芒跌跌撞撞你就在不远前方'],
  [156, 158.9, '此刻划破长空 流星的光闪'], [159, 160.9, '再没有什么恐惧能将我阻拦'], [161, 163.9, '黎明带来金黄色的讯号'], [164, 166.9, '我追着光芒跌跌撞撞你就在不远前方'],
  [167, 167.9, '花开拨云见'], [168, 171.9, '暖阳中梦一场春眠'], [172, 172.9, '芳草碧连天'], [173, 176.9, '还在怀恋夏日的海边'], [177, 177.9, '登高望明月'], [178, 181.9, '是秋风送爽还是寂寞的团圆'], [182, 183.9, '又是一年冬天'], [184, 186.9, '一切都逃不过时间'],
  [187, 187.9, '花开拨云见'], [188, 191.9, '暖阳中梦一场春眠'], [192, 193.9, '芳草碧连天'], [194, 196.9, '还在怀恋夏日的海边'], [197, 198.9, '登高望明月'], [199, 202.9, '是秋风送爽还是寂寞的团圆'], [203, 204.9, '又是一年冬天'], [205, 207.9, '一切都逃不过时间'],
  [208, 211.9, '当太阳划破黑夜又要说再见'], [212, 215.9, '拥抱只是无法实现的心愿'], [216, 221.9, '我只身穿过四季 在光中追寻昔日你的侧脸'], [222, 225.9, '那些漫不经心拂过的诺言'], [226, 229.9, '随风飘散天边'],
];

/* ---------- compositing ---------- */
const shotIndex = t => { let i = 0; while (i + 1 < SHOTS.length && SHOTS[i + 1][0] <= t) i++; return i; };
const shotEnd = i => i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
function drawShot(g, i, t) {
  const s = SHOTS[i], t0 = s[0], d = shotEnd(i) - t0, lt = t - t0;
  const o = Object.assign({ d }, s[2]);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const f = SC[s[1]]; if (!f) { fill(g, '#f0f'); } else f(g, lt, clamp(lt / d, 0, 1), o, t);
  g.restore();
}
const bufA = mk(), bufB = mk();
function renderAt(t) {
  const i = shotIndex(t), s = SHOTS[i], tr = s[3], lt = t - s[0];
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  const gb = bufB.getContext('2d'); drawShot(gb, i, t);
  if (i > 0 && tr && lt < tr.d) {
    const ga = bufA.getContext('2d'); drawShot(ga, i - 1, t);
    composite(X, bufA, bufB, lt / tr.d, tr);
  } else X.drawImage(bufB, 0, 0);
  lyrics(X, t, Object.assign({ t0: s[0] }, s[2]));
  finish(X, t);
}
function composite(g, A, B, k, tr) {
  const e = (tr.ease || E.io3)(k);
  g.save();
  switch (tr.type) {
    case 'fade': g.drawImage(A, 0, 0); g.globalAlpha = e; g.drawImage(B, 0, 0); break;
    case 'white': { g.drawImage(k < .5 ? A : B, 0, 0); g.globalAlpha = 1 - Math.abs(k - .5) * 2; fill(g, tr.col || '#ffffff'); break; }
    case 'iris': {
      g.drawImage(A, 0, 0); const r = E.io3(k) * Math.hypot(Math.max(tr.x, W - tr.x), Math.max(tr.y, H - tr.y)) * 1.02;
      g.save(); g.beginPath(); g.arc(tr.x, tr.y, r, 0, TAU); g.clip(); g.drawImage(B, 0, 0); g.restore();
      ring(g, tr.x, tr.y, r, 16 * (1 - k), rgba(tr.col || C.cream, .9)); break;
    }
    case 'irisOut': {
      g.drawImage(B, 0, 0); const r = (1 - E.io3(k)) * Math.hypot(W, H) * .6;
      g.save(); g.beginPath(); g.arc(tr.x, tr.y, r, 0, TAU); g.clip(); g.drawImage(A, 0, 0); g.restore(); break;
    }
    case 'slide': { const d = tr.dir || 1; g.drawImage(A, -d * W * e, 0); g.drawImage(B, d * W * (1 - e), 0); break; }
    case 'slideV': { const d = tr.dir || 1; g.drawImage(A, 0, -d * H * e); g.drawImage(B, 0, d * H * (1 - e)); break; }
    case 'push': { // zoom into A while B comes forward
      const sa = lerp(1, 1.6, E.i3(k)); g.drawImage(B, 0, 0); g.globalAlpha = 1 - E.io2(k);
      g.translate(tr.x ?? W / 2, tr.y ?? H / 2); g.scale(sa, sa); g.translate(-(tr.x ?? W / 2), -(tr.y ?? H / 2)); g.drawImage(A, 0, 0); break;
    }
    case 'wipe': { // coloured bands sweep across, the last one reveals B
      g.drawImage(A, 0, 0); const cols = tr.cols || [C.coral, C.gold], n = cols.length + 1, ang = tr.ang ?? -.25;
      g.translate(W / 2, H / 2); g.rotate(ang); const span = Math.hypot(W, H);
      for (let j = 0; j < n; j++) {
        const kk = E.io3(clamp(k * (1 + (n - 1) * .18) - j * .18, 0, 1)), fx = -span / 2 + span * kk;
        if (kk <= 0) continue;
        g.save(); g.beginPath(); g.rect(-span / 2, -span / 2, fx + span / 2, span); g.clip();
        if (j < n - 1) { g.fillStyle = cols[j]; g.fillRect(-span / 2, -span / 2, span, span); }
        else { g.rotate(-ang); g.translate(-W / 2, -H / 2); g.drawImage(B, 0, 0); }
        g.restore();
      }
      break;
    }
    default: g.drawImage(B, 0, 0);
  }
  g.restore();
}

/* ---------- lyrics: per-character entrance, soft exit ---------- */
function lyrics(g, t, so) {
  for (const L of LYRICS) {
    if (t < L[0] - .05 || t > L[1] + .5) continue;
    const lt = t - L[0], out = 1 - seg(t, L[1] + .05, L[1] + .5, E.io2);
    const mode = so.lyAt ? so.lyAt.filter(m => m[0] <= t - so.t0).pop()?.[1] : so.ly;
    const [main, paren] = L[2].split('（'), y = so.lyY ?? 990, dark = mode === 'dark', col = dark ? '#3A2A4A' : C.cream;
    const shadow = dark ? 'rgba(255,248,236,.85)' : 'rgba(16,12,40,.55)';
    const w = ktext(g, main, W / 2 - (paren ? 120 : 0), y, 56, lt, { medium: true, col, shadow, blur: 18, out, stagger: Math.min(.05, 1.1 / main.length), dur: .5, rise: 26, from: .85, ease: E.o3 });
    if (paren) ktext(g, paren.replace('）', ''), W / 2 - 120 + w / 2 + 40, y + 4, 40, lt - 1.1, { col: dark ? C.coralD : C.gold, shadow, blur: 14, out, align: 'left', stagger: .07, rise: 18, from: .7 });
  }
}

/* ---------- finishing: paper grain + soft vignette ---------- */
const grain = mk(), vig = mk();
(function () {
  const g = grain.getContext('2d'), id = g.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = 128 + (R(i, 3) - .5) * 60 + (R(i >> 7, 5) - .5) * 30; d[i] = d[i + 1] = d[i + 2] = n; d[i + 3] = 255; }
  g.putImageData(id, 0, 0);
  const v = vig.getContext('2d'), gr = v.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05);
  gr.addColorStop(0, 'rgba(20,10,40,0)'); gr.addColorStop(1, 'rgba(20,10,40,.32)'); v.fillStyle = gr; v.fillRect(0, 0, W, H);
})();
function finish(g, t) {
  g.save();
  g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .22; g.drawImage(grain, 0, 0);
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(vig, 0, 0);
  const fo = Math.max(1 - seg(t, 0, .8), seg(t, 260, 266, E.io2));
  if (fo > 0) { g.globalAlpha = fo; fill(g, '#000'); }
  g.restore();
}

window.DUR = DUR;
window.renderAt = renderAt;
window.READY = Promise.all([document.fonts.load('56px WKM'), document.fonts.load('56px WK')]).then(() => true);
window.frameJPEG = (t, q = .92) => { renderAt(t); return cv.toDataURL('image/jpeg', q); };
if (!navigator.webdriver) {
  const au = new URLSearchParams(location.search).get('t');
  let t0 = performance.now() - (+au || 0) * 1000;
  window.READY.then(() => { const loop = () => { renderAt(((performance.now() - t0) / 1000) % DUR); requestAnimationFrame(loop); }; loop(); });
}
