"use client";

import React, { useContext, useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { ForumCategory, ForumTopic, ForumStatistics } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  FaPlus, 
  FaUsers, 
  FaFire,
  FaFolder
} from "react-icons/fa";
import Widget from "@/components/widgets/widget";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  EmptyList,
  WidgetSkeleton,
  ForumCategoryCard,
  ForumTopicCard,
  LatestActivities,
  TopUsers
} from "@/components/forum";

// Lazy load components
const AuthForm = dynamic(
  () => import("@/components/widgets/auth-form").then(mod => ({ default: mod.AuthForm })),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

const DiscordWidget = dynamic(
  () => import("@/components/widgets/discord-widget"),
  { 
    ssr: false,
    loading: () => <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);



export default function ForumPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const forumService = useWebsiteForumService();
  
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [statistics, setStatistics] = useState<ForumStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    if (!website?.id) return;
    
    try {
      const [categoriesData, statsData] = await Promise.all([
        forumService.getAllCategories({ websiteId: website.id }),
        forumService.getForumStatistics({ websiteId: website.id })
      ]);

      setCategories(categoriesData);
      setStatistics(statsData);
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Forum verileri yüklenirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    } finally {
      setIsLoading(false);
      setIsStatsLoading(false);
    }
  }, [website?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 dark:text-gray-100 mb-2">
                Forum
              </h1>
              <p className="text-gray-400 dark:text-gray-400">
                Topluluğumuzla etkileşime geçin, sorular sorun ve tartışmalara katılın
              </p>
            </div>
            {isAuthenticated && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200"
                asChild
              >
                <Link href="/forum/topics/new">
                  <FaPlus className="mr-2" />
                  Yeni Konu
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Ana İçerik */}
          <div className={`${!isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"} space-y-6`}>
            {/* Kategoriler */}
            <div>
              <h2 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-4 flex items-center">
                <FaFolder className="mr-2 text-blue-400" />
                Kategoriler
              </h2>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {categories.map((category) => (
                    <ForumCategoryCard key={category.id} category={category} />
                  ))}
                </div>
              ) : (
                <EmptyList message="Henüz kategori bulunmuyor." />
              )}
            </div>

            {/* Son Konular */}
            <div>
              <h2 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-4 flex items-center">
                <FaFire className="mr-2 text-orange-400" />
                Son Konular
              </h2>
              {isStatsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : statistics?.lastTopics && statistics.lastTopics.length > 0 ? (
                <div className="space-y-4">
                  {statistics.lastTopics.map((topic) => (
                    <ForumTopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <EmptyList message="Henüz konu bulunmuyor." />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`${!isAuthenticated ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}>
            {!isAuthenticated && (
              <div className="relative z-10">
                <Suspense fallback={<div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                  <AuthForm asWidget={true} />
                </Suspense>
              </div>
            )}

            {isStatsLoading ? (
              <>
                <WidgetSkeleton lines={5} />
                <WidgetSkeleton lines={3} />
              </>
            ) : statistics ? (
              <>
                {/* Son Aktiviteler Widget */}
                <Widget>
                  <Widget.Header>
                    <FaFire className="inline mr-2 text-orange-400" />
                    Son Aktiviteler
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.lastTopics && statistics.lastTopics.length > 0 ? (
                      <LatestActivities statistics={statistics} />
                    ) : (
                      <EmptyList message="Henüz aktivite yok." />
                    )}
                  </Widget.Body>
                </Widget>

                {/* En Aktif Kullanıcılar Widget */}
                <Widget>
                  <Widget.Header>
                    <FaUsers className="inline mr-2 text-blue-400" />
                    En Aktif Kullanıcılar
                  </Widget.Header>
                  <Widget.Body>
                    {statistics.topMessageUsers && statistics.topMessageUsers.length > 0 ? (
                      <TopUsers statistics={statistics} />
                    ) : (
                      <EmptyList message="Henüz aktif kullanıcı yok." />
                    )}
                  </Widget.Body>
                </Widget>
              </>
            ) : (
              <EmptyList message="İstatistikler yüklenemedi." />
            )}

            {website?.discord && (
              <div className="">
                <Suspense fallback={<div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />}>
                  <DiscordWidget guild_id={website?.discord.guild_id ?? ""} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
