import { NextRequest, NextResponse } from "next/server";
import { PWAManifest, ManifestIcon } from "@/lib/types/app";
import { DEFAULT_MANIFEST } from "@/lib/constants/pwa";
import { serverWebsiteService } from "@/lib/services/website.service";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { getWebsite } = serverWebsiteService();

    const website = await getWebsite({
      id: process.env.NEXT_PUBLIC_WEBSITE_ID,
    });

    const manifest: PWAManifest = {
      name: website.name,
      short_name: website.name.split(" ")[0],
      description: website.description,
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#000000",
      orientation: "portrait-primary",
      icons: [
        {
          src: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image}`,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image}`,
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
    };

    // Manifest'i JSON olarak döndür
    return NextResponse.json(manifest, {
      headers: {
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {

    // Hata durumunda varsayılan manifest döndür
    const defaultManifest: PWAManifest = DEFAULT_MANIFEST;

    return NextResponse.json(defaultManifest, {
      headers: {
        "Cache-Control": process.env.NODE_ENV === 'development'
          ? "no-cache, no-store, must-revalidate"
          : "public, max-age=300",
      },
    });
  }
}
