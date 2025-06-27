import { Spinner } from "./ui/spinner";

type Props = {
  show: boolean;
  message: string;
  fullScreen?: boolean;
};

export default function Loading({
  show,
  message,
  fullScreen = false
}: Props) {
  if (!show) return null;

  const containerClasses = fullScreen
    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex flex-col justify-center items-center space-y-3 text-center">
        <Spinner size="lg" className="text-blue-500" />
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
          {message}
        </p>
        <span className="sr-only">Yükleniyor...</span>
      </div>
    </div>
  );
}
