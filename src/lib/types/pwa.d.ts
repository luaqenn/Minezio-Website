declare global {
  interface Window {
    workbox?: any;
  }

  interface Navigator {
    standalone?: boolean;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

// BeforeInstallPromptEvent türü
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Manifest türleri
export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface WebAppManifest {
  name?: string;
  short_name?: string;
  description?: string;
  start_url?: string;
  display?: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  background_color?: string;
  theme_color?: string;
  orientation?:
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary";
  icons?: ManifestIcon[];
  scope?: string;
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  categories?: string[];
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
    platform?: string;
    label?: string;
  }>;
}

// Service Worker cache türleri
export interface CacheStrategy {
  cacheName: string;
  plugins?: any[];
}

export interface RouteMatch {
  url: URL;
  request: Request;
  event: FetchEvent;
}

export {};
