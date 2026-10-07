// Renders selected seconds of mv.html to JPEGs for review: node preview.mjs out_dir t1 t2 ...
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const [out, ...ts] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto('file://' + new URL('./mv.html', import.meta.url).pathname);
await page.waitForTimeout(500);
for (const t of ts) {
  const t0 = Date.now();
  const url = await page.evaluate(tt => window.frameJPEG(+tt, .9), t);
  writeFileSync(`${out}/p_${String(t).padStart(6, '0')}.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  process.stdout.write(`${t}:${Date.now() - t0}ms `);
}
console.log('\nerrors', errs);
await browser.close();
