const CACHE_NAME = 'cineverse-v1'
const ASSETS_TO_CACHE = ['/','/index.html','/manifest.webmanifest','/icons/icon-192.svg','/icons/icon-512.svg']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(r => {
      // Optionally cache new requests selectively
      return r
    })).catch(() => caches.match('/index.html'))
  )
})
// Minimal service worker to cache the app shell for offline support.
const CACHE_NAME = 'cineverse-v1'
const ASSETS = [
  '/',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  // Network-first for API calls, cache-first for others could be implemented later.
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  )
})
