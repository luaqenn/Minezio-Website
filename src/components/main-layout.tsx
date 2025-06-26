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

  if(pathname.includes('auth')) {
    return (children);
  }

  // Artık burada context'leri güvenle kullanabilirsiniz.
  const { website } = useContext(WebsiteContext);
  
  const { getServers } = useServerService();
  const [server, setServer] = useState<Server | null>(null);

  // Home component'inden taşıdığınız useEffect
  useEffect(() => {
    getServers().then((servers) => {
      // Bileşen mount olduğunda çalışır
      if (servers && servers.length > 0) {
        setServer(servers[0]);
      }
    });
    // getServers fonksiyonu genellikle değişmez ama yine de bağımlılık dizisine eklemek iyi bir pratiktir.
  }, []);

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