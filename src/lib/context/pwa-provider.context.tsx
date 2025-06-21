'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AppConfig } from '@/app/api/app-config/route';

// PWA Context türleri
interface PWAContextType {
  config: AppConfig | null;
  loading: boolean;
  isOnline: boolean;
  isInstalled: boolean;
  refreshConfig: () => Promise<void>;
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

  useEffect(() => {
    // Service Worker kayıt
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log('SW registered:', registration);
          
          // Service Worker güncellemesi kontrol et
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Yeni versiyon mevcut
                  console.log('Yeni versiyon mevcut!');
                }
              });
            }
          });
        })
        .catch((error: Error) => {
          console.error('SW registration failed:', error);
        });
    }

    // PWA yüklü mü kontrol et
    const checkIfInstalled = (): boolean => {
      if (typeof window === 'undefined') return false;
      
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone === true;
    };

    setIsInstalled(checkIfInstalled());

    // Online/offline durumu
    const handleOnline = (): void => setIsOnline(true);
    const handleOffline = (): void => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // İlk yüklemede online durumunu kontrol et
      setIsOnline(navigator.onLine);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Config'i güncelleme fonksiyonu
  const refreshConfig = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/app-config');
      if (response.ok) {
        const newConfig: AppConfig = await response.json();
        setConfig(newConfig);
        
        // Dinamik favicon güncelleme
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon && newConfig.favicon) {
          favicon.href = newConfig.favicon;
        }
        
        // Dinamik theme color güncelleme
        const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (themeColorMeta && newConfig.themeColor) {
          themeColorMeta.content = newConfig.themeColor;
        }
        
        // Title güncelleme
        if (newConfig.appName) {
          document.title = newConfig.appName;
        }
      }
    } catch (error) {
      console.error('Config güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: PWAContextType = {
    config,
    loading,
    isOnline,
    isInstalled,
    refreshConfig,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
}

// Custom hook
export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within PWAProvider');
  }
  return context;
}