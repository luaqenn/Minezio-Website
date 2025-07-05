import { Avatar } from "@/components/ui/avatar";
import { ForumStatistics } from "@/lib/services/forum.service";
import { formatTimeAgo } from "@/lib/utils";

interface LatestActivitiesProps {
  statistics: ForumStatistics;
}

export const LatestActivities = ({ statistics }: LatestActivitiesProps) => (
  <ul className="space-y-2">
    {statistics.lastTopics.slice(0, 5).map((topic) => (
      <li
        key={topic.id}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/40"
      >
        <Avatar
          username={topic.authorName}
          size={32}
          className="mr-3"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {topic.title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {topic.authorName} tarafından {formatTimeAgo(topic.createdAt)}
          </p>
        </div>
      </li>
    ))}
  </ul>
); 