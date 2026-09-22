/* Rad Roots — reusable interactive widgets */
'use strict';

/* ---------- Tile grid ---------- */
/**
 * Build an n×n tile square.
 * opts: { color: root index for hue (default n), size: 'lg'|'sm'|'xs', extra: number of leftover tiles (rendered below),
 *         ghost: n for a faint outline of the next size, stagger: boolean, cls: string }
 */
function tileGrid(n, opts = {}) {
  const size = opts.size || 'lg';
  const grid = h('div', { class: `grid ${size === 'sm' ? 'grid--sm' : size === 'xs' ? 'grid--xs' : ''} ${opts.cls || ''}`, style: { '--n': n }, role: 'img', 'aria-label': `${n} by ${n} square, ${n * n} tiles` });
  if (opts.scale) grid.style.setProperty('--size', gridSizeFor(n));
  const hue = opts.color || Math.min(12, Math.max(1, n));
  const stagger = opts.stagger !== false;
  for (let i = 0; i < n * n; i++) {
    const t = h('div', { class: 'tile', style: { '--tile': `var(--t${hue})`, '--d': `${stagger ? Math.min(i * 9, 520) : 0}ms` } });
    grid.append(t);
  }
  return grid;
}

/** Re-render a grid element in place to a new size, marking tiles in the outer L as new when growing */
function morphGrid(grid, n, opts = {}) {
  const { markNew = false, hue } = opts;
  const prevN = Number(grid.style.getPropertyValue('--n')) || 0;
  grid.style.setProperty('--n', n);
  if (opts.scale) grid.style.setProperty('--size', gridSizeFor(n));
  grid.setAttribute('aria-label', `${n} by ${n} square, ${n * n} tiles`);
  const color = hue || Math.min(12, Math.max(1, n));
  const tiles = $$('.tile', grid);
  const need = n * n;
  // shrink
  while (grid.children.length > need) grid.lastElementChild.remove();
  // recolor existing
  $$('.tile', grid).forEach((t) => { t.style.setProperty('--tile', `var(--t${color})`); t.classList.remove('tile--new'); t.style.setProperty('--d', '0ms'); });
  // grow: append with stagger
  let added = 0;
  while (grid.children.length < need) {
    const t = h('div', { class: 'tile', style: { '--tile': `var(--t${color})`, '--d': `${Math.min(added * 14, 420)}ms` } });
    grid.append(t); added++;
  }
  if (markNew && n > prevN && prevN > 0) {
    // In an n×n grid (row-major), tiles in the last row or last column form the new L (gnomon)
    $$('.tile', grid).forEach((t, i) => {
      const r = Math.floor(i / n), c = i % n;
      if (r >= prevN || c >= prevN) t.classList.add('tile--new');
    });
  }
  return tiles;
}

/** Try to build a square from m tiles: returns { side, leftover } */
function squareFit(m) { const side = Math.floor(Math.sqrt(m)); return { side, leftover: m - side * side }; }

/** Visual: m tiles arranged as the biggest square + leftovers falling off */
function fitVisual(m, size = 'sm') {
  const { side, leftover } = squareFit(m);
  const wrap = h('div', { class: 'reveal' });
  if (side > 0) wrap.append(tileGrid(side, { size, color: side }));
  if (leftover > 0) {
    const lo = h('div', { class: 'leftover', 'aria-label': `${leftover} leftover tiles` });
    for (let i = 0; i < leftover; i++) lo.append(h('div', { class: 'tile tile--off', style: { '--d': `${160 + i * 50}ms` } }));
    wrap.append(lo);
  }
  return wrap;
}

/* ---------- Plant view: square above ground, root below ---------- */
function plantView(n, { showRoot = true, size, scale = false } = {}) {
  const wrap = h('div', { class: 'plant' });
  const grid = tileGrid(n, { size: size || 'lg', scale });
  wrap.append(grid);
  if (showRoot) {
    wrap.append(h('div', { class: 'plant-ground' }));
    const root = h('div', { class: 'plant-root' });
    const bar = h('div', { class: 'root-bar', 'aria-label': `root of length ${n}` });
    for (let i = 0; i < n; i++) bar.append(h('div', { class: 'root-seg', style: { '--d': `${i * 60 + 200}ms` } }));
    root.append(bar, h('div', { class: 'root-label', html: `root = <b>${n}</b> &nbsp;·&nbsp; one side of the square` }));
    wrap.append(root);
    syncRootWidth(wrap, n);
  }
  return wrap;
}
function syncRootWidth(plant, n, scaled = false) {
  requestAnimationFrame(() => {
    const grid = $('.grid', plant);
    if (!grid) return;
    const w = scaled ? gridSizePx(n) : grid.getBoundingClientRect().width;
    const seg = Math.max(6, (w - 24 - (n - 1) * 4) / n);
    plant.style.setProperty('--size', `${w}px`);
    $$('.root-seg', plant).forEach((s) => s.style.setProperty('--seg', `${seg}px`));
  });
}

