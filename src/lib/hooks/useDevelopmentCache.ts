import { useEffect, useCallback } from 'react';
import { usePWA } from '../context/pwa-provider.context';
import { clearDevelopmentCache, forceComponentRefresh } from '../utils';

export function useDevelopmentCache() {
  const { clearCache, forceRefresh } = usePWA();

  // Hot reload sonrası cache temizleme
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleBeforeUnload = () => {
        clearDevelopmentCache();
      };

      const handleFocus = () => {
        // Sayfa focus olduğunda cache kontrolü
        clearDevelopmentCache();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('focus', handleFocus);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  // Cache temizleme fonksiyonu
  const clearAllCache = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      await clearCache();
      await clearDevelopmentCache();
      console.log('All cache cleared');
    }
  }, [clearCache]);

  // Component yenileme fonksiyonu
  const refreshComponent = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      forceRefresh();
      forceComponentRefresh();
    }
  }, [forceRefresh]);

  // Tam yenileme fonksiyonu
  const fullRefresh = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      await clearAllCache();
      refreshComponent();
    }
  }, [clearAllCache, refreshComponent]);

  return {
    clearAllCache,
    refreshComponent,
    fullRefresh,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
} 