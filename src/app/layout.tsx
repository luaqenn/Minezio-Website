import type { Metadata } from "next";
import { WebsiteProvider } from "@/lib/context/website.context";
import { AuthProvider } from "@/lib/context/auth.context";
import { PWAProvider } from "@/lib/context/pwa-provider.context";
import PWAInstaller from "@/components/pwa-installer";
import "@/styles/globals.css";

// App config type tanımı
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

// API'den app config çek
async function getAppConfig(): Promise<AppConfig> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/app-config`, {
      next: {
        revalidate: 3600, // 1 saatte bir revalidate
        tags: ["app-config"], // Cache tag
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

// Dinamik metadata oluşturma
export async function generateMetadata(): Promise<Metadata> {
  const appConfig = await getAppConfig();

  return {
    title: {
      default: appConfig.appName,
      template: `%s | ${appConfig.appName}`,
    },
    description: appConfig.description,
    manifest: "/api/manifest",
    themeColor: appConfig.themeColor,
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
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

interface RootLayoutProps {
  children: React.ReactNode;
}

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
              {children}
              <PWAInstaller />
            </AuthProvider>
          </WebsiteProvider>
        </PWAProvider>
      </body>
    </html>
  );
}