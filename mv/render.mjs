// Renders mv.html frame by frame and muxes it with the song: node render.mjs <audio> <out.mp4> [fps]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const [audio, out, fpsArg] = process.argv.slice(2);
const fps = +(fpsArg || 24);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + new URL('./mv.html', import.meta.url).pathname);
await page.waitForTimeout(500);
const dur = await page.evaluate(() => window.DUR);
const total = Math.ceil(dur * fps);
const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-i', audio,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < total; f += 48) {
  const n = Math.min(48, total - f);
  const urls = await page.evaluate(([f, n, fps]) => { const a = []; for (let i = 0; i < n; i++) a.push(window.frameJPEG((f + i) / fps, .93)); return a; }, [f, n, fps]);
  for (const u of urls) { const ok = ff.stdin.write(Buffer.from(u.slice(u.indexOf(',') + 1), 'base64')); if (!ok) await new Promise(r => ff.stdin.once('drain', r)); }
  if (f % (fps * 20) < 48) console.log(`frame ${f}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
console.log('done', out, 'errors', errs);
await browser.close();
