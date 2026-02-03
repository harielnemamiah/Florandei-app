// sw.js - Service Worker para funcionalidade offline

const CACHE_NAME = 'florandei-v1';
const OFFLINE_URLS = [
    '/index.html',
    '/css/styles.css',
    '/js/db.js',
    '/js/map.js',
    '/js/ui.js',
    '/js/app.js',
    '/manifest.json',
    '/icon.png'
];

// Instalação - cachear arquivos essenciais
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando arquivos');
                return cache.addAll(OFFLINE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - estratégia Network First, fallback para Cache
self.addEventListener('fetch', (event) => {
    // Ignorar requisições que não são GET
    if (event.request.method !== 'GET') return;
    
    // Ignorar requisições para APIs externas (mapas)
    if (event.request.url.includes('tile.openstreetmap.org') ||
        event.request.url.includes('unpkg.com') ||
        event.request.url.includes('cdn.jsdelivr.net')) {
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clonar resposta pois ela só pode ser usada uma vez
                const responseClone = response.clone();
                
                // Cachear resposta se for bem-sucedida
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                
                return response;
            })
            .catch(() => {
                // Se falhar (offline), tentar cache
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    
                    // Se não houver cache, retornar página offline
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Mensagens do app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
