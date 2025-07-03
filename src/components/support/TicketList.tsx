import TicketCard from "./TicketCard";
import { TicketStatus } from "./StatusBadge";

interface TicketListProps {
  tickets: Array<{
    id: string;
    title: string;
    status: TicketStatus;
    category: { name: string; color: string };
    createdAt: string;
  }>;
}

export default function TicketList({ tickets }: TicketListProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        Henüz destek talebiniz yok.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
} 