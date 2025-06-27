"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Website } from "../types/website";
import { WebsiteContextType } from "../types/context";
import { Expired } from "@/components/ui/expired";
import Loading from "@/components/loading";

export const WebsiteContext = createContext<WebsiteContextType>({
  website: null,
  isLoading: false,
  isExpired: false,
  setWebsite: () => {},
});

export const useWebsiteContext = () => {
  const { website, setWebsite } = useContext(WebsiteContext);
  return { website, setWebsite };
};

export const WebsiteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [website, setWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const response = await fetch("/api/website");
        const data = await response.json();

        if (data.success) {
          setWebsite(data.website);
          setIsExpired(data.isExpired);
        } else {
          setIsExpired(true);
        }
      } catch (error) {
        setIsExpired(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsite();
  }, []);

  if (isLoading) {
    return <Loading show={true} message="Yükleniyor..." fullScreen={true} />;
  }

  if (isExpired) {
    return <Expired />;
  }

  return (
    <WebsiteContext.Provider
      value={{ website, setWebsite, isLoading, isExpired }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};
