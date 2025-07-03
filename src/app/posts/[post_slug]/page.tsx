"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";
import { useWebsitePostsService } from "@/lib/services/posts.service";
import LexicalViewer from "@/components/LexicalViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { translatePostType } from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams();
  const post_slug = Array.isArray(params.post_slug) ? params.post_slug[0] : params.post_slug;
  const { website } = useContext(WebsiteContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const { getPost, likePost, unlikePost } = useWebsitePostsService(website?.id);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!website?.id || !post_slug) return;
      setLoading(true);
      try {
        const data = await getPost({ websiteId: website.id, postId: post_slug });
        setPost(data);
        setLiked(!!(user && data.likedBy && data.likedBy.includes(user.id)));
        setLikeCount(data.likeCount || 0);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [website?.id, post_slug, user]);

  const handleLike = async () => {
    if (!isAuthenticated || !post || !website) return;
    setLikeLoading(true);
    try {
      if (liked) {
        await unlikePost({ websiteId: website.id, postId: post.id });
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await likePost({ websiteId: website.id, postId: post.id });
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-12">Yükleniyor...</div>;
  }
  if (!post) {
    return <div className="container mx-auto py-12">Gönderi bulunamadı.</div>;
  }

  let lexicalContent = {};
  try {
    lexicalContent = typeof post.content === "string" ? JSON.parse(post.content) : post.content;
  } catch {
    lexicalContent = {};
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mb-6">
        {post.featuredImage && (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${post.featuredImage}`}
            alt={post.title}
            className="w-full h-64 object-cover object-center rounded-t-2xl"
          />
        )}
        <CardContent className="p-6">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-xs text-blue-600 font-medium">
              {translatePostType(post.type)}
              {post.publishedAt &&
                ` - ${new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date(post.publishedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Yazar: {post.authorName}</span>
            <div className="flex items-center gap-2">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={!isAuthenticated || likeLoading}
                className={liked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
              >
                {liked ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
                {likeCount}
              </Button>
            </div>
          </div>
          <LexicalViewer content={lexicalContent} />
        </CardContent>
      </Card>
    </div>
  );
}
