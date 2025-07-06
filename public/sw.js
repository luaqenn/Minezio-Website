// Development ortamında SW hiçbir şey yapmasın, sadece unregister ve cache temizle
if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
  self.addEventListener('install', function(e) {
    self.skipWaiting();
  });
  self.addEventListener('activate', function(e) {
    self.registration.unregister();
    // Development ortamında tüm cache'leri temizle
    e.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  // Diğer event'leri engelle
  self.addEventListener('fetch', function(e) {});
  self.addEventListener('message', function(e) {});
  self.addEventListener('sync', function(e) {});
  self.addEventListener('push', function(e) {});
  self.addEventListener('notificationclick', function(e) {});
  return;
}

// Service Worker versiyonu - güncellemeler için artırın
const CACHE_VERSION = "v2.0.2";
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;

// Önbelleğe alınacak kritik statik dosyalar
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/api/manifest",
  "/api/app-config"
];

// Dinamik önbellek stratejisi için pattern'ler
const CACHE_STRATEGIES = {
  // Resimler için cache-first
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|svg|ico|avif)$/i,
    strategy: "cacheFirst",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    cacheName: IMAGE_CACHE
  },
  // API istekleri için network-first
  api: {
    pattern: /\/api\//,
    strategy: "networkFirst",
    maxAge: 5 * 60 * 1000, // 5 dakika
    cacheName: API_CACHE
  },
  // Next.js statik dosyalar için stale-while-revalidate
  static: {
    pattern: /\/_next\/static\//,
    strategy: "staleWhileRevalidate",
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
    cacheName: STATIC_CACHE
  },
  // CSS ve JS dosyaları için cache-first
  assets: {
    pattern: /\.(css|js|woff|woff2|ttf|eot)$/i,
    strategy: "cacheFirst",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    cacheName: STATIC_CACHE
  },
  // HTML sayfalar için network-first
  pages: {
    pattern: /\.(html|htm)$/i,
    strategy: "networkFirst",
    maxAge: 60 * 60 * 1000, // 1 saat
    cacheName: DYNAMIC_CACHE
  }
};

// Service Worker kurulumu
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Statik cache'i oluştur
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(() => {
          // Sessizce hataları yoksay
        });
      }),
      // Diğer cache'leri de oluştur
      caches.open(DYNAMIC_CACHE),
      caches.open(API_CACHE),
      caches.open(IMAGE_CACHE)
    ])
    .then(() => {
      return self.skipWaiting();
    })
    .catch(() => {
      // Sessizce hataları yoksay
    })
  );
});

// Service Worker aktivasyonu
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Eski cache'leri temizle
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              return caches.delete(cacheName).catch(() => {
                // Sessizce hataları yoksay
              });
            }
          })
        );
      }),
      // Tüm clientları kontrol et
      self.clients.claim(),
    ])
  );
});

// Fetch event - ana önbellek mantığı
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Sadece GET istekleri için cache kullan
  if (request.method !== "GET") {
    return;
  }

  // Cross-origin istekleri için kontrol
  if (url.origin !== self.location.origin) {
    // Sadece güvenilir domainler için cache kullan
    const trustedDomains = [
      'https://api.crafter.net.tr',
      'https://minotar.net',
      'https://crafter.net.tr'
    ];
    
    if (!trustedDomains.some(domain => url.href.startsWith(domain))) {
      return;
    }
  }

  // App-config API'si için özel strateji (timestamp'li URL'leri de yakala)
  if (url.pathname === "/api/app-config") {
    console.log('🔧 SW: App-config request intercepted:', url.href);
    event.respondWith(handleAppConfigRequest(request));
    return;
  }

  // Manifest API'si için özel strateji
  if (url.pathname === "/api/manifest") {
    event.respondWith(handleManifestRequest(request));
    return;
  }

  // Diğer istekler için genel strateji
  event.respondWith(handleRequest(request));
});

