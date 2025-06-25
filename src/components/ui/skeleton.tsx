export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-white/10 dark:bg-gray-700/50 ${className}`} />
  );
}