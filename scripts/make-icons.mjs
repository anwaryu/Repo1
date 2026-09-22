// Renders icons/icon.svg and icons/icon-maskable.svg to the PNG sizes the manifest and iOS need.
// Needs Playwright with Chromium: `npm i -D playwright && npx playwright install chromium`, then `npm run icons`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadPlaywright() {
  try { return await import('playwright'); } catch (e) { /* try a global install next */ }
  const req = createRequire(import.meta.url);
  for (const p of [process.env.PLAYWRIGHT_MODULE, '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { if (p) return req(p); } catch (e) { /* keep looking */ }
  }
  throw new Error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
}

const { chromium } = await loadPlaywright();
const rounded = fs.readFileSync(path.join(root, 'icons/icon.svg'), 'utf8');
const fullBleed = fs.readFileSync(path.join(root, 'icons/icon-maskable.svg'), 'utf8');
const jobs = [
  ['icon-192.png', 192, rounded],
  ['icon-512.png', 512, rounded],
  ['maskable-512.png', 512, fullBleed],
  ['apple-touch-icon.png', 180, fullBleed],   // iOS applies its own rounded mask
];
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [file, size, svg] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: path.join(root, 'icons', file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('wrote icons/' + file);
}
await browser.close();
