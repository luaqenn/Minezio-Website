// app/api/app-config/route.ts
import { serverWebsiteService } from "@/lib/services/website.service";
import { NextRequest, NextResponse } from "next/server";

// API'den gelen raw data türü
interface ExternalAPIResponse {
  application_name: string;
  short_name: string;
  app_description: string;
  theme_color: string;
  background_color: string;
  icons?: {
    small?: string;
    large?: string;
  };
  favicon_url?: string;
}

// Frontend için optimize edilmiş config türü
export interface AppConfig {
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icon192: string;
  icon512: string;
  favicon: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<AppConfig>> {
  try {
    const { getWebsite } = serverWebsiteService();

    const website = await getWebsite({
      id: process.env.NEXT_PUBLIC_WEBSITE_ID,
    });

    // Frontend için uygun formata dönüştür
    const appConfig: AppConfig = {
      appName: website.name,
      shortName: website.name,
      description: website.description,
      themeColor: "#000000",
      backgroundColor: "#ffffff",
      icon192: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website.image}`,
      icon512: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website.image}`,
      favicon: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website.image}`,
    };

    return NextResponse.json(appConfig, {
      headers: {
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("App config API hatası:", error);

    // Hata durumunda varsayılan değerler döndür
    const defaultConfig: AppConfig = {
      appName: "Varsayılan Uygulama",
      shortName: "App",
      description: "Varsayılan açıklama",
      themeColor: "#000000",
      backgroundColor: "#ffffff",
      icon192: "/icon-192x192.png",
      icon512: "/icon-512x512.png",
      favicon: "/favicon.ico",
    };

    return NextResponse.json(defaultConfig, {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