// App config için özel cache stratejisi
async function handleAppConfigRequest(request) {
  const cacheName = API_CACHE;
  const url = new URL(request.url);

  console.log('🔧 SW: handleAppConfigRequest called for:', url.href);

  try {
    // Timestamp'li istekler için cache bypass
    const isTimestamped = url.searchParams.has('t');
    console.log('🔧 SW: Is timestamped request:', isTimestamped);
    
    // Önce network'ten dene
    console.log('🔧 SW: Trying network request...');
    const networkResponse = await fetch(request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    console.log('🔧 SW: Network response status:', networkResponse.status);
    console.log('🔧 SW: Network response ok:', networkResponse.ok);

    if (networkResponse.ok) {
      // Timestamp'li istekler cache'e kaydedilmez
      if (!isTimestamped) {
        console.log('🔧 SW: Caching response...');
        try {
          const cache = await caches.open(cacheName);
          
          // Response'u clone et ve arrayBuffer'ı al
          const responseClone = networkResponse.clone();
          const responseBuffer = await responseClone.arrayBuffer();
          
          // Cache'e kaydetmeden önce headers'ı düzenle
          const headers = new Headers(networkResponse.headers);
          headers.set('sw-cached', 'true');
          headers.set('sw-cache-time', Date.now().toString());
          
          const cachedResponse = new Response(responseBuffer, {
            status: networkResponse.status,
            statusText: networkResponse.statusText,
            headers: headers
          });
          
          await cache.put(request, cachedResponse);
          console.log('🔧 SW: Response cached successfully');
        } catch (cacheError) {
          console.error('🔧 SW: Cache error:', cacheError);
          // Cache hatası sessizce yoksay
        }
      } else {
        console.log('🔧 SW: Timestamped request - not caching');
      }
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    console.error('🔧 SW: Network request failed:', error);
    // Timestamp'li istekler için cache kullanma
    if (!isTimestamped) {
      console.log('🔧 SW: Trying cache fallback...');
      try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          console.log('🔧 SW: Returning cached response');
          return cachedResponse;
        }
      } catch (cacheError) {
        console.error('🔧 SW: Cache fallback error:', cacheError);
        // Cache hatası sessizce yoksay
      }
    }

    console.log('🔧 SW: Returning default config');
    // Cache'de de yoksa default config döndür
    return new Response(
      JSON.stringify({
        appName: "Crafter Minecraft CMS",
        shortName: "Crafter",
        description: "Crafter is extended Minecraft CMS Service",
        themeColor: "#000000",
        backgroundColor: "#ffffff",
        icon192: "https://crafter.net.tr/icon-192x192.png",
        icon512: "https://crafter.net.tr/icon-512x512.png",
        favicon: "https://crafter.net.tr/favicon.ico",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "sw-cached": "true",
          "sw-fallback": "true"
        },
      }
    );
  }
}

