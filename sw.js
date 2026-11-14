// Keeps a copy of this page on the device so it opens without internet.
// Always tries the internet first, so updates show up as soon as you're online.
const CACHE = 'fj-offline:' + self.registration.scope;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) {
        const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true})
      .then(m => m || caches.match('./index.html', {ignoreSearch: true}) || caches.match('./')))
  );
});