/* ---------- Side-length slider ---------- */
function sideSlider({ min = 1, max = 12, value = 1, onChange }) {
  const wrap = h('div', { class: 'slider' });
  const input = h('input', { type: 'range', min, max, value, step: 1, id: 'side-slider', 'aria-label': 'side length' });
  const dec = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'smaller' }, '−');
  const inc = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'bigger' }, '+');
  const setFill = () => input.style.setProperty('--fill', `${((input.value - min) / (max - min)) * 100}%`);
  const emit = () => { setFill(); onChange(Number(input.value)); };
  input.addEventListener('input', emit);
  dec.addEventListener('click', () => { if (Number(input.value) > min) { input.value = Number(input.value) - 1; emit(); } });
  inc.addEventListener('click', () => { if (Number(input.value) < max) { input.value = Number(input.value) + 1; emit(); } });
  setFill();
  wrap.append(dec, input, inc);
  return { el: wrap, get value() { return Number(input.value); }, set value(v) { input.value = v; setFill(); } };
}

/* ---------- Number pad ---------- */
function numpad({ onSubmit, maxLen = 4, placeholder = '' }) {
  let value = '';
  const display = h('div', { class: 'answer-display is-empty', role: 'status', 'aria-live': 'polite', 'aria-label': 'your answer' });
  const box = h('div', { class: 'answer-box' }, display);
  const pad = h('div', { class: 'numpad', role: 'group', 'aria-label': 'number pad' });
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'go'];
  const render = () => { display.textContent = value; display.classList.toggle('is-empty', value === ''); };
  const press = (k) => {
    if (pad.classList.contains('is-locked')) return;
    if (k === 'del') { value = value.slice(0, -1); SFX.tap(); }
    else if (k === 'go') { if (value !== '') onSubmit(Number(value)); return; }
    else if (value.length < maxLen) { value = value === '0' ? k : value + k; SFX.tap(); }
    render();
  };
  for (const k of keys) {
    const btn = h('button', { type: 'button', class: `key ${k === 'go' ? 'key--go' : ''} ${k === 'del' ? 'key--del' : ''}`, 'aria-label': k === 'del' ? 'delete' : k === 'go' ? 'check answer' : k, onclick: () => press(k) });
    btn.innerHTML = k === 'del' ? icon('del') : k === 'go' ? icon('check') : k;
    pad.append(btn);
  }
  const onKey = (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (/^[0-9]$/.test(e.key)) { press(e.key); e.preventDefault(); }
    else if (e.key === 'Backspace') { press('del'); e.preventDefault(); }
    else if (e.key === 'Enter') { press('go'); e.preventDefault(); }
  };
  window.addEventListener('keydown', onKey);
  const el = h('div', { class: 'numpad-wrap' }, box, pad);
  render();
  return {
    el,
    get value() { return value; },
    clear() { value = ''; display.classList.remove('is-good', 'is-bad'); render(); },
    lock() { pad.classList.add('is-locked'); },
    unlock() { pad.classList.remove('is-locked'); },
    mark(kind) { display.classList.remove('is-good', 'is-bad'); void display.offsetWidth; display.classList.add(kind === 'good' ? 'is-good' : 'is-bad'); },
    destroy() { window.removeEventListener('keydown', onKey); },
  };
}

/* ---------- Feedback sheet (fixed at bottom) ---------- */
const Feedback = (() => {
  let el = null;
  function hide() { if (el) { el.remove(); el = null; } }
  /** kind: good | bad | reveal */
  function show({ kind = 'good', title, body = '', button = 'Continue', onButton, buttonKind }) {
    hide();
    const icons = { good: 'check', bad: 'x', reveal: 'bulb' };
    el = h('div', { class: `feedback feedback--${kind}`, role: 'dialog', 'aria-live': 'assertive' },
      h('div', { class: 'feedback-text' },
        h('div', { class: 'feedback-title', html: `${icon(icons[kind])}<span>${title}</span>` }),
        body ? h('div', { class: 'feedback-body', html: body }) : null),
      h('button', { type: 'button', class: `btn ${buttonKind || (kind === 'bad' ? 'btn--berry' : kind === 'reveal' ? 'btn--sun' : '')}`, onclick: () => { SFX.tap(); hide(); onButton && onButton(); } }, button));
    document.body.append(el);
    requestAnimationFrame(() => $('.btn', el).focus({ preventScroll: true }));
    return el;
  }
  return { show, hide, get open() { return !!el; } };
})();

