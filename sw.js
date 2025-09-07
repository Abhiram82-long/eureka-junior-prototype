// Service Worker for Tool Finder PWA

const CACHE_NAME = 'tool-finder-v1';
const STATIC_CACHE_URLS = [
    '/index.html',
    '/results.html',
    '/methodology.html',
    '/js/main.js',
    '/js/results.js',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Installed');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // If request is successful, clone and cache the response
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // If network fails, try to serve from cache
                    return caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            // If not in cache and it's a navigation request, serve index.html
                            if (event.request.mode === 'navigate') {
                                return caches.match('/index.html');
                            }
                            throw new Error('No cached version available');
                        });
                })
        );
    }
});

// Background sync for failed API requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'retry-api-request') {
        event.waitUntil(retryFailedRequests());
    }
});

function retryFailedRequests() {
    // Implement retry logic for failed API requests
    console.log('Service Worker: Retrying failed requests...');
    return Promise.resolve();
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/manifest-icon-192.png',
            badge: '/manifest-icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Recommendations',
                    icon: '/icons/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icons/xmark.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const action = event.action;

    if (action === 'close') {
        notification.close();
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.matchAll().then(clientList => {
                const hadWindowToFocus = clientList.some(windowClient => {
                    if (windowClient.url === self.location.origin + '/') {
                        windowClient.focus();
                        return true;
                    }
                    return false;
                });

                if (!hadWindowToFocus) {
                    clients.openWindow('/');
                }
            })
        );
        notification.close();
    }
});