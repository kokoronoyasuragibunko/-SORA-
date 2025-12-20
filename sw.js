// バージョン定義：更新する時はここを書き換えます
const CACHE_NAME = 'sora-app-v7';

// キャッシュするファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './amulets.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// 1. インストール時
self.addEventListener('install', function(event) {
  // ★追加：待機状態をスキップして、即座に新しいSWを有効にする命令
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 有効化時
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    // ★追加：すぐに全てのページのコントロールを開始する命令
    .then(() => self.clients.claim())
  );
});

// 3. 通信時
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});