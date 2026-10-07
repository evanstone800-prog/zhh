// Renders selected seconds to JPEGs for review: node preview.mjs out_dir t1 t2 ...  (or a range: 10:14:0.5)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const [out, ...args] = process.argv.slice(2);
const ts = args.flatMap(a => { if (!a.includes(':')) return [+a]; const [a0, a1, st] = a.split(':').map(Number); const r = []; for (let t = a0; t <= a1 + 1e-6; t += st) r.push(+t.toFixed(3)); return r; });
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto('file://' + new URL('./index.html', import.meta.url).pathname);
await page.evaluate(() => window.READY);
let tot = 0;
for (const t of ts) {
  const t0 = Date.now();
  const url = await page.evaluate(tt => window.frameJPEG(+tt, .9), t);
  writeFileSync(`${out}/p_${t.toFixed(2).padStart(7, '0')}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  tot += Date.now() - t0;
}
console.log(`${ts.length} frames, avg ${(tot / ts.length).toFixed(0)}ms`, 'errors', errs);
await browser.close();
