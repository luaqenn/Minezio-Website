"use client";
import { useState, useEffect } from "react";
import PostList from "@/components/posts/PostList";
import { useWebsiteContext } from "@/lib/context/website.context";
import { useWebsitePostsService } from "@/lib/services/posts.service";

const PAGE_SIZE = 6;

const PostsPage = () => {
  const { website } = useWebsiteContext();
  const { getPosts } = useWebsitePostsService(website?.id);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!website?.id) return;
    setLoading(true);
    getPosts({ websiteId: website.id, params: { page: currentPage, limit: PAGE_SIZE } })
      .then((res) => {
        setPosts(res.data);
        setTotalPages(res.pagination.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, website?.id]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tüm Yazılar</h1>
      {loading ? (
        <div className="text-center py-10 text-lg">Yükleniyor...</div>
      ) : (
        <PostList
          posts={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PostsPage;
