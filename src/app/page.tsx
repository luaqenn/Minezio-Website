"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { useStatisticsService } from "@/lib/services/statistics.service";
import { IPublicWebsiteStatistics } from "@/lib/types/statistics";
import { Server } from "@/lib/types/server";
import { formatTimeAgo } from "@/lib/utils";

// shadcn/ui Carousel ve Autoplay Eklentisi
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

// UI ve Widget Component'leri
import { AuthForm } from "@/components/widgets/auth-form";
import DiscordWidget from "@/components/widgets/discord-widget";
import Widget from "@/components/widgets/widget";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FaShoppingCart, FaCrown, FaGift, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Boş liste durumunda gösterilecek component
const EmptyList = ({ message }: { message: string }) => (
  <p className="text-center text-xs text-gray-500 dark:text-gray-400 p-4">
    {message}
  </p>
);

// Yükleniyor durumunda gösterilecek widget iskeleti
const WidgetSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <Widget>
    <Widget.Header>
      <Skeleton className="h-5 w-3/5" />
    </Widget.Header>
    <Widget.Body>
      <div className="space-y-3 p-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-2 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </Widget.Body>
  </Widget>
);

// Progress Bar Component
const CarouselProgressBar = ({
  totalSlides,
  currentSlide,
  autoplayDelay = 5000,
  isPaused = false,
}: {
  totalSlides: number;
  currentSlide: number;
  autoplayDelay?: number;
  isPaused?: boolean;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / (autoplayDelay / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide, autoplayDelay, isPaused]);

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-xs px-4">
      <div className="flex space-x-2 mb-2">
        {totalSlides !== 1 &&
          Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white" : "bg-white/30"
              }`}
            >
              {index === currentSlide && (
                <div
                  className="h-full bg-green-400 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const { getStatistics } = useStatisticsService();
  const [server, setServer] = useState<Server | null>(null);
  const [statistics, setStatistics] = useState<IPublicWebsiteStatistics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    getServers().then((servers) =>
      setServer(servers.find((server) => server.port === "25565") || servers[0])
    );

    getStatistics()
      .then((stats) => setStatistics(stats))
      .catch((err) => {
        withReactContent(Swal).fire({
          title: "Hata!",
          text: "İstatistikler yüklenirken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamamdır.",
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 pb-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 items-start">
          <div
            className={`${
              !isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"
            } space-y-4 sm:space-y-6 order-2 lg:order-1`}
          >
            {website?.sliders && website.sliders.length > 0 && (
              <Carousel
                plugins={[plugin.current]}
                className="w-full relative"
                onMouseEnter={() => {
                  plugin.current.stop();
                  setIsPaused(true);
                }}
                onMouseLeave={() => {
                  plugin.current.reset();
                  setIsPaused(false);
                }}
                opts={{
                  loop: true,
                }}
                onSelect={(emblaApi: any) => {
                  setCurrentSlide(emblaApi.selectedScrollSnap());
                }}
              >
                <CarouselContent>
                  {website?.sliders.map((slider) => (
                    <CarouselItem key={slider.id}>
                      <div
                        className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden"
                        style={{
                          backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${slider.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="text-center md:text-left h-full flex flex-col justify-center p-4 sm:p-6 lg:p-12 relative z-30">
                          <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
                            {slider.text}
                          </h2>
                          <p className="text-white/75 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
                            {slider.description}
                          </p>
                          <Link
                            href={slider.route}
                            className="w-fit mx-auto md:mx-0 rounded-md rounded-tr-xl rounded-bl-xl py-2 sm:py-3 px-4 sm:px-6 font-medium text-white opacity-75 transition duration-300 hover:opacity-100 bg-green-500 text-sm sm:text-base"
                          >
                            {slider.buttonText}
                          </Link>
                        </div>
                        <div className="bg-black/25 absolute z-20 top-0 left-0 h-full w-full">
                          <div className="absolute top-0 left-0 h-full w-full bg-green-900/25" />
                          <div className="absolute z-10 top-0 left-0 h-full w-full bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Progress Bar */}
                <CarouselProgressBar
                  totalSlides={website?.sliders.length}
                  currentSlide={currentSlide}
                  autoplayDelay={5000}
                  isPaused={isPaused}
                />
              </Carousel>
            )}
          </div>

          <div
            className={`${
              !isAuthenticated ? "lg:col-span-4" : "lg:col-span-3"
            } space-y-4 sm:space-y-6 order-1 lg:order-2`}
          >
            {!isAuthenticated && (
              <div className="relative z-10">
                <AuthForm asWidget={true} />
              </div>
            )}

            {isLoading ? (
              <>
                <WidgetSkeleton lines={5} />
                <WidgetSkeleton lines={3} />
              </>
            ) : statistics ? (
              <>
                {/* En Cömertler Widget */}
                <Widget>
                  <Widget.Header>
                    <FaCrown className="inline mr-2 text-yellow-400" />
                    En Cömertler
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.topCreditLoaders &&
                    statistics.topCreditLoaders.length > 0 ? (
                      <ul className="space-y-1">
                        {statistics.topCreditLoaders.map((loader, index) => (
                          <li
                            key={loader.id}
                            className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
                          >
                            <span className="w-8 text-center text-lg font-bold text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </span>
                            <Avatar
                              username={loader.username}
                              size={32}
                              className="mx-2"
                            />
                            <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                              {loader.username}
                            </p>
                            <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                              {loader.totalAmount.toFixed(2)} ₺
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList message="Henüz kimse kredi yüklemedi." />
                    )}
                  </Widget.Body>
                </Widget>

                {/* Son Kredi Yüklemeleri Widget */}
                <Widget>
                  <Widget.Header>
                    <FaGift className="inline mr-2 text-green-500" />
                    Son Kredi Yüklemeleri
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.latest.payments &&
                    statistics.latest.payments.length > 0 ? (
                      <ul className="space-y-1">
                        {statistics.latest.payments.map((payment) => (
                          <li
                            key={payment.id}
                            className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
                          >
                            <Avatar
                              username={payment.username}
                              size={32}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {payment.username}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {formatTimeAgo(payment.timestamp)}
                              </p>
                            </div>
                            <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
                              {payment.amount.toFixed(2)} ₺
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList message="Son zamanlarda kredi yüklenmedi." />
                    )}
                  </Widget.Body>
                </Widget>

                <Widget>
                  <Widget.Header>
                    <FaShoppingCart className="inline mr-2 text-blue-500" />
                    Son Alışverişler
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.latest.purchases &&
                    statistics.latest.purchases.length > 0 ? (
                      <ul className="space-y-1">
                        {statistics.latest.purchases.map((purchase) => (
                          <li
                            key={purchase.id}
                            className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
                          >
                            <Avatar
                              username={purchase.username}
                              size={32}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {purchase.username}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                "{purchase.productName}" aldı.
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatTimeAgo(purchase.timestamp)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList message="Son zamanlarda alışveriş yapılmadı." />
                    )}
                  </Widget.Body>
                </Widget>

                <Widget>
                  <Widget.Header>
                    <FaUserPlus className="inline mr-2 text-purple-500" />
                    Yeni Katılanlar
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.latest.signups &&
                    statistics.latest.signups.length > 0 ? (
                      <ul className="space-y-1">
                        {statistics.latest.signups.map((signup) => (
                          <li
                            key={signup.id}
                            className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
                          >
                            <Avatar
                              username={signup.username}
                              size={32}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {signup.username}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Aramıza katıldı
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatTimeAgo(signup.timestamp)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EmptyList message="Son zamanlarda yeni katılan olmadı." />
                    )}
                  </Widget.Body>
                </Widget>
              </>
            ) : (
              <EmptyList message="İstatistikler yüklenemedi." />
            )}

            {website?.discord && (
              <div className="">
                <DiscordWidget guild_id={website?.discord.guild_id ?? ""} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
