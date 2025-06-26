import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface UsePerformanceOptions {
  onMetrics?: (metrics: PerformanceMetrics) => void;
  reportToAnalytics?: boolean;
}

// Type definitions for performance entries
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const lcpObserverRef = useRef<PerformanceObserver | null>(null);
  const clsObserverRef = useRef<PerformanceObserver | null>(null);
  const fidObserverRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Measure Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    // Measure First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries[entries.length - 1];
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });
    
    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      observerRef.current = fcpObserver;
    } catch (e) {
      console.warn('FCP observer not supported');
    }

    // Measure Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
      }
    });
    
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      lcpObserverRef.current = lcpObserver;
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // Measure Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });
    
    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      clsObserverRef.current = clsObserver;
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // Measure First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[entries.length - 1] as FirstInputEntry;
      if (fidEntry) {
        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });
    
    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      fidObserverRef.current = fidObserver;
    } catch (e) {
      console.warn('FID observer not supported');
    }

    return () => {
      observerRef.current?.disconnect();
      lcpObserverRef.current?.disconnect();
      clsObserverRef.current?.disconnect();
      fidObserverRef.current?.disconnect();
    };
  }, []);

  // Report metrics when they change
  useEffect(() => {
    if (options.onMetrics && Object.values(metrics).some(m => m !== null)) {
      options.onMetrics(metrics);
    }

    if (options.reportToAnalytics && Object.values(metrics).some(m => m !== null)) {
      // Report to analytics service
      reportToAnalytics(metrics);
    }
  }, [metrics, options]);

  return metrics;
}

// Performance optimization utilities
export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callback, options]);

  return observerRef.current;
}

// Memory usage monitoring
export function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Network status monitoring
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connection, setConnection] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null>(null);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        setConnection({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
        });
      }
    };

    updateOnlineStatus();
    updateConnectionInfo();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      (navigator as any).connection?.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return { isOnline, connection };
}

// Helper function to report metrics to analytics
function reportToAnalytics(metrics: PerformanceMetrics) {
  // Implement your analytics reporting logic here
  // Example: Google Analytics, custom analytics service, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'performance_metrics', {
      event_category: 'Performance',
      event_label: 'Core Web Vitals',
      value: Math.round(metrics.lcp || 0),
      custom_parameters: {
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
      },
    });
  }
} 