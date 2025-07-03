"use client";

import React, { useEffect } from "react";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ServerCard from "@/components/store/ServerCard";
import {
  Store as StoreIcon,
  Server as ServerIcon,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Loading from "@/components/loading";
import ContentFooter from "@/components/store/ContentFooter";

// Server status interface
interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  type?: string;
}

// Extended server interface with status
interface ServerWithStatus extends Server {
  isOnline?: boolean;
  playerCount?: number;
}

export default function Store() {
  const [servers, setServers] = React.useState<ServerWithStatus[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  const { getServers } = useServerService();

  // Fetch server status
  const fetchServerStatus = async (server: Server): Promise<ServerStatus> => {
    try {
      const { ip, port } = server;
      const res = await fetch(`/api/status/minecraft?ip=${ip}&port=${port}`, {
        cache: "no-store",
      });
      const data = await res.json();

      return {
        online: data.online,
        players: data.players,
        version: data.version,
        type: data.type,
      };
    } catch (error) {
      return { online: false };
    }
  };

  // Fetch all servers with their status
  const fetchServersWithStatus = async () => {
    try {
      const serverData = await getServers();
      if (serverData && serverData.length > 0) {
        // Fetch status for all servers concurrently
        const serversWithStatusPromises = serverData.map(
          async (server: Server) => {
            const status = await fetchServerStatus(server);
            return {
              ...server,
              isOnline: status.online,
              playerCount: status.players?.online || 0,
            } as ServerWithStatus;
          }
        );

        const serversWithStatus = await Promise.all(serversWithStatusPromises);
        setServers(serversWithStatus);
      } else {
        setServers([]);
      }
    } catch (error) {
      setServers([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchServersWithStatus().finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading show={true} message="Sunucular yükleniyor..." />;
  }

  const totalServers = servers?.length || 0;
  const onlineServers =
    servers?.filter((server) => server.isOnline).length || 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StoreIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mağaza</h1>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Oyun sunucularımızı keşfedin ve favori eşyalarınızı satın alın
          </p>

          {/* Stats Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                    <ServerIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Sunucu Durumu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {onlineServers}/{totalServers} sunucu aktif - Binlerce
                      eşya sizi bekliyor
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm px-3 py-1"
                  >
                    {onlineServers} Online
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm px-3 py-1"
                  >
                    {totalServers} Toplam
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Servers Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Sunucular
              </CardTitle>
              {totalServers > 0 && (
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {onlineServers} aktif
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="p-6">
            {!servers || totalServers === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <ServerIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Henüz sunucu bulunmuyor
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Şu anda aktif sunucu bulunmamaktadır. Lütfen daha sonra tekrar
                  kontrol edin.
                </p>
              </div>
            ) : (
              // Servers Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {servers.map((server: ServerWithStatus) => (
                  <ServerCard
                    key={server.id}
                    server={{
                      id: server.id,
                      name: server.name,
                      image: server.image || "/images/default-category.png",
                      isOnline: server.isOnline,
                      playerCount: server.playerCount,
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        {totalServers > 0 && (
          <ContentFooter
            header="Premium Eşya Koleksiyonu"
            message="Her sunucuda özel tasarlanmış eşyalar ve avantajlı fiyatlarla
                  oyun deneyiminizi geliştirin"
            color="purple"
          />
        )}
      </div>
    </>
  );
}
