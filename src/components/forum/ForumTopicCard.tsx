import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FaComments, 
  FaEye, 
  FaThumbtack, 
  FaLock, 
  FaClock,
  FaUser,
  FaHeart
} from "react-icons/fa";
import { ForumTopic } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";
import { useContext } from "react";
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface ForumTopicCardProps {
  topic: ForumTopic;
}

export const ForumTopicCard = ({ topic }: ForumTopicCardProps) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const forumService = useWebsiteForumService();
  const [liked, setLiked] = useState(topic.likedBy?.includes(topic.authorId) || false);
  const [likeCount, setLikeCount] = useState(topic.likeCount);
  
  const totalReplies = topic.messages.length;
  const lastMessage = topic.messages[topic.messages.length - 1];

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!isAuthenticated || !website?.id) {
      withReactContent(Swal).fire({
        title: "Giriş Gerekli!",
        text: "Beğenmek için giriş yapmalısınız.",
        icon: "info",
        confirmButtonText: "Tamamdır.",
      });
      return;
    }

    try {
      if (liked) {
        const result = await forumService.unlikeTopic({
          websiteId: website.id,
          topicId: topic.id
        });
        setLikeCount(result.likeCount);
        setLiked(false);
      } else {
        const result = await forumService.likeTopic({
          websiteId: website.id,
          topicId: topic.id
        });
        setLikeCount(result.likeCount);
        setLiked(true);
      }
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "İşlem sırasında bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    }
  };

  return (
    <Link href={`/forum/topics/${topic.slug}`}>
      <Card className="group bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Avatar
                username={topic.authorName}
                size={40}
                className="ring-2 ring-blue-500/20"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {topic.title}
                </h3>
                {topic.isPinned && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                    <FaThumbtack className="mr-1 text-xs" />
                    <span className="hidden sm:inline">Sabit</span>
                  </Badge>
                )}
                {topic.isLocked && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30">
                    <FaLock className="mr-1 text-xs" />
                    <span className="hidden sm:inline">Kilitli</span>
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                  <FaUser className="mr-1" />
                  <span className="hidden sm:inline">{topic.authorName}</span>
                  <span className="sm:hidden">{topic.authorName.split(' ')[0]}</span>
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {formatTimeAgo(topic.createdAt)}
                </span>
                <span className="flex items-center">
                  <FaComments className="mr-1" />
                  <span className="hidden sm:inline">{totalReplies} yanıt</span>
                  <span className="sm:hidden">{totalReplies}</span>
                </span>
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  <span className="hidden sm:inline">{topic.viewCount} görüntüleme</span>
                  <span className="sm:hidden">{topic.viewCount}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`${liked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'} hover:text-red-700 dark:hover:text-red-300 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''} h-auto p-1 text-xs`}
                  title={!isAuthenticated ? "Beğenmek için giriş yapın" : liked ? "Beğeniyi kaldır" : "Beğen"}
                >
                  <FaHeart className={`mr-1 ${liked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
              </div>
              {lastMessage && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  <span className="hidden sm:inline">Son mesaj: {lastMessage.authorName} tarafından {formatTimeAgo(lastMessage.createdAt)}</span>
                  <span className="sm:hidden">Son: {formatTimeAgo(lastMessage.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}; 