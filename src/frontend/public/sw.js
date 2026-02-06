const CACHE_NAME = 'quickbazar-v3';
const OFFLINE_URL = '/offline.html';
const APP_SHELL_CACHE = 'quickbazar-app-shell-v3';

// Assets to precache on install
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/assets/generated/pwa-icon.dim_72x72.png',
  '/assets/generated/pwa-icon.dim_96x96.png',
  '/assets/generated/pwa-icon.dim_128x128.png',
  '/assets/generated/pwa-icon.dim_144x144.png',
  '/assets/generated/pwa-icon.dim_152x152.png',
  '/assets/generated/pwa-icon.dim_192x192.png',
  '/assets/generated/pwa-icon.dim_384x384.png',
  '/assets/generated/pwa-icon.dim_512x512.png',
  '/assets/generated/pwa-maskable.dim_192x192.png',
  '/assets/generated/pwa-maskable.dim_512x512.png',
  '/assets/generated/apple-touch-icon.dim_180x180.png',
  '/assets/generated/quickbazar-logo.dim_512x512.png',
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== APP_SHELL_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first for HTML/documents with app shell caching, cache first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API calls and authenticated requests (avoid caching private data)
  if (
    url.pathname.startsWith('/api/') ||
    request.headers.get('authorization') ||
    request.credentials === 'include'
  ) {
    return;
  }

  // For navigation requests and HTML documents, use network first with app shell caching
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the app shell for offline use
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Try to serve cached app shell first
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fall back to offline page if no cached app shell
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // For static assets (scripts, styles, images, fonts), use cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Only cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  }
});