/* ---------- Speech bubble with Rad ---------- */
function speech(mood, html, big = false) {
  return h('div', { class: `speech ${big ? 'speech--big' : ''}`, html: `${mascot(mood)}<div class="bubble">${html}</div>` });
}

/* ---------- Number line (zoomed 5-unit window) ---------- */
const radicalText = (v) => `≈ ${fmt(v)}`;
/** Grid size that grows with n, so a 1×1 square looks small and a 12×12 looks big */
const gridSizeFor = (n) => `min(${Math.min(300, 96 + (n - 1) * 30)}px, 76vw)`;
const gridSizePx = (n) => Math.min(300, 96 + (n - 1) * 30, window.innerWidth * 0.76);
/**
 * numberLine({ start, value, interactive, truth, highlight:[a,b], onChange })
 * Shows integers start..start+5 with their squares boxed above the axis.
 */
function numberLine({ start = 0, span = 5, value = null, interactive = false, truth = null, highlight = null, onChange, id = 'nline' }) {
  const W = 640, H = 236, L = 50, R = 590, AX = 122;
  const unit = (R - L) / span;
  const xOf = (v) => L + (v - start) * unit;
  const vOf = (x) => clamp(start + (x - L) / unit, start, start + span);
  const svg = frag(`<svg class="nline" viewBox="0 0 ${W} ${H}" id="${id}" ${interactive ? 'tabindex="0" role="slider" aria-valuemin="' + start + '" aria-valuemax="' + (start + span) + '" aria-valuenow="' + (value ?? start) + '" aria-label="drag to estimate the square root"' : 'aria-hidden="true"'}></svg>`);
  const ns = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, text) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };

  if (highlight) {
    svg.append(mk('rect', { class: 'range-band', x: xOf(highlight[0]), y: AX - 22, width: xOf(highlight[1]) - xOf(highlight[0]), height: 44, rx: 12 }));
  }
  svg.append(mk('line', { class: 'axis', x1: L - 20, y1: AX, x2: R + 20, y2: AX }));
  for (let v = start; v <= start + span; v++) {
    svg.append(mk('line', { class: 'tick', x1: xOf(v), y1: AX - 10, x2: xOf(v), y2: AX + 10 }));
    svg.append(mk('text', { class: 'tick-label', x: xOf(v), y: AX + 40 }, v));
    if (v >= 0) {
      const hl = highlight && (v === highlight[0] || v === highlight[1]);
      const box = mk('rect', { class: `sq-box ${hl ? 'is-hl' : ''}`, x: xOf(v) - 30, y: AX - 74, width: 60, height: 34, rx: 10 });
      svg.append(box);
      svg.append(mk('text', { class: 'sq-label', x: xOf(v), y: AX - 50 }, v * v));
      svg.append(mk('line', { class: 'tick', x1: xOf(v), y1: AX - 40, x2: xOf(v), y2: AX - 22, 'stroke-dasharray': '2 4' }));
    }
  }
  // truth pin
  if (truth != null) {
    const g = mk('g', {});
    g.append(mk('line', { x1: xOf(truth), y1: AX, x2: xOf(truth), y2: AX + 52, stroke: 'var(--leaf)', 'stroke-width': 4, 'stroke-linecap': 'round' }));
    g.append(mk('circle', { class: 'truth-pin', cx: xOf(truth), cy: AX + 62, r: 12 }));
    g.append(mk('text', { class: 'truth-label', x: xOf(truth), y: AX + 62 + 36 }, `${radicalText(truth)}`));
    svg.append(g);
  }
  // marker
  let marker = null, cur = value;
  if (value != null) {
    marker = mk('g', { class: 'marker' });
    const stem = mk('line', { x1: 0, y1: AX, x2: 0, y2: AX - 4, stroke: 'var(--berry)', 'stroke-width': 4, 'stroke-linecap': 'round' });
    const pin = mk('circle', { class: 'marker-pin', cx: 0, cy: AX, r: 16 });
    const lbl = mk('text', { class: 'marker-label', x: 0, y: AX - 84 - 8 }, fmt(cur, 1));
    marker.append(stem, pin, lbl);
    svg.append(marker);
    place();
  }
  function place() {
    marker.setAttribute('transform', `translate(${xOf(cur)},0)`);
    $('.marker-label', marker).textContent = fmt(cur, 1);
    svg.setAttribute('aria-valuenow', fmt(cur, 1));
  }
  function set(v) { cur = Math.round(clamp(v, start, start + span) * 10) / 10; place(); onChange && onChange(cur); }
  if (interactive && marker) {
    let dragging = false;
    const toVal = (clientX) => { const r = svg.getBoundingClientRect(); return vOf(((clientX - r.left) / r.width) * W); };
    svg.addEventListener('pointerdown', (e) => { dragging = true; marker.classList.add('is-drag'); svg.setPointerCapture(e.pointerId); set(toVal(e.clientX)); SFX.tap(); });
    svg.addEventListener('pointermove', (e) => { if (dragging) set(toVal(e.clientX)); });
    const up = () => { if (dragging) { dragging = false; marker.classList.remove('is-drag'); } };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { set(cur - 0.1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(cur + 0.1); e.preventDefault(); }
    });
  }
  return { el: svg, get value() { return cur; }, set, lock() { svg.style.pointerEvents = 'none'; svg.removeAttribute('tabindex'); } };
}

