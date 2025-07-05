import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

export const renderIcon = (iconName: string) => {
  if (!iconName) {
    return <HelpCircle className="w-8 h-8 text-slate-900" />;
  }
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return React.createElement(IconComponent, { className: "w-8 h-8 dark:text-white text-black" });
  }
  return <HelpCircle className="w-8 h-8 text-slate-900" />;
}; 