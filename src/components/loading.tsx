import { Spinner } from "./ui/spinner";

type Props = {
  show: boolean;
  message: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

export default function Loading({ 
  show, 
  message, 
  size = "md", 
  fullScreen = false 
}: Props) {
  if (!show) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex flex-col justify-center items-center space-y-3">
        <Spinner size={size} className="text-blue-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
          {message}
        </p>
        <span className="sr-only">Yükleniyor...</span>
      </div>
    </div>
  );
}
