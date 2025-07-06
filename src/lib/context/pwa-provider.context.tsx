"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { AppConfig } from "../types/app";

// PWA Context türleri
interface PWAContextType {
  config: AppConfig | null;
  loading: boolean;
  isOnline: boolean;
  isInstalled: boolean;
  swVersion: string | null;
  cacheInfo: Record<string, number> | null;
  refreshConfig: () => Promise<void>;
  clearCache: () => Promise<void>;
  getCacheInfo: () => Promise<void>;
  forceRefresh: () => void;
}

// Provider props türü
interface PWAProviderProps {
  children: ReactNode;
  initialConfig: AppConfig;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children, initialConfig }: PWAProviderProps) {
  const [config, setConfig] = useState<AppConfig | null>(initialConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [swVersion, setSwVersion] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<Record<string, number> | null>(null);
  const [forceRefreshKey, setForceRefreshKey] = useState<number>(0);

  useEffect(() => {
    // Development ortamında her mount'ta cache temizle
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              return caches.delete(cacheName);
            })
          );
        });
      }
    }

    // Service Worker kayıt ve yönetimi
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      let swRegistration: ServiceWorkerRegistration | null = null;

      const registerServiceWorker = async () => {
        try {
          swRegistration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          });

          // Service Worker versiyonunu al
          if (navigator.serviceWorker.controller) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data && event.data.version) {
                setSwVersion(event.data.version);
              }
            };
            navigator.serviceWorker.controller.postMessage(
              { type: "GET_VERSION" },
              [messageChannel.port2]
            );
          }

          // Service Worker güncellemesi kontrol et
          swRegistration.addEventListener("updatefound", () => {
            const newWorker = swRegistration!.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Yeni versiyon mevcut - sessizce işle
                }
              });
            }
          });

          // Service Worker mesajlarını dinle
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "SW_UPDATED") {
              window.location.reload();
            }
          });
        } catch (error: any) {
          // Sessizce hataları yoksay
        }
      };

      if (process.env.NODE_ENV === 'production') {
        registerServiceWorker();
      } else {
        // Development ortamında varsa SW'yi unregister et
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
        
        // Development ortamında cache temizleme
        if ('caches' in window) {
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                return caches.delete(cacheName);
              })
            );
          });
        }
      }
    }

    // PWA yüklü mü kontrol et
    const checkIfInstalled = (): boolean => {
      if (typeof window === "undefined") return false;

      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      );
    };

    setIsInstalled(checkIfInstalled());

    // Online/offline durumu
    const handleOnline = (): void => {
      setIsOnline(true);
      // Service worker'a online durumunu bildir
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "ONLINE_STATUS",
          online: true,
        });
      }
    };
    
    const handleOffline = (): void => {
      setIsOnline(false);
      // Service worker'a offline durumunu bildir
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "ONLINE_STATUS",
          online: false,
        });
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // İlk yüklemede online durumunu kontrol et
      setIsOnline(navigator.onLine);
    }

    // Development ortamında hot reload sonrası cache temizleme
    if (process.env.NODE_ENV === 'development') {
      const handleBeforeUnload = () => {
        // Sayfa yenilenmeden önce cache temizle
        if ('caches' in window) {
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                return caches.delete(cacheName);
              })
            );
          });
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
          window.removeEventListener('beforeunload', handleBeforeUnload);
        }
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  // Config'i güncelleme fonksiyonu
  const refreshConfig = async (): Promise<void> => {
    setLoading(true);
    try {
      // Service worker cache'ini bypass etmek için timestamp ekle
      const url = process.env.NODE_ENV === 'production' 
        ? `/api/app-config?t=${Date.now()}`
        : "/api/app-config";
        
      const response = await fetch(url, {
        cache: "no-cache",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (response.ok) {
        const newConfig: AppConfig = await response.json();
        setConfig(newConfig);

        // Dinamik favicon güncelleme
        const favicon = document.querySelector(
          'link[rel="icon"]'
        ) as HTMLLinkElement;
        if (favicon && newConfig.favicon) {
          favicon.href = newConfig.favicon;
        }

        // Dinamik theme color güncelleme
        const themeColorMeta = document.querySelector(
          'meta[name="theme-color"]'
        ) as HTMLMetaElement;
        if (themeColorMeta && newConfig.themeColor) {
          themeColorMeta.content = newConfig.themeColor;
        }

        // Title güncelleme
        if (newConfig.appName) {
          document.title = newConfig.appName;
        }
      }
    } catch (error) {
      console.error('PWA refreshConfig error:', error);
      // Sessizce hataları yoksay
    } finally {
      setLoading(false);
    }
  };

  // Cache temizleme fonksiyonu
  const clearCache = async (): Promise<void> => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_CACHE",
      });
      setCacheInfo(null);
    }
    
    // Browser cache'ini de temizle
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      } catch (error) {
        // Sessizce hataları yoksay
      }
    }
  };

  // Cache bilgilerini alma fonksiyonu
  const getCacheInfo = async (): Promise<void> => {
    if (navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data && event.data.cacheInfo) {
          setCacheInfo(event.data.cacheInfo);
          setSwVersion(event.data.version);
        }
      };
      navigator.serviceWorker.controller.postMessage(
        { type: "GET_CACHE_INFO" },
        [messageChannel.port2]
      );
    }
  };

  // Zorla yenileme fonksiyonu
  const forceRefresh = (): void => {
    setForceRefreshKey(prev => prev + 1);
    
    // Development ortamında cache temizle ve sayfayı yenile
    if (process.env.NODE_ENV === 'development') {
      clearCache().then(() => {
        window.location.reload();
      });
    }
  };

  const value: PWAContextType = {
    config,
    loading,
    isOnline,
    isInstalled,
    swVersion,
    cacheInfo,
    refreshConfig,
    clearCache,
    getCacheInfo,
    forceRefresh,
  };

  return (
    <PWAContext.Provider value={value}>
      <div key={forceRefreshKey}>
        {children}
      </div>
    </PWAContext.Provider>
  );
}

// Custom hook
export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within PWAProvider");
  }
  return context;
}
