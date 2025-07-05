"use client";

import React, { useContext, useEffect, useState, useCallback, Suspense } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { ForumCategory, ForumTopic } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  FaComments, 
  FaEye, 
  FaThumbtack, 
  FaLock, 
  FaPlus, 
  FaArrowLeft,
  FaClock,
  FaUser,
  FaUsers,
  FaFolder,
  FaSearch,
  FaSort
} from "react-icons/fa";
import Widget from "@/components/widgets/widget";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  EmptyList,
  WidgetSkeleton,
  ForumTopicCard,
  SubCategories,
  CategoryStats,
  renderIcon,
  ForumCategoryCard
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

export default function CategoryPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const forumService = useWebsiteForumService();
  const params = useParams();
  const router = useRouter();
  
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTopicsLoading, setIsTopicsLoading] = useState(true);

  const categorySlug = params.category_slug as string;

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    if (!website?.id || !categorySlug) return;
    
    try {
      // Slug ile kategori bulma - id yerine slug gönderiyoruz
      const categoryData = await forumService.getCategoryById({ 
        websiteId: website.id, 
        categoryIdOrSlug: categorySlug 
      });

      setCategory(categoryData);

      // Kategori konularını getir
      const topicsData = await forumService.getTopicsByCategoryId({ 
        websiteId: website.id, 
        categoryIdOrSlug: categorySlug 
      });

      setTopics(topicsData);
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Kategori verileri yüklenirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
      // Hata durumunda forum ana sayfasına yönlendir
      router.push('/forum');
    } finally {
      setIsLoading(false);
      setIsTopicsLoading(false);
    }
  }, [website?.id, categorySlug, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <WidgetSkeleton lines={3} />
              <WidgetSkeleton lines={4} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <EmptyList message="Kategori bulunamadı." />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => router.back()}
                >
                  <FaArrowLeft className="mr-2" />
                  Geri
                </Button>
                <Link href="/forum" className="text-gray-400 hover:text-gray-300 text-sm">
                  Forum
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-300 font-medium">{category.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {category.description}
                </p>
              )}
            </div>
            {isAuthenticated && (
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200"
                asChild
              >
                <Link href={`/forum/topics/new?categoryId=${category.id}`}>
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
            {/* Alt Kategoriler (Ana içerikte de göster) */}
            {category.subCategories && category.subCategories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <FaFolder className="mr-2 text-green-600 dark:text-green-400" />
                  Alt Kategoriler
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.subCategories.map((subCategory) => (
                    <ForumCategoryCard key={subCategory.id} category={subCategory} />
                  ))}
                </div>
              </div>
            )}

            {/* Konular */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <FaComments className="mr-2 text-blue-600 dark:text-blue-400" />
                  Konular
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                    <FaSearch className="mr-1" />
                    Ara
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                    <FaSort className="mr-1" />
                    Sırala
                  </Button>
                </div>
              </div>
              
              {isTopicsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <ForumTopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <EmptyList message="Bu kategoride henüz konu bulunmuyor." />
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

            {/* Kategori İstatistikleri */}
            <CategoryStats category={category} />

            {/* Alt Kategoriler */}
            <SubCategories subCategories={category.subCategories} />

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
