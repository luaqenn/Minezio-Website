import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaComments, FaUsers, FaFolder } from "react-icons/fa";
import { ForumCategory } from "@/lib/services/forum.service";
import { renderIcon } from "./renderIcon";
import Widget from "@/components/widgets/widget";

interface SubCategoriesProps {
  subCategories: ForumCategory[];
}

export const SubCategories = ({ subCategories }: SubCategoriesProps) => {
  if (subCategories.length === 0) {
    return null;
  }

  return (
    <Widget>
      <Widget.Header>
        <FaFolder className="inline mr-2 text-green-600 dark:text-green-400" />
        Alt Kategoriler ({subCategories.length})
      </Widget.Header>
      <Widget.Body>
        <div className="space-y-2">
          {subCategories.map((subCategory) => {
            const totalTopics = subCategory.topics.length;
            const totalMessages = subCategory.topics.reduce((acc, topic) => acc + topic.messages.length, 0);

            return (
              <Link 
                key={subCategory.id} 
                href={`/forum/category/${subCategory.slug}`}
                className="block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                      {renderIcon(subCategory.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {subCategory.name}
                      </h4>
                      {subCategory.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {subCategory.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-500 flex-shrink-0 ml-2">
                    <div>{totalTopics} konu</div>
                    <div>{totalMessages} mesaj</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Widget.Body>
    </Widget>
  );
}; 