// Manifest için özel cache stratejisi
async function handleManifestRequest(request) {
  const cacheName = API_CACHE;

  try {
    const networkResponse = await fetch(request, {
      cache: 'no-cache'
    });

    if (networkResponse.ok) {
      try {
        const cache = await caches.open(cacheName);
        
        // Response'u clone et ve arrayBuffer'ı al
        const responseClone = networkResponse.clone();
        const responseBuffer = await responseClone.arrayBuffer();
        
        // Cache'e kaydetmeden önce headers'ı düzenle
        const headers = new Headers(networkResponse.headers);
        headers.set('sw-cached', 'true');
        headers.set('sw-cache-time', Date.now().toString());
        
        const cachedResponse = new Response(responseBuffer, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers: headers
        });
        
        await cache.put(request, cachedResponse);
      } catch (cacheError) {
        // Cache hatası sessizce yoksay
      }
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      // Cache hatası sessizce yoksay
    }

    // Default manifest döndür
    return new Response(
      JSON.stringify({
        name: "Crafter Minecraft CMS",
        short_name: "Crafter",
        description: "Crafter is extended Minecraft CMS Service",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        orientation: "portrait-primary",
        icons: [
          {
            src: "https://crafter.net.tr/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "https://crafter.net.tr/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "sw-cached": "true",
          "sw-fallback": "true"
        },
      }
    );
  }
}

// Genel istek işleme fonksiyonu
async function handleRequest(request) {
  try {
    const url = new URL(request.url);

    // Önce cache stratejisini belirle
    const strategy = getStrategy(request);

    switch (strategy.type) {
      case "cacheFirst":
        return await cacheFirst(request, strategy.cacheName, strategy.maxAge);
      case "networkFirst":
        return await networkFirst(request, strategy.cacheName, strategy.maxAge);
      case "staleWhileRevalidate":
        return await staleWhileRevalidate(request, strategy.cacheName, strategy.maxAge);
      default:
        return await fetch(request);
    }
  } catch (error) {
    // Hata durumunda offline response döndür
    return getOfflineResponse(request);
  }
}

// Strateji belirleme
function getStrategy(request) {
  const url = new URL(request.url);

  // Resimler için
  if (CACHE_STRATEGIES.images.pattern.test(url.pathname)) {
    return {
      type: "cacheFirst",
      cacheName: CACHE_STRATEGIES.images.cacheName,
      maxAge: CACHE_STRATEGIES.images.maxAge,
    };
  }

  // CSS ve JS dosyaları için
  if (CACHE_STRATEGIES.assets.pattern.test(url.pathname)) {
    return {
      type: "cacheFirst",
      cacheName: CACHE_STRATEGIES.assets.cacheName,
      maxAge: CACHE_STRATEGIES.assets.maxAge,
    };
  }

  // HTML sayfalar için
  if (CACHE_STRATEGIES.pages.pattern.test(url.pathname)) {
    return {
      type: "networkFirst",
      cacheName: CACHE_STRATEGIES.pages.cacheName,
      maxAge: CACHE_STRATEGIES.pages.maxAge,
    };
  }

  // Next.js statik dosyalar için
  if (CACHE_STRATEGIES.static.pattern.test(url.pathname)) {
    return {
      type: "staleWhileRevalidate",
      cacheName: CACHE_STRATEGIES.static.cacheName,
      maxAge: CACHE_STRATEGIES.static.maxAge,
    };
  }

  // API istekleri için
  if (CACHE_STRATEGIES.api.pattern.test(url.pathname)) {
    return {
      type: "networkFirst",
      cacheName: CACHE_STRATEGIES.api.cacheName,
      maxAge: CACHE_STRATEGIES.api.maxAge,
    };
  }

  // Default: network-first
  return {
    type: "networkFirst",
    cacheName: DYNAMIC_CACHE,
    maxAge: 60 * 60 * 1000, // 1 saat
  };
}

// Cache-first stratejisi
async function cacheFirst(request, cacheName, maxAge) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      try {
        const cache = await caches.open(cacheName);
        
        // Response'u clone et ve arrayBuffer'ı al
        const responseClone = networkResponse.clone();
        const responseBuffer = await responseClone.arrayBuffer();
        
        // Cache'e kaydetmeden önce headers'ı düzenle
        const headers = new Headers(networkResponse.headers);
        headers.set('sw-cached', 'true');
        headers.set('sw-cache-time', Date.now().toString());
        
        const cachedResponse = new Response(responseBuffer, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers: headers
        });
        
        await cache.put(request, cachedResponse);
      } catch (cacheError) {
        // Cache hatası sessizce yoksay
      }
    }

    return networkResponse;
  } catch (error) {
    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (cacheError) {
      // Cache hatası sessizce yoksay
    }

    return getOfflineResponse(request);
  }
}

// Network-first stratejisi
async function networkFirst(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      try {
        const cache = await caches.open(cacheName);
        
        // Response'u clone et ve arrayBuffer'ı al
        const responseClone = networkResponse.clone();
        const responseBuffer = await responseClone.arrayBuffer();
        
        // Cache'e kaydetmeden önce headers'ı düzenle
        const headers = new Headers(networkResponse.headers);
        headers.set('sw-cached', 'true');
        headers.set('sw-cache-time', Date.now().toString());
        
        const cachedResponse = new Response(responseBuffer, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers: headers
        });
        
        await cache.put(request, cachedResponse);
      } catch (cacheError) {
        // Cache hatası sessizce yoksay
      }
    }

    return networkResponse;
  } catch (error) {
    try {
      const cachedResponse = await caches.match(request);

      if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
        return cachedResponse;
      }
    } catch (cacheError) {
      // Cache hatası sessizce yoksay
    }

    return getOfflineResponse(request);
  }
}

