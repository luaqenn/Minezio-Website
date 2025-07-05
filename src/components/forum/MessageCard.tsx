import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaHeart, FaReply } from "react-icons/fa";
import { ForumMessage } from "@/lib/services/forum.service";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from 'next/dynamic';

const LexicalViewer = dynamic(
  () => import("@/components/LexicalViewer").then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => <div className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

interface MessageCardProps {
  message: ForumMessage;
  onReply: (message: ForumMessage) => void;
  isAuthenticated: boolean;
  websiteId?: string;
}

export const MessageCard = ({ message, onReply, isAuthenticated, websiteId }: MessageCardProps) => {
  const forumService = useWebsiteForumService();
  const [liked, setLiked] = useState(message.likedBy?.includes(message.authorId) || false);
  const [likeCount, setLikeCount] = useState(message.likeCount);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated || !websiteId) {
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
        const result = await forumService.unlikeMessage({
          websiteId: websiteId,
          messageId: message.id
        });
        setLikeCount(result.likeCount);
        setLiked(false);
      } else {
        const result = await forumService.likeMessage({
          websiteId: websiteId,
          messageId: message.id
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
    <Card className="bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Avatar
              username={message.authorName}
              size={48}
              className="ring-2 ring-blue-500/20"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {message.authorName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTimeAgo(message.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`${liked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'} hover:text-red-700 dark:hover:text-red-300 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={!isAuthenticated ? "Beğenmek için giriş yapın" : liked ? "Beğeniyi kaldır" : "Beğen"}
                >
                  <FaHeart className={`mr-1 ${liked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(message)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                >
                  <FaReply className="mr-1" />
                  <span className="hidden sm:inline">Yanıtla</span>
                </Button>
              </div>
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
              {message.content && (
                <LexicalViewer 
                  content={message.content} 
                  className="text-gray-900 dark:text-gray-100"
                />
              )}
            </div>

            {/* Replies */}
            {message.replies.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-3"
                >
                  {showReplies ? 'Yanıtları Gizle' : `${message.replies.length} Yanıtı Göster`}
                </Button>
                
                {showReplies && (
                  <div className="space-y-3 ml-6 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar
                            username={reply.authorName}
                            size={24}
                            className="ring-1 ring-blue-500/20"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {reply.authorName}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          {reply.content && (
                            <LexicalViewer 
                              content={reply.content} 
                              className="text-gray-900 dark:text-gray-100 text-sm"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 