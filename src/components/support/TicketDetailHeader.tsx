import { StatusBadge, TicketStatus } from "./StatusBadge";

interface TicketDetailHeaderProps {
  ticket: {
    title: string;
    status: TicketStatus;
    category: { name: string; color: string };
    createdAt: string;
  };
}

export default function TicketDetailHeader({ ticket }: TicketDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-white/10">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{ticket.title}</h2>
        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />
          <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: ticket.category.color, color: '#fff' }}>{ticket.category.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Oluşturulma: {new Date(ticket.createdAt).toLocaleString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
} 