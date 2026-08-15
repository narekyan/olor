/* Offline app shell. Bump CACHE on every deploy so clients pick up changes. */
const CACHE = "olor-v4";
const SHELL = [
  ".", "index.html", "words.js", "manifest.webmanifest", "city.webp", "city-sm.webp",
  "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first so a new deploy is picked up as soon as the player is online,
   with the cache as the offline fallback. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  /* the how-to-play clip is served in ranges and is far too big for the shell
     cache — let the browser talk to the network directly */
  if (e.request.destination === "video" || new URL(e.request.url).pathname.endsWith(".mp4")) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
