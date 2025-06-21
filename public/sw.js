// Service Worker versiyonu - güncellemeler için artırın
const CACHE_VERSION = "v1.0.0";
const STATIC_CACHE = `static-cache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-cache-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;

// Önbelleğe alınacak statik dosyalar
const STATIC_ASSETS = [
  "/",
  "/offline.html"
];

// Dinamik önbellek stratejisi için pattern'ler
const CACHE_STRATEGIES = {
  // Resimler için cache-first
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
    strategy: "cacheFirst",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
  },
  // API istekleri için network-first
  api: {
    pattern: /\/api\//,
    strategy: "networkFirst",
    maxAge: 5 * 60 * 1000, // 5 dakika
  },
  // Statik dosyalar için stale-while-revalidate
  static: {
    pattern: /\/_next\/static\//,
    strategy: "staleWhileRevalidate",
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
  },
};

// Service Worker kurulumu
self.addEventListener("install", (event) => {
  console.log("SW: Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("SW: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Hemen aktif hale getir
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("SW: Static cache error:", error);
      })
  );
});

// Service Worker aktivasyonu
self.addEventListener("activate", (event) => {
  console.log("SW: Activate event");

  event.waitUntil(
    Promise.all([
      // Eski cache'leri temizle
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log("SW: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
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

  // App-config API'si için özel strateji
  if (url.pathname === "/api/app-config") {
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

  try {
    // Önce network'ten dene
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Başarılıysa cache'e kaydet
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    console.log("SW: Network failed for app-config, trying cache");

    // Network başarısızsa cache'den dön
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

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
        },
      }
    );
  }
}

// Manifest için özel cache stratejisi
async function handleManifestRequest(request) {
  const cacheName = API_CACHE;

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    console.log("SW: Network failed for manifest, trying cache");

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
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
        },
      }
    );
  }
}

// Genel istek işleme fonksiyonu
async function handleRequest(request) {
  const url = new URL(request.url);

  // Önce cache stratejisini belirle
  const strategy = getStrategy(request);

  switch (strategy.type) {
    case "cacheFirst":
      return cacheFirst(request, strategy.cacheName, strategy.maxAge);
    case "networkFirst":
      return networkFirst(request, strategy.cacheName, strategy.maxAge);
    case "staleWhileRevalidate":
      return staleWhileRevalidate(request, strategy.cacheName, strategy.maxAge);
    default:
      return fetch(request);
  }
}

// Strateji belirleme
function getStrategy(request) {
  const url = new URL(request.url);

  // Resimler için
  if (CACHE_STRATEGIES.images.pattern.test(url.pathname)) {
    return {
      type: "cacheFirst",
      cacheName: DYNAMIC_CACHE,
      maxAge: CACHE_STRATEGIES.images.maxAge,
    };
  }

  // Statik dosyalar için
  if (CACHE_STRATEGIES.static.pattern.test(url.pathname)) {
    return {
      type: "staleWhileRevalidate",
      cacheName: STATIC_CACHE,
      maxAge: CACHE_STRATEGIES.static.maxAge,
    };
  }

  // API istekleri için
  if (CACHE_STRATEGIES.api.pattern.test(url.pathname)) {
    return {
      type: "networkFirst",
      cacheName: API_CACHE,
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
  const cachedResponse = await caches.match(request);

  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }

    return getOfflineResponse(request);
  }
}

// Network-first stratejisi
async function networkFirst(request, cacheName, maxAge) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }

    return getOfflineResponse(request);
  }
}

// Stale-while-revalidate stratejisi
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cachedResponse = await caches.match(request);

  // Arka planda güncelleme yap
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => {
      console.log("SW: Network update failed for:", request.url);
    });

  // Cache'den hemen dön, yoksa network'i bekle
  if (cachedResponse) {
    return cachedResponse;
  }

  return networkPromise;
}

// Cache expire kontrolü
function isExpired(response, maxAge) {
  const dateHeader = response.headers.get("date");
  if (!dateHeader) return false;

  const responseTime = new Date(dateHeader).getTime();
  const currentTime = Date.now();

  return currentTime - responseTime > maxAge;
}

// Offline response oluştur
function getOfflineResponse(request) {
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
}

// Background sync için (opsiyonel)
self.addEventListener("sync", (event) => {
  console.log("SW: Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Offline sırasında kaydedilen işlemleri burada gerçekleştirin
    console.log("SW: Background sync completed");
  } catch (error) {
    console.error("SW: Background sync failed:", error);
  }
}

// Push notification (opsiyonel)
self.addEventListener("push", (event) => {
  if (!event.data) return;

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
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
