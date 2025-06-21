import { serverWebsiteService } from "@/lib/services/website.service";
import { NextRequest, NextResponse } from "next/server";

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation: string;
  icons: ManifestIcon[];
}

interface AppConfig {
  appName?: string;
  shortName?: string;
  description?: string;
  backgroundColor?: string;
  themeColor?: string;
  icon192?: string;
  icon512?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { getWebsite } = serverWebsiteService();

    const website = await getWebsite({
      id: process.env.NEXT_PUBLIC_WEBSITE_ID,
    });

    // Dinamik manifest oluştur
    const manifest: PWAManifest = {
      name: website.name || "Varsayılan Uygulama",
      short_name: website.name || "App",
      description: website.description || "Varsayılan açıklama",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      orientation: "portrait-primary",
      icons: [
        {
          src: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website.image}` || "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src:  `${process.env.NEXT_PUBLIC_BACKEND_URL}${website.image}` || "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
    };

    // Manifest'i JSON olarak döndür
    return NextResponse.json(manifest, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Manifest oluşturulurken hata:", error);

    // Hata durumunda varsayılan manifest döndür
    const defaultManifest: PWAManifest = {
      name: "Varsayılan Uygulama",
      short_name: "App",
      description: "Varsayılan açıklama",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      orientation: "portrait-primary",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
    };

    return NextResponse.json(defaultManifest, {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
