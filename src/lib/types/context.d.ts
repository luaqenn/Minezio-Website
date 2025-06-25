import type { Website } from "./website";

export type WebsiteContextType = {
  website: Website | null,
  isLoading: boolean,
  isExpired: boolean,
  setWebsite: Dispatch<SetStateAction<Website | null>>;
}