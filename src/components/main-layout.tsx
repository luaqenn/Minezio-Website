"use client";

import { useContext, useState, useEffect } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { TopBar } from "@/components/top-bar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";

// Bu bileşen, provider'lar ile sayfalarınız arasında bir köprü görevi görecek.
export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const [server, setServer] = useState<Server | null>(null);

  useEffect(() => {
    getServers().then((servers) => {
      if (servers && servers.length > 0) {
        setServer(servers[0]);
      }
    });
  }, []);

  if (pathname.includes('auth')) {
    return (children);
  }

  return (
    <>
      <TopBar broadcastItems={website?.broadcast_items} />
      <Header />
      {/* Sayfa içeriği (örneğin Home component'i) buraya gelecek */}
      <main>{children}</main>
      <Footer server={server} />
    </>
  );
}