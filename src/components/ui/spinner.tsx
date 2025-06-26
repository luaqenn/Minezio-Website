import React from 'react';
import { LoaderCircle } from 'lucide-react';

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
        <LoaderCircle className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );
};


