"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WebsiteContext } from "@/lib/context/website.context";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Moon,
  Play,
  Heart,
  ExternalLink,
  Mail,
  MapPin,
  Clock,
  Users,
  Globe,
  Shield,
  Star,
  Sparkles,
  Copy,
  Check,
  Sun,
} from "lucide-react";
import { Server } from "@/lib/types/server";
import Link from "next/link";
import { useTheme } from "next-themes";

type Props = {
  server: Server | null;
};

const Footer = ({ server }: Props) => {
  const { website } = useContext(WebsiteContext);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { theme, setTheme, resolvedTheme } = useTheme();
  console.log(theme, resolvedTheme)

  const copyToClipboard = async (text: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [buttonId]: true }));

      // 2 saniye sonra animasyonu sıfırla
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [buttonId]: false }));
      }, 2000);
    } catch (err) {
    }
  };

  const handlePlayNowClick = () => {
    const serverIP = server?.ip || "play.hypixel.net";
    copyToClipboard(serverIP, "play-now");
  };

  const handleServerIPClick = () => {
    const serverIP = server?.ip || "play.hypixel.net";
    copyToClipboard(serverIP, "server-ip");
  };

  return (
    <footer className="bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 mt-16 border-t border-slate-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Sol Blok: Logo & Hakkımızda */}
          <div className="lg:col-span-1 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-2 items-start">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image || "/images/default-logo.png"}`}
                alt={website?.name || `Logo`}
                width={200}
                height={200}
                className="p-2"
                priority
              />
              <h3 className="text-xl font-extrabold mt-2 text-slate-900 dark:text-white">{website?.name}</h3>
              <p className="text-slate-700 dark:text-slate-200 text-sm max-w-xs leading-relaxed">{website?.description}</p>
              <p className="text-xs text-slate-500 font-semibold mt-2">We are not affiliated with Mojang AB or Minecraft.</p>
            </div>
            <div className="flex gap-2 mt-2">
              <a href={website?.socials?.instagram || "#"} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:border-pink-500 transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a href={website?.socials?.youtube || "#"} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:border-pink-500 transition-all duration-300"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </a>
              <a href={website?.socials?.discord || "#"} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:border-pink-500 transition-all duration-300"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Orta Blok: Hızlı Menü */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Hızlı Menü
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent justify-start w-full">
                    <Play className="h-4 w-4 mr-2" /> Anasayfa
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/store">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent justify-start w-full">
                    <Heart className="h-4 w-4 mr-2" /> Mağaza
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/forum">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent justify-start w-full">
                    <Users className="h-4 w-4 mr-2" /> Forum
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <Button variant="ghost" className="p-0 h-auto text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent justify-start w-full">
                    <Shield className="h-4 w-4 mr-2" /> Destek
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-cyan-400" />
              Bağlantılar
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/rules" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Kurallar</Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Hizmet Şartları</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Gizlilik Politikası</Link>
              </li>
            </ul>
          </div>

          {/* Orta Blok: Sunucu Bilgileri */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              Sunucu Bilgileri
            </h4>
            <div className="space-y-4">
              <Card className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleServerIPClick}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-slate-700 dark:text-slate-200 text-xs">Server IP</p>
                        <p className="text-slate-900 dark:text-white font-mono text-sm">{server?.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {copiedStates["server-ip"] ? (
                        <div className="flex items-center gap-1">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600 animate-pulse">Kopyalandı!</span>
                        </div>
                      ) : (
                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-slate-700 dark:text-slate-300">7/24 Aktif</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-700 dark:text-slate-300">Premium Deneyim</span>
              </div>
            </div>
          </div>

          {/* Sağ Blok: Bağlantılar */}
          
        </div>

        <Separator className="bg-slate-200 dark:bg-slate-800 mb-8" />

        {/* Alt Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <div className="flex flex-row items-center gap-2">
            <p className="text-slate-700 dark:text-slate-200 text-sm">
              © {website?.name || "Hypixel"}, 2025 • Tüm hakları saklıdır.
            </p>
            <Badge variant="outline" className="border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 align-middle h-7 px-3 flex items-center">v1.0.0</Badge>
            <Link href="https://crafter.net.tr">
              <Badge variant="outline" className="border-blue-700 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 align-middle h-7 px-3 flex items-center">Crafter</Badge>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="text-sm">Para Birimi & Dili değiştir</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon" className="bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {(theme === "system" ? resolvedTheme : theme) === "dark" ? (<Sun className="h-4 w-4" />) : (<Moon className="h-4 w-4" />)}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
