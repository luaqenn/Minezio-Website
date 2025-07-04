"use client";

import React, { useContext, useEffect, useState, useCallback, Suspense } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { ForumCategory, ForumTopic } from "@/lib/services/forum.service";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import Widget from "@/components/widgets/widget";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  EmptyList,
  WidgetSkeleton,
  CreateTopicForm,
  UserProfileCard,
  TopicView
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

export default function TopicPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const forumService = useWebsiteForumService();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [topicCategory, setTopicCategory] = useState<ForumCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const topicSlug = params.topic_slug as string;
  const categoryId = searchParams.get('categoryId');

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    if (!website?.id) return;
    
    try {
      // Eğer categoryId varsa, yeni konu oluşturma modu
      if (categoryId) {
        const categoryData = await forumService.getCategoryById({ 
          websiteId: website.id, 
          categoryIdOrSlug: categoryId 
        });
        setCategory(categoryData);
        setIsCreateMode(true);
      } else {
        // Topic slug ile topic'i getir
        const topicData = await forumService.getTopicById({ 
          websiteId: website.id, 
          topicIdOrSlug: topicSlug 
        });
        setTopic(topicData);
        
        // Topic'in kategorisini de getir
        if (topicData.categoryId) {
          try {
            const categoryData = await forumService.getCategoryById({
              websiteId: website.id,
              categoryIdOrSlug: topicData.categoryId
            });
            setTopicCategory(categoryData);
          } catch (err) {
            console.log('Kategori bilgisi alınamadı');
          }
        }
        
        setIsCreateMode(false);
      }
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Veriler yüklenirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
      router.push('/forum');
    } finally {
      setIsLoading(false);
    }
  }, [website?.id, topicSlug, categoryId, router]);

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
                <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                <div className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
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

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
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
            {isCreateMode && category ? (
              <>
                <Link href={`/forum/category/${category.slug}`} className="text-gray-400 hover:text-gray-300 text-sm">
                  {category.name}
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-300 font-medium">Yeni Konu</span>
              </>
            ) : topic ? (
              <>
                <Link href={`/forum/category/${topic.categoryId}`} className="text-gray-400 hover:text-gray-300 text-sm">
                  Kategori
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-300 font-medium">{topic.title}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Ana İçerik */}
          <div className={`${!isAuthenticated ? "lg:col-span-8" : "lg:col-span-9"} space-y-6`}>
            {isCreateMode && category ? (
              <CreateTopicForm category={category} />
            ) : topic ? (
              <TopicView topic={topic} topicCategory={topicCategory} />
            ) : (
              <EmptyList message="Konu bulunamadı." />
            )}
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

            {/* Topic Yazarı Profil Kartı */}
            {topic && (
              <UserProfileCard 
                username={topic.authorName}
                createdAt={topic.createdAt}
                isAuthor={true}
              />
            )}

            {/* Son Mesaj Yazanlar */}
            {topic && topic.messages.length > 0 && (
              <Widget>
                <Widget.Header>
                  <FaUsers className="inline mr-2 text-blue-400" />
                  Son Mesaj Yazanlar
                </Widget.Header>
                <Widget.Body>
                  <div className="space-y-3">
                    {topic.messages.slice(-3).reverse().map((message) => (
                      <UserProfileCard 
                        key={message.id}
                        username={message.authorName}
                        createdAt={message.createdAt}
                      />
                    ))}
                  </div>
                </Widget.Body>
              </Widget>
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
