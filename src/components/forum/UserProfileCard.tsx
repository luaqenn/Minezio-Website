import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";

interface UserProfileCardProps {
  username: string;
  createdAt: string;
  isAuthor?: boolean;
}

export const UserProfileCard = ({ username, createdAt, isAuthor = false }: UserProfileCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/80 rounded-xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar
            username={username}
            size={48}
            className="ring-2 ring-blue-500/20"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-100 dark:text-gray-100">
              {username}
            </h4>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              {formatTimeAgo(createdAt)}
            </p>
            {isAuthor && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                Yazar
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 