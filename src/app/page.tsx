"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AuthForm } from "@/components/widgets/auth-form";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import Header from "@/components/header";
import { WebsiteContext } from "@/lib/context/website.context";
import Footer from "@/components/footer";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import DiscordWidget from "@/components/widgets/discord-widget";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const [server, setServer] = useState<Server | null>(null);

  useEffect(() => {
    getServers().then((servers) => {
      setServer(servers[0]);
    });
  }, []);

  return (
    <main className="min-h-screen">
      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 pb-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 items-start">
          {/* Sol Taraf - Ana İçerik (Slider, Haberler, vs.) */}
          <div
            className={`${
              !isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"
            } space-y-4 sm:space-y-6 order-2 lg:order-1`}
          >
            {/* Hero Slider */}
            <div className="rounded-xl sm:rounded-2xl">
              <div className="carousel zippy-carousel relative overflow-hidden rounded-xl sm:rounded-2xl">
                <div className="inner">
                  <div
                    className="los-slide active relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
                    style={{
                      backgroundImage: "url('/images/header-bg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="text-center md:text-left h-full flex flex-col justify-center p-4 sm:p-6 relative z-30">
                      <div className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                        Play Now!
                      </div>
                      <p className="text-white/75 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ea, sapiente quam. Rerum voluptatibus placeat blanditiis
                        sapiente dignissimos veritatis porro earum.
                      </p>
                      <Link
                        href="/play"
                        className="w-fit mx-auto md:mx-0 rounded-md rounded-tr-xl rounded-bl-xl py-2 sm:py-3 px-4 sm:px-6 font-medium text-white opacity-75 transition duration-300 hover:opacity-100 bg-green-500 text-sm sm:text-base"
                      >
                        Bağlantıya git
                      </Link>
                    </div>

                    {/* Background effect */}
                    <div className="bg-black/25 absolute z-20 top-0 left-0 h-full w-full">
                      <div className="absolute top-0 left-0 h-full w-full bg-green-900/25" />
                      <div className="absolute z-10 top-0 left-0 h-full w-full bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                    </div>
                  </div>
                </div>
                <ul className="indicators" />
              </div>
            </div>

            {/* Haberler Bölümü */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Son Haberler
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {/* Haber öğeleri buraya gelecek */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                    Örnek Haber Başlığı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    Haber içeriği buraya gelecek...
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                    2 saat önce
                  </span>
                </div>
                {/* Ek haber örnekleri mobile görünümde daha az yer kaplaması için */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                    İkinci Haber Başlığı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    İkinci haber içeriği...
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                    5 saat önce
                  </span>
                </div>
              </div>
            </div>

            {/* Duyurular Bölümü */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Duyurular
              </h2>
              <div className="space-y-3">
                {/* Duyuru öğeleri buraya gelecek */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm leading-relaxed">
                    Örnek duyuru içeriği...
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm leading-relaxed">
                    Önemli bakım duyurusu...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Sidebar (Auth, Discord, vs.) */}
          <div
            className={`${
              !isAuthenticated ? "lg:col-span-4" : "lg:col-span-3"
            } space-y-4 sm:space-y-6 order-1 lg:order-2`}
          >
            {/* Auth Form */}
            {!isAuthenticated && (
              <div className="relative z-50">
                <div className="lg:sticky lg:top-6 transition-all duration-300 ease-in-out">
                  <AuthForm asWidget={true} />
                </div>
              </div>
            )}

            {/* Discord Widget - Sadece desktop'ta göster */}
            {website.discord && (
              <DiscordWidget guild_id={website.discord.guild_id} />
            )}

            {/* Kullanıcı giriş yaptıysa ek widget'lar */}
            {isAuthenticated && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-sm sm:text-base">
                    Hızlı Erişim
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Profil
                    </Link>
                    <Link
                      href="/settings"
                      className="block w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Ayarlar
                    </Link>
                    {/* Mobile'da ek seçenekler */}
                    <Link
                      href="/games"
                      className="block w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:hidden"
                    >
                      Oyunlar
                    </Link>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-sm sm:text-base">
                    İstatistikler
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Oyunlar:
                      </span>
                      <span className="font-medium text-sm sm:text-base">
                        24
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Skor:
                      </span>
                      <span className="font-medium text-sm sm:text-base">
                        1,250
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Seviye:
                      </span>
                      <span className="font-medium text-sm sm:text-base">
                        12
                      </span>
                    </div>
                  </div>
                </div>

                {/* Server Status - Sadece mobile'da göster */}
                {server && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm lg:hidden">
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-sm">
                      Sunucu Durumu
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Oyuncular
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Online
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
