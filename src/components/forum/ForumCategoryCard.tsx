import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { FaComments, FaUsers } from "react-icons/fa";
import { ForumCategory } from "@/lib/services/forum.service";
import { renderIcon } from "./renderIcon";

interface ForumCategoryCardProps {
  category: ForumCategory;
}

export const ForumCategoryCard = ({ category }: ForumCategoryCardProps) => {
  const totalTopics = category.topics.length + category.subCategories.reduce((acc, sub) => acc + sub.topics.length, 0);
  const totalMessages = category.topics.reduce((acc, topic) => acc + topic.messages.length, 0) + 
                       category.subCategories.reduce((acc, sub) => acc + sub.topics.reduce((subAcc, topic) => subAcc + topic.messages.length, 0), 0);

  return (
    <Card className="group bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12  rounded-xl flex items-center justify-center shadow-lg">
            {renderIcon(category.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="flex items-center">
              <FaComments className="mr-1" />
              <span className="hidden sm:inline">{totalTopics} konu</span>
              <span className="sm:hidden">{totalTopics}</span>
            </span>
            <span className="flex items-center">
              <FaUsers className="mr-1" />
              <span className="hidden sm:inline">{totalMessages} mesaj</span>
              <span className="sm:hidden">{totalMessages}</span>
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            asChild
          >
            <Link href={`/forum/category/${category.slug}`}>
              <span className="hidden sm:inline">Görüntüle</span>
              <span className="sm:hidden">→</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 