import type { AppConfig } from "../types/app";

export const DEFAULT_APPCONFIG: AppConfig = {
  appName: "Crafter Minecraft CMS",
  shortName: "Crafter",
  description: "Crafter is extended Minecraft CMS Service",
  themeColor: "#000000",
  backgroundColor: "#ffffff",
  icon192: "https://crafter.net.tr/icon-192x192.png",
  icon512: "https://crafter.net.tr/icon-512x512.png",
  favicon: "https://crafter.net.tr/favicon.ico",
};

export const DEFAULT_MANIFEST = {
  name: "Crafter Minecraft CMS",
  short_name: "Crafter",
  description: "Crafter is extended Minecraft CMS Service",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#000000",
  orientation: "portrait-primary",
  icons: [
    {
      src: "https://crafter.net.tr/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "https://crafter.net.tr/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable any",
    },
  ],
};
