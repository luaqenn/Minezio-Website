import React from 'react';
import { Button } from '../ui/button';
import { Flag, Ban, Shield } from 'lucide-react';
import { PERMISSIONS } from '@/lib/constants/permissions';
import type { User } from '@/lib/types/user';

interface ProfileModerationPanelProps {
  currentUser: User | null;
  user: User;
  onReport: () => void;
  onBan?: () => void;
}

const ProfileModerationPanel: React.FC<ProfileModerationPanelProps> = ({ 
  currentUser, 
  user, 
  onReport, 
  onBan 
}) => {
  const isSelf = currentUser && user.id === currentUser.id;
  const canBan = currentUser?.role.permissions.includes(PERMISSIONS.MANAGE_USERS);

  if (isSelf) return null;

  return (
    <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden">
      <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-red-500" />
          Moderasyon İşlemleri
        </h3>
      </div>
      
      <div className="p-4 space-y-3">
        <Button 
          onClick={onReport} 
          className="w-full bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Flag size={16} />
          Rapor Et
        </Button>
        
        {canBan && onBan && (
          <Button 
            onClick={onBan} 
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Ban size={16} />
            {user.banned ? 'Yasağı kaldır' : 'Yasakla'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileModerationPanel; 