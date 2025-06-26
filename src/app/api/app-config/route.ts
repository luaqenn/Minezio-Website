import { NextRequest, NextResponse } from "next/server";
import type { AppConfig } from "@/lib/types/app";
import { DEFAULT_APPCONFIG } from "@/lib/constants/pwa";
import { serverWebsiteService } from "@/lib/services/website.service";

export async function GET(
  request: NextRequest
): Promise<NextResponse<AppConfig>> {
  try {
    const { getWebsite } = serverWebsiteService();

    const website = await getWebsite({
      id: process.env.NEXT_PUBLIC_WEBSITE_ID,
    });

    const appConfig: AppConfig = {
      appName: website.name,
      shortName: website.name,
      description: website.description,
      themeColor: "black",
      backgroundColor: "white",
      icon192: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image}`,
      icon512: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image}`,
      favicon: `${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.favicon}`,
      gaId: website.google_analytics?.gaId || null,
      keywords: website.keywords || ["crafter", "minecraft", "cms"]
    };

    return NextResponse.json(appConfig, {
      headers: {
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    // Hata durumunda varsayılan değerler döndür
    const defaultConfig: AppConfig = DEFAULT_APPCONFIG;

    return NextResponse.json(defaultConfig, {
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
