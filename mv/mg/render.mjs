// Renders a frame range of index.html to an mp4 (no audio):
//   node render.mjs <out.mp4> <fps> <firstFrame> <lastFrame>
// Run several ranges in parallel, then join them with mux.sh.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const [out, fpsArg, f0Arg, f1Arg] = process.argv.slice(2);
const fps = +fpsArg, f0 = +f0Arg, f1 = +f1Arg;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + new URL('./index.html', import.meta.url).pathname);
await page.evaluate(() => window.READY);
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-tune', 'animation', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = f0; f < f1; f += 24) {
  const n = Math.min(24, f1 - f);
  const urls = await page.evaluate(([f, n, fps]) => { const a = []; for (let i = 0; i < n; i++) a.push(window.frameJPEG((f + i) / fps, .95)); return a; }, [f, n, fps]);
  for (const u of urls) { const ok = ff.stdin.write(Buffer.from(u.slice(u.indexOf(',') + 1), 'base64')); if (!ok) await new Promise(r => ff.stdin.once('drain', r)); }
  if ((f - f0) % (fps * 15) < 24) console.log(`${out}: frame ${f}/${f1}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
console.log('done', out, 'errors', errs);
await browser.close();
