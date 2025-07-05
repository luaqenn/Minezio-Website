import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa";
import { ForumCategory, CreateForumTopicDto } from "@/lib/services/forum.service";
import { WebsiteContext } from "@/lib/context/website.context";
import { useWebsiteForumService } from "@/lib/services/forum.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import("@/components/blocks/editor-00/editor").then(mod => ({ default: mod.Editor })),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

interface CreateTopicFormProps {
  category: ForumCategory;
}

export const CreateTopicForm = ({ category }: CreateTopicFormProps) => {
  const { website } = useContext(WebsiteContext);
  const forumService = useWebsiteForumService();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Başlık ve içerik alanları zorunludur.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
      return;
    }

    if (!website?.id) return;

    setIsSubmitting(true);
    
    try {
      const topicData: CreateForumTopicDto = {
        title: title.trim(),
        content: content
      };

      const newTopic = await forumService.createTopic({
        websiteId: website.id,
        categoryIdOrSlug: category.id,
        topic: topicData
      });

      withReactContent(Swal).fire({
        title: "Başarılı!",
        text: "Konu başarıyla oluşturuldu.",
        icon: "success",
        confirmButtonText: "Tamamdır.",
      });

      // Yeni oluşturulan topic'e yönlendir
      router.push(`/forum/topics/${newTopic.slug}`);
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "Konu oluşturulurken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden">
      <CardHeader>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <FaPlus className="mr-2 text-blue-400" />
          <span className="hidden sm:inline">{category.name} Kategorisinde Yeni Konu</span>
          <span className="sm:hidden">Yeni Konu</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Yeni bir konu oluşturarak topluluğumuzla paylaşın
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-gray-900 dark:text-gray-100">
              Konu Başlığı
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Konu başlığını girin..."
              className="mt-2 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <Label className="text-gray-900 dark:text-gray-100">
              İçerik
            </Label>
            <div className="mt-2">
              <Editor
                placeholder="Konu içeriğini buraya yazın..."
                onSerializedChange={(serializedState) => {
                  setContent(serializedState);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              {isSubmitting ? "Oluşturuluyor..." : "Konu Oluştur"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 