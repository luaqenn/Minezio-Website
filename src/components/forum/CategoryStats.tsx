import { FaFolder } from "react-icons/fa";
import { ForumCategory } from "@/lib/services/forum.service";
import Widget from "@/components/widgets/widget";

interface CategoryStatsProps {
  category: ForumCategory;
}

export const CategoryStats = ({ category }: CategoryStatsProps) => {
  const totalTopics = category.topics.length + category.subCategories.reduce((acc, sub) => acc + sub.topics.length, 0);
  const totalMessages = category.topics.reduce((acc, topic) => acc + topic.messages.length, 0) + 
                       category.subCategories.reduce((acc, sub) => acc + sub.topics.reduce((subAcc, topic) => subAcc + topic.messages.length, 0), 0);

  return (
    <Widget>
      <Widget.Header>
        <FaFolder className="inline mr-2 text-blue-400" />
        Kategori İstatistikleri
      </Widget.Header>
      <Widget.Body>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-400">Toplam Konu</span>
            <span className="font-semibold text-blue-400">{totalTopics}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-400">Toplam Mesaj</span>
            <span className="font-semibold text-green-400">{totalMessages}</span>
          </div>
          {category.subCategories.length > 0 && (
            <div className="flex justify-between items-center p-2 bg-gray-800/30 dark:bg-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-400">Alt Kategoriler</span>
              <span className="font-semibold text-purple-400">{category.subCategories.length}</span>
            </div>
          )}
        </div>
      </Widget.Body>
    </Widget>
  );
}; 