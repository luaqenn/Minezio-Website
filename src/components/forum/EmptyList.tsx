interface EmptyListProps {
  message: string;
}

export const EmptyList = ({ message }: EmptyListProps) => (
  <p className="text-center text-xs text-gray-500 dark:text-gray-400 p-4">
    {message}
  </p>
); 