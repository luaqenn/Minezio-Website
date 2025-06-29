"use client";

import React from 'react';
import { Button } from './ui/button';
import { usePWA } from '../lib/context/pwa-provider.context';
import { clearDevelopmentCache, forceComponentRefresh, refreshAndClearCache } from '../lib/utils';

interface DevelopmentToolbarProps {
  className?: string;
}

export function DevelopmentToolbar({ className = "" }: DevelopmentToolbarProps) {
  const { clearCache, forceRefresh } = usePWA();

  const handleClearCache = async () => {
    await clearCache();
    await clearDevelopmentCache();
  };

  const handleForceRefresh = () => {
    forceRefresh();
    forceComponentRefresh();
  };

  const handleFullRefresh = async () => {
    await refreshAndClearCache();
  };

  // Sadece development ortamında göster
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-700 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="text-xs text-white/70 px-2 py-1 bg-red-500/20 rounded">
          DEV MODE
        </div>
        
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearCache}
            className="text-xs h-8 bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-200"
          >
            Clear Cache
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleForceRefresh}
            className="text-xs h-8 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-200"
          >
            Force Refresh
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleFullRefresh}
            className="text-xs h-8 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-200"
          >
            Full Refresh
          </Button>
        </div>
      </div>
    </div>
  );
} 