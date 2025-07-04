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
    <Card className="group bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/80 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            {renderIcon(category.icon)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-100 dark:text-gray-100 group-hover:text-blue-400 transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FaComments className="mr-1" />
              {totalTopics} konu
            </span>
            <span className="flex items-center">
              <FaUsers className="mr-1" />
              {totalMessages} mesaj
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            asChild
          >
            <Link href={`/forum/category/${category.slug}`}>
              Görüntüle
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 