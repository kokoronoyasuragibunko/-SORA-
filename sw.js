// バージョン定義：更新する時はここを書き換えます（例：v1 -> v2）
const CACHE_NAME = 'sora-app-v2';

// キャッシュするファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './amulets.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// 1. インストール時：指定したファイルをキャッシュに保存
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 有効化時：古いキャッシュ（バージョン違い）を削除する
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 新しいバージョン以外のキャッシュを削除
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. 通信時：キャッシュがあればそれを返し、なければネットに取りに行く
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュが見つかればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークへ
        return fetch(event.request);
      })
  );
});