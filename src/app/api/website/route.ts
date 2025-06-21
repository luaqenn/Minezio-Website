import { NextResponse } from "next/server";
import { serverWebsiteService } from "@/lib/services/website.service";
import { LICENSE_KEY, WEBSITE_ID } from "@/lib/constants/base";

export async function GET() {
  const { verifyLicenseKey, getWebsite } = serverWebsiteService();

  try {
    const license = await verifyLicenseKey({ key: LICENSE_KEY || "" });

    if (license.success) {
      const website = await getWebsite({ id: license.website.id || "" });

      return NextResponse.json({
        success: true,
        website: website,
        isExpired: false,
      });
    } else {
      const website = await getWebsite({ id: WEBSITE_ID || "" });

      return NextResponse.json({
        success: true,
        website,
        isExpired: true,
      });
    }
  } catch (error: any) {
    console.error("Website API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Website bilgileri alınamadı",
        isExpired: true,
      },
      { status: 500 }
    );
  }
}
