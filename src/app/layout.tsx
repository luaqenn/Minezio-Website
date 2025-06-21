import type { Metadata, Viewport } from "next";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";
import { PWAProvider } from "@/lib/context/pwa-provider.context";
import PWAInstaller from "@/components/pwa-installer";
import "@/styles/globals.css";
import { MainLayout } from "@/components/main-layout";

type AppConfig = {
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icon192: string;
  icon512: string;
  favicon: string;
};

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
    console.error("App config alınamadı:", error);
    // Varsayılan değerler
    return {
      appName: "Web Sitesi",
      shortName: "Site",
      description: "Dinamik web sitesi uygulaması",
      themeColor: "#000000",
      backgroundColor: "#ffffff",
      icon192: "/icon-192x192.png",
      icon512: "/icon-512x512.png",
      favicon: "/favicon.ico",
    };
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
    icons: {
      icon: [
        {
          url: appConfig.favicon,
          sizes: "32x32",
          type: "image/x-icon",
        },
      ],
      apple: [
        {
          url: appConfig.icon192,
          sizes: "192x192",
          type: "image/png",
        },
      ],
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
    maximumScale: 1,
    userScalable: false,
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
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL} />
      </head>
      <body>
        <PWAProvider initialConfig={appConfig}>
          <WebsiteProvider>
            <AuthProvider>
              <MainLayout>{children}</MainLayout>
              <PWAInstaller />
            </AuthProvider>
          </WebsiteProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
