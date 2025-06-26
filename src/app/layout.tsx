import type { Metadata, Viewport } from "next";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";
import { PWAProvider } from "@/lib/context/pwa-provider.context";
import PWAInstaller from "@/components/pwa-installer";
import "@/styles/globals.css";
import { MainLayout } from "@/components/main-layout";
import { DEFAULT_APPCONFIG } from "@/lib/constants/pwa";
import { GoogleAnalytics } from '@next/third-parties/google'
import type { AppConfig } from "@/lib/types/app";
import { PerformanceOptimizer, PerformanceMonitor } from "@/components/performance-optimizer";

async function getAppConfig(): Promise<AppConfig> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/app-config`, {
      next: {
        revalidate: 3600,
        tags: ["app-config"],
      },
    });

    if (!response.ok) {
      throw new Error(`Config API hatası: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Varsayılan değerler
    return DEFAULT_APPCONFIG;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();

  return {
    title: {
      default: appConfig.appName,
      template: `%s | ${appConfig.appName}`,
    },
    description: appConfig.description,
    manifest: "/api/manifest",
    keywords: appConfig.keywords,
    authors: [{ name: appConfig.appName }],
    creator: appConfig.appName,
    publisher: appConfig.appName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: process.env.NEXT_PUBLIC_BASE_URL,
      title: appConfig.appName,
      description: appConfig.description,
      siteName: appConfig.appName,
      images: [
        {
          url: appConfig.icon192,
          width: 192,
          height: 192,
          alt: appConfig.appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: appConfig.appName,
      description: appConfig.description,
      images: [appConfig.icon192],
    },
    icons: {
      icon: [
        {
          url: appConfig.favicon,
          sizes: "32x32",
          type: "image/x-icon",
        },
        {
          url: appConfig.icon192,
          sizes: "192x192",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: appConfig.icon192,
          sizes: "192x192",
          type: "image/png",
        },
      ],
      shortcut: [appConfig.favicon],
    },
    appleWebApp: {
      capable: true,
      title: appConfig.appName,
      statusBarStyle: "default",
    },
    other: {
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "format-detection": "telephone=no",
      "msapplication-TileColor": appConfig.themeColor,
      "msapplication-tap-highlight": "no",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const appConfig = await getAppConfig();

  return {
    themeColor: appConfig.themeColor,
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    userScalable: true,
    viewportFit: "cover",
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

// RootLayout component'i aynı kalıyor
export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang="tr">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://minotar.net" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.crafter.net.tr" />
        <link rel="dns-prefetch" href="//minotar.net" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/api/manifest" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href={appConfig.favicon} as="image" />
        
        {/* Resource hints */}
        <link rel="prefetch" href="/store" />
        <link rel="prefetch" href="/auth/sign-in" />
      </head>
      <body>
        <PerformanceOptimizer enableMonitoring={process.env.NODE_ENV === 'development'}>
          <PWAProvider initialConfig={appConfig}>
            <WebsiteProvider>
              <AuthProvider>
                <MainLayout>{children}</MainLayout>
                <PWAInstaller />
              </AuthProvider>
            </WebsiteProvider>
          </PWAProvider>
          <PerformanceMonitor />
        </PerformanceOptimizer>
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                let swRegistration = null;
                
                async function registerServiceWorker() {
                  try {
                    swRegistration = await navigator.serviceWorker.register('/sw.js', {
                      scope: '/',
                      updateViaCache: 'none'
                    });
                    
                    // Service Worker güncellemelerini dinle
                    swRegistration.addEventListener('updatefound', () => {
                      const newWorker = swRegistration.installing;
                      
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // Yeni versiyon mevcut - sessizce işle
                        }
                      });
                    });
                    
                    // Service Worker mesajlarını dinle
                    navigator.serviceWorker.addEventListener('message', (event) => {
                      if (event.data && event.data.type === 'SW_UPDATED') {
                        window.location.reload();
                      }
                    });
                    
                  } catch (error) {
                    // Sessizce hataları yoksay
                  }
                }
                
                // Sayfa yüklendiğinde service worker'ı kaydet
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', registerServiceWorker);
                } else {
                  registerServiceWorker();
                }
                
                // Online/offline durumunu dinle
                window.addEventListener('online', () => {
                  // Service worker'a online durumunu bildir
                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      type: 'ONLINE_STATUS',
                      online: true
                    });
                  }
                });
                
                window.addEventListener('offline', () => {
                  // Service worker'a offline durumunu bildir
                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      type: 'ONLINE_STATUS',
                      online: false
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
      { appConfig.gaId && (
        <GoogleAnalytics gaId={appConfig.gaId} />
      ) }
    </html>
  );
}