// Stale-while-revalidate stratejisi
async function staleWhileRevalidate(request, cacheName, maxAge) {
  try {
    const cachedResponse = await caches.match(request);

    // Arka planda güncelleme yap
    const networkPromise = fetch(request)
      .then(async (networkResponse) => {
        if (networkResponse.ok) {
          try {
            const cache = await caches.open(cacheName);
            
            // Response'u clone et ve arrayBuffer'ı al
            const responseClone = networkResponse.clone();
            const responseBuffer = await responseClone.arrayBuffer();
            
            // Cache'e kaydetmeden önce headers'ı düzenle
            const headers = new Headers(networkResponse.headers);
            headers.set('sw-cached', 'true');
            headers.set('sw-cache-time', Date.now().toString());
            
            const cachedResponse = new Response(responseBuffer, {
              status: networkResponse.status,
              statusText: networkResponse.statusText,
              headers: headers
            });
            
            await cache.put(request, cachedResponse);
          } catch (cacheError) {
            // Cache hatası sessizce yoksay
          }
        }
        return networkResponse;
      })
      .catch(() => {
        // Network hatası sessizce yoksay
      });

    // Cache'den hemen dön, yoksa network'i bekle
    if (cachedResponse) {
      return cachedResponse;
    }

    return networkPromise;
  } catch (error) {
    return getOfflineResponse(request);
  }
}

// Cache expire kontrolü
function isExpired(response, maxAge) {
  try {
    const cacheTime = response.headers.get("sw-cache-time");
    if (!cacheTime) return false;

    const responseTime = parseInt(cacheTime);
    const currentTime = Date.now();

    return currentTime - responseTime > maxAge;
  } catch (error) {
    return false;
  }
}

// Offline response oluştur
function getOfflineResponse(request) {
  try {
    const url = new URL(request.url);

    // HTML sayfalar için offline sayfası döndür
    if (request.headers.get("accept")?.includes("text/html")) {
      return (
        caches.match("/offline.html") ||
        new Response(
          "<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>Offline</h1><p>İnternet bağlantınızı kontrol edin.</p></body></html>",
          { headers: { "Content-Type": "text/html" } }
        )
      );
    }

    // Resimler için placeholder
    if (request.headers.get("accept")?.includes("image")) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="sans-serif" font-size="14" fill="#666">Offline</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } }
      );
    }

    return new Response("Offline", { status: 503 });
  } catch (error) {
    return new Response("Offline", { status: 503 });
  }
}

// Background sync için (opsiyonel)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Offline sırasında kaydedilen işlemleri burada gerçekleştirin
  } catch (error) {
    // Sessizce hataları yoksay
  }
}

// Push notification (opsiyonel)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon || "/icons/icon-192.png",
      badge: data.badge || "/icons/icon-192.png",
      tag: data.tag || "default",
      data: data.data,
      actions: data.actions,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    // Sessizce hataları yoksay
  }
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  try {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  } catch (error) {
    // Sessizce hataları yoksay
  }
});

// Message event - client ile iletişim
self.addEventListener("message", (event) => {
  try {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
    
    if (event.data && event.data.type === "GET_VERSION") {
      event.ports[0].postMessage({ version: CACHE_VERSION });
    }
    
    if (event.data && event.data.type === "ONLINE_STATUS") {
      // Online/offline durumunu kaydet
      self.isOnline = event.data.online;
    }
    
    if (event.data && event.data.type === "CLEAR_CACHE") {
      // Cache temizleme isteği
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.delete(cacheName).catch(() => {
                // Sessizce hataları yoksay
              });
            })
          );
        })
      );
    }
    
    if (event.data && event.data.type === "GET_CACHE_INFO") {
      // Cache bilgilerini döndür
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          const cacheInfo = {};
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.open(cacheName).then((cache) => {
                return cache.keys().then((requests) => {
                  cacheInfo[cacheName] = requests.length;
                }).catch(() => {
                  cacheInfo[cacheName] = 0;
                });
              }).catch(() => {
                cacheInfo[cacheName] = 0;
              });
            })
          ).then(() => {
            event.ports[0].postMessage({ 
              cacheInfo,
              version: CACHE_VERSION,
              isOnline: self.isOnline || false
            });
          }).catch(() => {
            event.ports[0].postMessage({ 
              cacheInfo: {},
              version: CACHE_VERSION,
              isOnline: self.isOnline || false
            });
          });
        })
      );
    }
  } catch (error) {
    // Sessizce hataları yoksay
  }
});
