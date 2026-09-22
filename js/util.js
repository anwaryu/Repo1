/* Rad Roots — small DOM + math helpers (no dependencies) */
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Create an element: h('div', {class:'x', onclick: fn}, child, 'text', ...) */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv; }
    }
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** Parse an HTML string into a single element */
function frag(htmlString) {
  const t = document.createElement('template');
  t.innerHTML = htmlString.trim();
  return t.content.firstElementChild;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const isSquare = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
const SQUARES = Array.from({ length: 12 }, (_, i) => (i + 1) * (i + 1)); // 1..144

/** Format a number for kids: 4.47 not 4.4721359 */
const fmt = (x, d = 2) => Number(x.toFixed(d)).toString();

/** Superscript 2 in HTML */
const sq = (n) => `${n}<sup>2</sup>`;

/** Run fn when the user next interacts (for audio unlock) */
function onFirstInteraction(fn) {
  const once = () => { fn(); window.removeEventListener('pointerdown', once); window.removeEventListener('keydown', once); };
  window.addEventListener('pointerdown', once, { passive: true });
  window.addEventListener('keydown', once);
}

const prefersReducedMotion = () =>
  document.documentElement.dataset.motion === 'reduce' ||
  (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
