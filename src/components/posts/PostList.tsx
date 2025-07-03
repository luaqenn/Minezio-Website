import LatestPostCard from "../LatestPostCard";
import Pagination from "./Pagination";

interface PostListProps {
  posts: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const PostList = ({ posts, currentPage, totalPages, onPageChange, loading = false, emptyMessage = "Henüz gönderi yok." }: PostListProps) => {
  if (loading) {
    return <div className="text-center py-10 text-lg">Yükleniyor...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-10 text-gray-400">{emptyMessage}</div>;
  }

  const sortedPosts = [...posts].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col gap-8">
      {sortedPosts.map((post) => (
        <LatestPostCard key={post.id || post.slug} post={post} />
      ))}
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default PostList; 