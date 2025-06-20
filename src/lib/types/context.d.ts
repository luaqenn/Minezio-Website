export type WebsiteContextType = {
    website: Website | null;
    isLoading: boolean;
    isExpired: boolean;
    setWebsite: (website: Website) => void;
}