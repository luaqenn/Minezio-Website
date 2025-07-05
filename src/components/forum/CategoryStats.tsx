import { FaFolder } from "react-icons/fa";
import { ForumCategory } from "@/lib/services/forum.service";

interface CategoryStatsProps {
  category: ForumCategory;
}

export const CategoryStats = ({ category }: CategoryStatsProps) => {
  const totalTopics = category.topics.length + category.subCategories.reduce((acc, sub) => acc + sub.topics.length, 0);
  const totalMessages = category.topics.reduce((acc, topic) => acc + topic.messages.length, 0) + 
                       category.subCategories.reduce((acc, sub) => acc + sub.topics.reduce((subAcc, topic) => subAcc + topic.messages.length, 0), 0);

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 text-center sm:text-left">
          <FaFolder className="inline mr-2 text-blue-600 dark:text-blue-400" />
          Kategori İstatistikleri
        </h3>
      </div>
      <div className="p-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-400">Toplam Konu</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{totalTopics}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-400">Toplam Mesaj</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{totalMessages}</span>
          </div>
          {category.subCategories.length > 0 && (
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-400">Alt Kategoriler</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{category.subCategories.length}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 