import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge, TicketStatus } from "./StatusBadge";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    status: TicketStatus;
    category: { name: string; color: string };
    createdAt: string;
  };
  href?: string;
}

export default function TicketCard({ ticket, href }: TicketCardProps) {
  return (
    <Link href={href || `/support/${ticket.id}`} className="block group">
      <Card className="flex flex-col sm:flex-row items-stretch gap-0 bg-white/80 dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 rounded-2xl border border-gray-200 dark:border-white/10 dark:border-gray-700/50 overflow-hidden min-h-[6rem] transition-transform duration-300 hover:scale-[1.015] hover:shadow-2xl">
        <div className="flex-1 flex flex-col justify-between p-5">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={ticket.status} />
            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: ticket.category.color, color: '#fff' }}>{ticket.category.name}</span>
          </div>
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{ticket.title}</CardTitle>
          <CardDescription className="text-xs text-gray-500 dark:text-gray-300">Oluşturulma: {new Date(ticket.createdAt).toLocaleString('tr-TR')}</CardDescription>
        </div>
        <CardContent className="flex items-center justify-center px-4 bg-gray-100 dark:bg-black/10">
          <FaChevronRight className="text-gray-400 group-hover:text-blue-400 transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
} 