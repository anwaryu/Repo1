// Bundle Rad Roots into one self-contained HTML file (no build tools needed to run the app itself).
//   node scripts/build.mjs                → dist/rad-roots.html   (standalone page)
//   node scripts/build.mjs --fragment OUT → OUT                   (no doctype/html/head/body: for hosts that wrap the page)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const args = process.argv.slice(2);
const fragment = args.includes('--fragment');
const outArg = args[args.indexOf('--fragment') + 1];

const html = read('index.html');
const css = read('css/styles.css');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const js = scripts.map((s) => `/* ---- ${s} ---- */\n${read(s)}`).join('\n\n');

// Function replacements: the source is full of `$(`, `$$` and `$'`, which String.replace would otherwise treat as patterns.
let out = html
  .replace(/\s*<link rel="stylesheet" href="css\/styles.css">/, () => `\n  <style>\n${css}\n  </style>`)
  .replace(/\s*<script src="[^"]+"><\/script>/g, '')
  .replace(/<\/body>/, () => `  <script>\n${js}\n  </script>\n</body>`);

if (fragment) {
  const title = html.match(/<title>[^<]*<\/title>/)[0];
  const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0];
  const body = out.match(/<body>([\s\S]*)<\/body>/)[1];
  out = `${title}\n${fonts}\n<style>\n${css}\n</style>\n${body}`;
}

const dest = fragment && outArg && !outArg.startsWith('--') ? path.resolve(outArg) : path.join(root, 'dist', fragment ? 'rad-roots.fragment.html' : 'rad-roots.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);
console.log(`Wrote ${dest} (${(out.length / 1024).toFixed(0)} KB)`);
