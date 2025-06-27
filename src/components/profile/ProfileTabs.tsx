// components/profile/AnimatedProfileTabs.tsx
import React from 'react';
import { Button } from '../ui/button';
import { Layers } from 'lucide-react';

interface Tab {
  label: string;
  count?: number;
  content: React.ReactNode;
}

interface ProfileTabsProps {
  tabs: Tab[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden mb-6">
      <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
          <Layers className="mr-2 h-5 w-5 text-purple-500" />
          Aktivite Sekmeleri
        </h3>
      </div>
      
      <div className="flex border-b border-white/10 dark:border-gray-700/50">
        {tabs.map((tab, index) => (
          <Button
            key={tab.label}
            variant="ghost"
            onClick={() => setActiveTab(index)}
            className={`flex-1 rounded-none border-b-2 border-transparent hover:bg-black/5 dark:hover:bg-gray-700/40 transition-all duration-300 ${
              activeTab === index 
                ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === index 
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="p-6">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default ProfileTabs;