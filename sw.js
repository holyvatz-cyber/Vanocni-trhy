/* Vánoční trhy – service worker: offline app shell, cached libraries and recently viewed map tiles */
const VERSION = "v12";
const SHELL = `vt-shell-${VERSION}`, LIBS = "vt-libs-1", TILES = "vt-tiles-1";
const SHELL_FILES = ["./", "index.html", "markets.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png"];
const MAX_TILES = 600;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("vt-shell-") && k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function trimTiles(){
  const c = await caches.open(TILES), keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // App files: network first (fresh data), cache as fallback when offline
  if (url.origin === location.origin){
    // no-cache = always ask the server (cheap 304 when unchanged), so new versions arrive immediately
    e.respondWith(fetch(req, {cache:"no-cache"}).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch:true}).then(r => r || caches.match("index.html"))));
    return;
  }
  // Map tiles: cache first, refresh in background
  if (/tile\.openstreetmap\.org|arcgisonline\.com|tile\.opentopomap\.org/.test(url.hostname)){
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(res => { if (res.ok || res.type === "opaque"){ c.put(req, res.clone()); trimTiles(); } return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  // Photos from Wikimedia: cache first
  if (url.hostname === "upload.wikimedia.org"){
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque"){ c.put(req, res.clone()); trimTiles(); }
      return res;
    }));
    return;
  }
  // Wikipedia photo lookup and weather: network first, cached copy offline
  if (/\.wikipedia\.org$/.test(url.hostname) || url.hostname === "api.open-meteo.com"){
    e.respondWith(fetch(req).then(res => { if (res.ok){ const copy = res.clone(); caches.open(LIBS).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req)));
    return;
  }
  // Libraries and fonts: cache first
  if (/cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.hostname)){
    e.respondWith(caches.open(LIBS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    }));
  }
});
