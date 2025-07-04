'use client';

import { useState, useEffect, JSX } from 'react';
import { usePWA } from '@/lib/context/pwa-provider.context';

// BeforeInstallPromptEvent türü (standart olmadığı için manuel tanımlama)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Component state türleri
interface InstallState {
  deferredPrompt: BeforeInstallPromptEvent | null;
  showInstallPrompt: boolean;
  isInstalling: boolean;
}

export default function PWAInstaller(): JSX.Element | null {
  const { config, isOnline, isInstalled } = usePWA();
  const [installState, setInstallState] = useState<InstallState>({
    deferredPrompt: null,
    showInstallPrompt: false,
    isInstalling: false,
  });

  useEffect(() => {
    // Install prompt event'ini yakala
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setInstallState(prev => ({
        ...prev,
        deferredPrompt: promptEvent,
        showInstallPrompt: !isInstalled,
      }));
    };

    // App yüklendikten sonra
    const handleAppInstalled = (): void => {
      setInstallState({
        deferredPrompt: null,
        showInstallPrompt: false,
        isInstalling: false,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [isInstalled]);

  const handleInstallClick = async (): Promise<void> => {
    const { deferredPrompt } = installState;
    if (!deferredPrompt) return;

    setInstallState(prev => ({ ...prev, isInstalling: true }));

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      
      setInstallState({
        deferredPrompt: null,
        showInstallPrompt: false,
        isInstalling: false,
      });
    } catch (error) {
      setInstallState(prev => ({ ...prev, isInstalling: false }));
    }
  };

  const handleDismiss = (): void => {
    setInstallState(prev => ({ ...prev, showInstallPrompt: false }));
    
    // LocalStorage kullanarak 24 saat boyunca gösterme
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }
  };

  // Gösterim koşulları
  const shouldShow = (): boolean => {
    if (isInstalled || !isOnline || !installState.showInstallPrompt || !config) {
      return false;
    }

    // Daha önce dismiss edilmişse ve 24 saat geçmemişse gösterme
    if (typeof window !== 'undefined') {
      const dismissedTime = localStorage.getItem('pwa-install-dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    return true;
  };

  if (!shouldShow()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={config?.icon192} 
            alt={`${config?.appName} Icon`}
            className="w-12 h-12 rounded-lg object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {config?.appName} Uygulamasını Yükle
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            Daha hızlı erişim için uygulamayı cihazınıza yükleyin
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleInstallClick}
              disabled={installState.isInstalling}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              {installState.isInstalling ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <span>Yükle</span>
              )}
            </button>
            <button
              onClick={handleDismiss}
              disabled={installState.isInstalling}
              className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
            >
              Daha Sonra
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          disabled={installState.isInstalling}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
          aria-label="Kapat"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}