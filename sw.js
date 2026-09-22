/* Rad Roots service worker: keeps the app shell cached so the garden opens offline.
   Network first (so updates arrive as soon as they are deployed), cache as the fallback. */
'use strict';

const VERSION = 'rad-roots-v1.1.0';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/util.js', './js/icons.js', './js/mascot.js', './js/sfx.js', './js/confetti.js',
  './js/store.js', './js/widgets.js', './js/steps.js', './js/levels.js', './js/app.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !isFont) return;

  if (isFont) {
    // Fonts change rarely: serve cached, refresh in the background.
    event.respondWith(caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const refresh = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => cached);
      return cached || refresh;
    }));
    return;
  }

  event.respondWith(caches.open(VERSION).then(async (cache) => {
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        cache.put(req, res.clone());
        if (req.mode === 'navigate') cache.put('./index.html', res.clone());
      }
      return res;
    } catch (err) {
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      if (req.mode === 'navigate') return cache.match('./index.html');
      throw err;
    }
  }));
});
