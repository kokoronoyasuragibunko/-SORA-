// キャッシュの名前（バージョン管理用）
// index.htmlの更新に合わせて v1.4 にしています
const CACHE_NAME = 'sora-app-v1.5';

// キャッシュするファイル（オフラインでも動くように保存するファイル）
const urlsToCache = [
    './',
    './index.html',
    './amulets.js',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// インストール時の処理（ファイルを保存する）
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 有効化時の処理（古いバージョンを削除する）
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 通信時の処理（保存したファイルを優先して表示する）
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // キャッシュにあればそれを返す
                if (response) {
                    return response;
                }
                // なければインターネットに取りに行く
                return fetch(event.request);
            })
    );
});