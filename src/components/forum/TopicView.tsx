import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FaComments, 
  FaEye, 
  FaThumbtack, 
  FaLock, 
  FaClock,
  FaUser,
  FaHeart,
  FaShare,
  FaReply
} from "react-icons/fa";
import { ForumCategory, ForumTopic, ForumMessage } from "@/lib/services/forum.service";
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { renderIcon } from "./renderIcon";
import { MessageCard } from "./MessageCard";

const Editor = dynamic(
  () => import("@/components/blocks/editor-00/editor").then(mod => ({ default: mod.Editor })),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

const LexicalViewer = dynamic(
  () => import("@/components/LexicalViewer").then(mod => ({ default: mod.default })),
  { 
    ssr: false,
    loading: () => <div className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

interface TopicViewProps {
  topic: ForumTopic;
  topicCategory?: ForumCategory | null;
}

export const TopicView = ({ topic, topicCategory }: TopicViewProps) => {
  const { website } = useContext(WebsiteContext);
  const { isAuthenticated } = useContext(AuthContext);
  const forumService = useWebsiteForumService();
  const [liked, setLiked] = useState(topic.likedBy?.includes(topic.authorId) || false);
  const [likeCount, setLikeCount] = useState(topic.likeCount);
  const [replyContent, setReplyContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotedMessage, setQuotedMessage] = useState<ForumMessage | null>(null);

  const handleLike = async () => {
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

  const handleReply = (message: ForumMessage) => {
    setQuotedMessage(message);
    // Scroll to reply form
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitReply = async () => {
    if (!replyContent || !website?.id) return;

    setIsSubmitting(true);
    
    try {
      if (quotedMessage) {
        // Reply to message
        await forumService.createReply({
          websiteId: website.id,
          messageId: quotedMessage.id,
          reply: { content: replyContent }
        });
      } else {
        // Reply to topic
        await forumService.createMessage({
          websiteId: website.id,
          topicId: topic.id,
          message: { content: replyContent }
        });
      }

      // Refresh topic data
      window.location.reload();
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Yanıt gönderilirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    } finally {
      setIsSubmitting(false);
      setReplyContent(null);
      setQuotedMessage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <Card className="bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {topicCategory && (
                  <div className="flex items-center space-x-2 mr-3">
                    {renderIcon(topicCategory.icon)}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {topicCategory.name}
                    </span>
                  </div>
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {topic.title}
                </h1>
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
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                  <span className="hidden sm:inline">{topic.messages.length} yanıt</span>
                  <span className="sm:hidden">{topic.messages.length}</span>
                </span>
                <span className="flex items-center">
                  <FaEye className="mr-1" />
                  <span className="hidden sm:inline">{topic.viewCount} görüntüleme</span>
                  <span className="sm:hidden">{topic.viewCount}</span>
                </span>
              </div>
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
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              >
                <FaShare className="mr-1" />
                <span className="hidden sm:inline">Paylaş</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {topic.content && (
              <LexicalViewer 
                content={topic.content} 
                className="text-gray-900 dark:text-gray-100"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {topic.messages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FaComments className="mr-2 text-blue-400" />
            Yanıtlar ({topic.messages.length})
          </h3>
          
          {topic.messages.map((message) => (
            <MessageCard 
              key={message.id} 
              message={message} 
              onReply={handleReply}
              isAuthenticated={isAuthenticated}
              websiteId={website?.id}
            />
          ))}
        </div>
      )}

      {/* Reply Form */}
      {!topic.isLocked && (
        <Card id="reply-form" className="bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden">
          <CardHeader>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <FaReply className="mr-2 text-green-400" />
              {quotedMessage ? `${quotedMessage.authorName} kullanıcısına yanıt` : 'Yanıt Yaz'}
            </h3>
            {quotedMessage && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border-l-4 border-blue-400">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>{quotedMessage.authorName}</strong> kullanıcısının mesajı:
                </p>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {quotedMessage.content && (
                    <LexicalViewer 
                      content={quotedMessage.content} 
                      className="text-gray-900 dark:text-gray-100 text-sm"
                    />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuotedMessage(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 mt-2"
                >
                  Alıntıyı Kaldır
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
                  <FaUser className="mx-auto text-4xl text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Bu konuya mesaj göndermek için giriş yapmalısınız
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Tartışmalara katılmak ve yanıt yazmak için hesabınıza giriş yapın.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      asChild
                    >
                      <Link href="/auth/sign-in">
                        Giriş Yap
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10"
                      asChild
                    >
                      <Link href="/auth/sign-up">
                        Kayıt Ol
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Editor
                  placeholder="Yanıtınızı buraya yazın..."
                  onSerializedChange={(serializedState) => {
                    setReplyContent(serializedState);
                  }}
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  {quotedMessage && (
                    <Button
                      variant="ghost"
                      onClick={() => setQuotedMessage(null)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 w-full sm:w-auto"
                    >
                      İptal
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmitReply}
                    disabled={isSubmitting || !replyContent}
                    className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Yanıt Gönder"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 