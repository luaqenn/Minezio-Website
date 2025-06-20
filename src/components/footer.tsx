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
} from "lucide-react";
import { Server } from "@/lib/types/server";

type Props = {
  server: Server | null;
};

const Footer = ({ server }: Props) => {
  const { website } = useContext(WebsiteContext);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, buttonId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [buttonId]: true }));
      
      // 2 saniye sonra animasyonu sıfırla
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [buttonId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handlePlayNowClick = () => {
    const serverIP = server?.ip || 'play.hypixel.net';
    copyToClipboard(serverIP, 'play-now');
  };

  const handleServerIPClick = () => {
    const serverIP = server?.ip || 'play.hypixel.net';
    copyToClipboard(serverIP, 'server-ip');
  };

  return (
    // DEĞİŞİKLİK: Ana arka plan bg-white, metin rengi text-slate-800 ve üst kenarlık açık tona çevrildi.
    <footer className="bg-white text-slate-800 mt-16 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col justify-between gap-3 items-left mb-6">
              <div>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${
                    website?.image || "/images/default-logo.png"
                  }`}
                  alt={website?.name || `Logo`}
                  width={200}
                  height={35}
                  className="max-h-logo z-30 hover:scale-105 transition-all duration-300"
                  priority
                />
              </div>
              <div>
                {/* DEĞİŞİKLİK: Metin renkleri koyu tonlara güncellendi. */}
                <h3 className="text-2xl font-bold text-slate-900">
                  {website?.name}
                </h3>
                <p className="text-slate-500 text-sm">{website?.description}</p>
              </div>
            </div>

            {/* DEĞİŞİKLİK: Metin rengi daha okunaklı bir tona çevrildi. */}
            <p className="text-slate-600 mb-6 leading-relaxed">
              {website?.footer_description ||
                "En iyi Minecraft server deneyimi için bize katılın. Premium eşyalar ve eşsiz oyun modları sizi bekliyor."}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {/* DEĞİŞİKLİK: Buton stilleri açık temaya uyarlandı. */}
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-100 border-slate-300 text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:border-pink-500 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-100 border-slate-300 text-slate-600 hover:text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300"
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-100 border-slate-300 text-slate-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* DEĞİŞİKLİK: Başlık metin rengi koyu tona çevrildi. */}
            <h4 className="text-lg font-semibold mb-6 text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-4">
              {/* DEĞİŞİKLİK: Link metin rengi koyu tona çevrildi. */}
              <li>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-slate-600 hover:text-blue-500 hover:bg-transparent justify-start transition-colors relative overflow-hidden group w-full"
                  onClick={handlePlayNowClick}
                >
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-4 h-4 mr-2">
                      {copiedStates['play-now'] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </div>
                    <span className="inline-block min-w-[120px] text-left">
                      {copiedStates['play-now'] ? (
                        <span className="text-green-500 animate-pulse">
                          IP Kopyalandı!
                        </span>
                      ) : (
                        "Hemen Oyna"
                      )}
                    </span>
                  </div>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-slate-600 hover:text-blue-500 hover:bg-transparent justify-start transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Sunucular
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-slate-600 hover:text-blue-500 hover:bg-transparent justify-start transition-colors"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Mağaza
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-slate-600 hover:text-blue-500 hover:bg-transparent justify-start transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Destek
                </Button>
              </li>
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-slate-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Sunucu Bilgileri
            </h4>
            <div className="space-y-4">
              {/* DEĞİŞİKLİK: Kart stili açık temaya uyarlandı. */}
              <Card className="bg-slate-50 border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={handleServerIPClick}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-slate-500 text-sm">Server IP</p>
                        <p className="text-slate-800 font-mono text-sm">
                          {server?.ip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {copiedStates['server-ip'] ? (
                        <div className="flex items-center gap-1">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-500 animate-pulse">
                            Kopyalandı!
                          </span>
                        </div>
                      ) : (
                        <Copy className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DEĞİŞİKLİK: Metin renkleri koyu tona çevrildi. */}
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-slate-600">7/24 Aktif</span>
              </div>

              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-slate-600">Premium Deneyim</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              İletişim
            </h4>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Son güncellemelerden haberdar olun ve özel tekliflerden
              yararlanın.
            </p>

            <div className="space-y-3">
              <div className="flex gap-2">
                {/* DEĞİŞİKLİK: Input alanı açık temaya uyarlandı. */}
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none text-white">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                E-posta bültenimize abone olarak{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-500 hover:text-blue-600"
                >
                  gizlilik politikamızı
                </Button>{" "}
                kabul etmiş olursunuz.
              </p>
            </div>
          </div>
        </div>

        {/* DEĞİŞİKLİK: Ayırıcı rengi açık tona çevrildi. */}
        <Separator className="bg-slate-200 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {website?.name || "Hypixel"}, 2025 • Tüm hakları saklıdır.
            </p>
            <div className="flex gap-2">
              {/* DEĞİŞİKLİK: Rozet stilleri açık temaya uyarlandı. */}
              <Badge
                variant="outline"
                className="border-slate-300 text-slate-600 bg-slate-100"
              >
                v1.0.0
              </Badge>
              {website?.platform && (
                <Badge
                  variant="outline"
                  className="border-blue-300 text-blue-700 bg-blue-50"
                >
                  {website.platform}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* DEĞİŞİKLİK: Buton stili açık temaya uyarlandı. */}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-blue-500 hover:bg-slate-100"
            >
              <span className="text-sm">Para Birimi & Dili değiştir</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-white border-slate-300 hover:bg-slate-100 text-slate-500"
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Play Now CTA (Bu bölümün renkli kalması, beyaz arka planda dikkat çekici bir CTA oluşturur) */}
        <div className="mt-10">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 border-none shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Maceraya Hazır mısın?
                  </h3>
                  <p className="text-blue-100">
                    Binlerce oyuncunun tercih ettiği sunucumuzda sen de yerini
                    al!
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  onClick={() => copyToClipboard(server?.ip || 'play.hypixel.net', 'cta-play')}
                >
                  <div className="flex items-center">
                    {copiedStates['cta-play'] ? (
                      <>
                        <Check className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-green-600 animate-pulse">
                          IP KOPYALANDI!
                        </span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        HEMEN OYNA
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </footer>
  );
};

export default Footer;