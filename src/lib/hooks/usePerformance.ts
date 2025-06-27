import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
  tbt: number | null; // Total Blocking Time
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

interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    tti: null,
    tbt: null,
  });
  
  const observerRef = useRef<PerformanceObserver | null>(null);
  const lcpObserverRef = useRef<PerformanceObserver | null>(null);
  const clsObserverRef = useRef<PerformanceObserver | null>(null);
  const fidObserverRef = useRef<PerformanceObserver | null>(null);
  const tbtObserverRef = useRef<PerformanceObserver | null>(null);

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

    // Measure Total Blocking Time
    let totalBlockingTime = 0;
    const tbtObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          totalBlockingTime += entry.duration - 50;
        }
      }
      setMetrics(prev => ({ ...prev, tbt: totalBlockingTime }));
    });
    
    try {
      tbtObserver.observe({ entryTypes: ['longtask'] });
      tbtObserverRef.current = tbtObserver;
    } catch (e) {
      console.warn('TBT observer not supported');
    }

    // Measure Time to Interactive (approximation)
    const measureTTI = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
        setMetrics(prev => ({ ...prev, tti: domContentLoaded }));
      }
    };

    if (document.readyState === 'complete') {
      measureTTI();
    } else {
      window.addEventListener('load', measureTTI);
    }

    return () => {
      observerRef.current?.disconnect();
      lcpObserverRef.current?.disconnect();
      clsObserverRef.current?.disconnect();
      fidObserverRef.current?.disconnect();
      tbtObserverRef.current?.disconnect();
      window.removeEventListener('load', measureTTI);
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

// Network status monitoring
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connection, setConnection] = useState<NetworkInformation | null>(null);

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      if ('connection' in navigator) {
        setConnection((navigator as any).connection);
      }
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if ('connection' in navigator) {
        (navigator as any).connection?.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return { isOnline, connection };
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

// Resource loading monitoring
export function useResourceTiming() {
  const [resourceMetrics, setResourceMetrics] = useState<{
    totalResources: number;
    totalSize: number;
    averageLoadTime: number;
    slowestResource: string;
  } | null>(null);

  useEffect(() => {
    const calculateResourceMetrics = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      if (resources.length === 0) return;

      const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
      const totalLoadTime = resources.reduce((sum, resource) => sum + resource.duration, 0);
      const averageLoadTime = totalLoadTime / resources.length;
      
      const slowestResource = resources.reduce((slowest, current) => 
        current.duration > slowest.duration ? current : slowest
      );

      setResourceMetrics({
        totalResources: resources.length,
        totalSize,
        averageLoadTime,
        slowestResource: slowestResource.name,
      });
    };

    // Wait for resources to load
    if (document.readyState === 'complete') {
      calculateResourceMetrics();
    } else {
      window.addEventListener('load', calculateResourceMetrics);
    }

    return () => {
      window.removeEventListener('load', calculateResourceMetrics);
    };
  }, []);

  return resourceMetrics;
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
        tti: metrics.tti,
        tbt: metrics.tbt,
      },
    });
  }
} 