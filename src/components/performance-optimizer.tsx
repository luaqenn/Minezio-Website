"use client";

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { usePerformance, useNetworkStatus, useMemoryUsage } from '@/lib/hooks/usePerformance';
import Loading from './loading';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableLazyLoading?: boolean;
  fallback?: React.ReactNode;
}

// Lazy load components that are not immediately needed
const LazyAuthForm = lazy(() => import('./widgets/auth-form').then(module => ({ default: module.AuthForm })));
const LazyPWAInstaller = lazy(() => import('./pwa-installer'));
const LazyDiscordWidget = lazy(() => import('./widgets/discord-widget'));

export function PerformanceOptimizer({ 
  children, 
  enableMonitoring = true,
  enableLazyLoading = true,
  fallback = <Loading show={true} message="Yükleniyor..." fullScreen={true} />
}: PerformanceOptimizerProps) {
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformance({
    reportToAnalytics: enableMonitoring,
    onMetrics: (metrics) => {
      if (enableMonitoring) {
        console.log('Performance Metrics:', metrics);
      }
    }
  });
  
  const { isOnline, connection } = useNetworkStatus();
  const memoryInfo = useMemoryUsage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Performance monitoring effect
  useEffect(() => {
    if (!enableMonitoring) return;

    // Log performance metrics to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Monitoring');
      console.log('Network Status:', { isOnline, connection });
      console.log('Memory Usage:', memoryInfo);
      console.log('Performance Metrics:', performanceMetrics);
      console.groupEnd();
    }

    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_data', {
        event_category: 'Performance',
        event_label: 'App Performance',
        value: Math.round(performanceMetrics.lcp || 0),
        custom_parameters: {
          network_type: connection?.effectiveType || 'unknown',
          memory_usage: memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0,
          is_online: isOnline,
        }
      });
    }
  }, [performanceMetrics, isOnline, connection, memoryInfo, enableMonitoring]);

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 px-4">
        <span className="text-sm">İnternet bağlantısı yok. Çevrimdışı modda çalışıyoruz.</span>
      </div>
    );
  }

  if (!isClient) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Lazy loading wrapper component
interface LazyComponentProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

export function LazyComponent({ 
  component, 
  fallback = <Loading show={true} message="Bileşen yükleniyor..." fullScreen={true} />,
  props = {}
}: LazyComponentProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Performance monitoring component
export function PerformanceMonitor() {
  const metrics = usePerformance({ reportToAnalytics: true });
  const { isOnline, connection } = useNetworkStatus();
  const memoryInfo = useMemoryUsage();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Performance Monitor</h3>
      <div className="space-y-1">
        <div>Network: {connection?.effectiveType || 'unknown'}</div>
        <div>Online: {isOnline ? 'Yes' : 'No'}</div>
        {memoryInfo && (
          <div>Memory: {Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024)}MB</div>
        )}
        {metrics.lcp && <div>LCP: {Math.round(metrics.lcp)}ms</div>}
        {metrics.fcp && <div>FCP: {Math.round(metrics.fcp)}ms</div>}
        {metrics.cls && <div>CLS: {metrics.cls.toFixed(3)}</div>}
      </div>
    </div>
  );
} 