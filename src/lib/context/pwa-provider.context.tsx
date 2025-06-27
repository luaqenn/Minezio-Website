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

  useEffect(() => {
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
      const response = await fetch("/api/app-config", {
        cache: "no-cache",
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
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

// Custom hook
export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within PWAProvider");
  }
  return context;
}
