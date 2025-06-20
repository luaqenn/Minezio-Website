"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { AuthForm } from "@/components/auth-form";
import { TopBar } from "@/components/top-bar";
import Link from "next/link";
import Header from "@/components/header";
import { WebsiteContext } from "@/lib/context/website.context";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);

  return (
    <main>
      <TopBar broadcastItems={website.broadcast_items} />
      <Header />

      {/* Main Content */}
      <section className="container mx-auto py-20 pb-8">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* Sol Taraf - Ana İçerik (Slider, Haberler, vs.) */}
          <div className={`${!isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"} space-y-6`}>
            
            {/* Hero Slider */}
            <div className="rounded-2xl">
              <div className="carousel zippy-carousel relative overflow-hidden rounded-2xl">
                <div className="inner">
                  <div
                    className="los-slide active relative h-[400px]"
                    style={{
                      backgroundImage: "url('/images/header-bg.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="text-center md:text-left h-full flex flex-col justify-center p-6 relative z-30">
                      <div className="text-white text-2xl font-semibold">
                        Play Now!
                      </div>
                      <p className="text-white/75">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ea, sapiente quam. Rerum voluptatibus placeat blanditiis
                        sapiente dignissimos veritatis porro earum.
                      </p>
                      <Link
                        href="/play"
                        className="w-fit mx-auto md:mx-0 rounded-md rounded-tr-xl rounded-bl-xl py-2 px-3 font-medium text-white opacity-75 transition duration-300 hover:opacity-100 bg-green-500 mt-3 block"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Son Haberler
              </h2>
              <div className="space-y-4">
                {/* Haber öğeleri buraya gelecek */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Örnek Haber Başlığı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Haber içeriği buraya gelecek...
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2 saat önce
                  </span>
                </div>
              </div>
            </div>

            {/* Duyurular Bölümü */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Duyurular
              </h2>
              <div className="space-y-3">
                {/* Duyuru öğeleri buraya gelecek */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Örnek duyuru içeriği...
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sağ Taraf - Sidebar (Auth, Discord, vs.) */}
          <div className={`${!isAuthenticated ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}>
            
            {/* Auth Form */}
            {!isAuthenticated && (
              <div className="relative z-50">
                <div className="sticky top-6 transition-all duration-300 ease-in-out">
                  <AuthForm asWidget={true} />
                </div>
              </div>
            )}

            {/* Discord Widget */}
            {website.discord && (
              <div className="relative z-10">
                <div className="sticky top-[400px] transition-all duration-300 ease-in-out">
                  <iframe
                    src={`https://discord.com/widget?id=${website.discord.guild_id}&theme=dark`}
                    width="100%"
                    height="500"
                    allowTransparency={true}
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    className="rounded-2xl shadow-lg"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Kullanıcı giriş yaptıysa ek widget'lar */}
            {isAuthenticated && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    Hızlı Erişim
                  </h3>
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      className="block w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Profil
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block w-full text-left px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Ayarlar
                    </Link>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                    İstatistikler
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Oyunlar:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Skor:</span>
                      <span className="font-medium">1,250</span>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}