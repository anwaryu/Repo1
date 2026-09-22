/* Rad Roots — inline SVG icon set (24x24, currentColor) */
'use strict';

const ICONS = {
  star: '<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  lock: '<path d="M7 10V8a5 5 0 0110 0v2h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1zm2 0h6V8a3 3 0 00-6 0v2z"/>',
  back: '<path d="M14.5 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  next: '<path d="M9.5 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  gear: '<path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm8.2 3.5l1.7-1.3-1.9-3.3-2 .8a7.6 7.6 0 00-1.8-1L15.9 5h-3.8l-.3 2.2a7.6 7.6 0 00-1.8 1l-2-.8-1.9 3.3 1.7 1.3a7.8 7.8 0 000 2l-1.7 1.3 1.9 3.3 2-.8a7.6 7.6 0 001.8 1l.3 2.2h3.8l.3-2.2a7.6 7.6 0 001.8-1l2 .8 1.9-3.3-1.7-1.3a7.8 7.8 0 000-2z"/>',
  soundOn: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  soundOff: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
  x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>',
  del: '<path d="M8 5h12a2 2 0 012 2v10a2 2 0 01-2 2H8l-6-7 6-7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M11.5 9.5l5 5M16.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  bulb: '<path d="M9 18h6M10 21h4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 3a6 6 0 00-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0012 3z"/>',
  seed: '<path d="M12 21c-4 0-7-3-7-7 0-5 4-9 7-11 3 2 7 6 7 11 0 4-3 7-7 7z"/><path d="M12 8v9" fill="none" stroke="var(--surface, #fff)" stroke-width="2" stroke-linecap="round" opacity=".7"/>',
  root: '<path d="M12 3c3 0 6 2 6 6 0 3-2 5-3 7-.5 1-.5 2-.5 3h-5c0-1 0-2-.5-3-1-2-3-4-3-7 0-4 3-6 6-6z"/><path d="M12 19v3M10 21l-1.5 1.5M14 21l1.5 1.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  flower: '<circle cx="12" cy="12" r="3"/><path d="M12 2a3 3 0 013 3v3a3 3 0 01-6 0V5a3 3 0 013-3zm0 20a3 3 0 01-3-3v-3a3 3 0 016 0v3a3 3 0 01-3 3zM2 12a3 3 0 013-3h3a3 3 0 010 6H5a3 3 0 01-3-3zm20 0a3 3 0 01-3 3h-3a3 3 0 010-6h3a3 3 0 013 3z" opacity=".85"/>',
  search: '<circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M15 15l5.5 5.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  weed: '<path d="M12 22V10M12 14c-3 0-5-2-6-5 3 0 5 1 6 4M12 12c1-4 4-6 8-6-1 4-4 6-8 7M12 17c-2-1-4-1-6 0 2 2 4 2 6 1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  timer: '<circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 9v4l3 2M9 2h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  trophy: '<path d="M7 3h10v5a5 5 0 01-10 0V3z"/><path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M10 13h4v3h2v3H8v-3h2v-3z"/>',
  fire: '<path d="M12 22c-4 0-7-3-7-7 0-3 2-5 3-7 0 2 1 3 2 3 0-4 2-7 5-9 0 3 1 5 3 7 1.5 1.5 2 3 2 6 0 4-3 7-8 7zm0-3a3 3 0 003-3c0-2-1.5-3-2-4-.5 1-1 1.5-1 3-1 0-1.5-.5-1.5-1.5-1 1-1.5 2-1.5 3a3 3 0 003 2.5z"/>',
  sparkle: '<path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
  book: '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4V4zm16 0h-6a3 3 0 00-3 3v13a2 2 0 012-2h7V4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  ribbon: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-2 8 5.5-3 5.5 3-2-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
  arrow: '<path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  refresh: '<path d="M4 12a8 8 0 0113.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 01-13.7 5.6L4 15.5M4 20v-4.5h4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  ruler: '<path d="M3 15l12-12 6 6-12 12z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M8 10l2 2M11 7l2 2M14 4l2 2M5 13l2 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  heart: '<path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z"/>',
  wand: '<path d="M4 20l11-11M13 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  radical: '<path d="M2 14l4-2 4 8L20 3" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 3h2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
};

function icon(name, cls = '') {
  const body = ICONS[name] || ICONS.sparkle;
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** The radical sign as an SVG stroke so it renders identically in every font. */
function radical(inner, cls = '') {
  return `<span class="rad-sign-wrap ${cls}"><svg class="rs" viewBox="0 0 26 40" aria-hidden="true" focusable="false"><path d="M2 25l7-3 5.5 15L24 2" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/></svg><span class="rc">${inner}</span></span>`;
}

/** Star row: n of 3 */
function starsHTML(n, big = false) {
  return `<span class="stars ${big ? 'stars--big' : ''}" aria-label="${n} of 3 stars">${[1, 2, 3].map((i) =>
    `<svg viewBox="0 0 24 24" class="${i <= n ? 'on' : ''}" fill="currentColor" style="animation-delay:${(i - 1) * 220}ms" aria-hidden="true">${ICONS.star}</svg>`).join('')}</span>`;
}
