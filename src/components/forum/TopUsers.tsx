import { Avatar } from "@/components/ui/avatar";
import { ForumStatistics } from "@/lib/services/forum.service";

interface TopUsersProps {
  statistics: ForumStatistics;
}

export const TopUsers = ({ statistics }: TopUsersProps) => (
  <ul className="space-y-2">
    {statistics.topMessageUsers.slice(0, 5).map((user, index) => (
      <li
        key={user.userId}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
      >
        <span className="w-8 text-center text-lg font-bold text-gray-500 dark:text-gray-400">
          #{index + 1}
        </span>
        <Avatar
          username={user.username}
          size={32}
          className="mx-2"
        />
        <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
          {user.username}
        </p>
        <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
          {user.count} mesaj
        </span>
      </li>
    ))}
  </ul>
); 