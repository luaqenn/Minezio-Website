export default function TicketClosedNotice() {
  return (
    <div className="flex items-center gap-3 mt-6 p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900/60 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100">
      <span className="font-bold">Bu destek talebi kapalıdır.</span>
      <span>Yeni mesaj gönderemezsiniz.</span>
    </div>
  );
} 