/* ---------- Word-problem scenes (simple SVG illustrations) ---------- */
function scene(kind, n) {
  const ns = 'http://www.w3.org/2000/svg';
  const size = 240, pad = 14, cell = (size - pad * 2) / n;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  const rect = (x, y, w, hgt, fill, rx = 4, extra = {}) => { const r = document.createElementNS(ns, 'rect'); Object.entries({ x, y, width: w, height: hgt, fill, rx, ...extra }).forEach(([k, v]) => r.setAttribute(k, v)); return r; };
  const circ = (cx, cy, r, fill) => { const c = document.createElementNS(ns, 'circle'); Object.entries({ cx, cy, r, fill }).forEach(([k, v]) => c.setAttribute(k, v)); return c; };
  const themes = {
    garden: { bg: '#8BD3A0', cellA: '#7FC48F', cellB: '#6FB57F', dot: '#2F7A3E', dotR: 0.22 },
    pixels: { bg: '#1F2B3A', cellA: '#3B82F6', cellB: '#60A5FA', dot: null },
    band: { bg: '#CDE8FF', cellA: '#CDE8FF', cellB: '#CDE8FF', dot: '#3B82F6', dotR: 0.3 },
    rug: { bg: '#B45309', cellA: '#F59E0B', cellB: '#D97706', dot: '#FDE68A', dotR: 0.14 },
    chess: { bg: '#5C3A1E', cellA: '#F1D9B5', cellB: '#7A4A25', dot: null },
    trampoline: { bg: '#1E3A8A', cellA: '#3B5BDB', cellB: '#3B5BDB', dot: null },
    tiles: { bg: '#E5E7EB', cellA: '#FFFFFF', cellB: '#F3F4F6', dot: null },
  };
  const t = themes[kind] || themes.garden;
  svg.append(rect(0, 0, size, size, t.bg, 22));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const x = pad + c * cell, y = pad + r * cell;
    const fill = (r + c) % 2 ? t.cellB : t.cellA;
    svg.append(rect(x + 1, y + 1, cell - 2, cell - 2, fill, Math.min(6, cell * 0.2)));
    if (t.dot) svg.append(circ(x + cell / 2, y + cell / 2, cell * t.dotR, t.dot));
  }
  if (kind === 'pixels') {
    // a little smiley made of lit pixels when n >= 6
    const lit = new Set();
    if (n >= 6) {
      const e = Math.floor(n / 3);
      lit.add(`${e}-${e}`); lit.add(`${e}-${n - 1 - e}`);
      for (let c = e; c <= n - 1 - e; c++) lit.add(`${n - 1 - e}-${c}`);
      lit.add(`${n - 2 - e}-${e - 1 < 0 ? 0 : e - 1}`); lit.add(`${n - 2 - e}-${n - e}`);
    }
    for (const key of lit) { const [r, c] = key.split('-').map(Number); if (r < n && c < n && r >= 0 && c >= 0) svg.append(rect(pad + c * cell + 1, pad + r * cell + 1, cell - 2, cell - 2, '#FACC15', 3)); }
  }
  if (kind === 'trampoline') {
    const inner = document.createElementNS(ns, 'circle');
    inner.setAttribute('cx', size / 2); inner.setAttribute('cy', size / 2); inner.setAttribute('r', (size - pad * 2) / 2 - 6);
    inner.setAttribute('fill', '#0F172A'); inner.setAttribute('stroke', '#93C5FD'); inner.setAttribute('stroke-width', '6'); inner.setAttribute('stroke-dasharray', '6 8');
    svg.append(inner);
  }
  return svg;
}

/* ---------- Floating XP + toast ---------- */
function floatXp(n, x, y) {
  const el = h('div', { class: 'xp-float', style: { left: `${x}px`, top: `${y}px` } }, `+${n} XP`);
  document.body.append(el);
  setTimeout(() => el.remove(), 1200);
}
function toast(msg, ms = 1800) {
  const el = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(el);
  setTimeout(() => el.remove(), ms);
}
