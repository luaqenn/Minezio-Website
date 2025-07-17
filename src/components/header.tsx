"use client";

import DiscordIcon from "@/assets/icons/social/DiscordIcon";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Navbar } from "./navbar";
import ServerStatusBar from "./header-components/ServerStatusBar";

export default function Header() {
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    players?: { online: number; max: number };
    version?: string;
    type?: string;
  } | null>(null);
  const [discordStatus, setDiscordStatus] = useState<{
    online: number;
    invite: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    async function fetchDataMinecraft() {
      try {
        const servers = await getServers();
        if (servers && servers.length > 0) {
          const selectedServer =
            servers.find((s) => s.port === 25565) || servers[0];
          const { ip, port } = selectedServer;
          const res = await fetch(
            `/api/status/minecraft?ip=${ip}&port=${port}`,
            { cache: "no-store" }
          );
          const data = await res.json();

          setServerStatus({
            online: data.online,
            players: data.players,
            version: data.version,
            type: data.type,
          });
        }
      } catch (error) {
        setServerStatus({ online: false });
      }
    }

    async function fetchDataDiscord() {
      try {
        if (!website?.discord?.guild_id) return;
        const res = await fetch(
          `/api/status/discord?guildId=${website?.discord.guild_id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setDiscordStatus(data);
      } catch (error) {
        setDiscordStatus(null);
      }
    }

    fetchDataMinecraft();
    fetchDataDiscord();

    const interval1 = setInterval(fetchDataMinecraft, 60_000);
    const interval2 = setInterval(fetchDataDiscord, 60_000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <header id="header" className="relative">
      <Navbar />
      <style jsx>{`
        @media (max-width: 768px) {
          .hidden.md\\:flex {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
