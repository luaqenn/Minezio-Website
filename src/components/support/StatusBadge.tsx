import { Badge } from "@/components/ui/badge";

export type TicketStatus = "OPEN" | "CLOSED" | "REPLIED" | "ON_OPERATE";

const statusMap: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  OPEN: { label: "Açık", variant: "default" },
  CLOSED: { label: "Kapalı", variant: "destructive" },
  REPLIED: { label: "Yanıtlandı", variant: "secondary" },
  ON_OPERATE: { label: "İşlemde", variant: "outline" },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, variant } = statusMap[status] || { label: status, variant: "default" };
  return <Badge variant={variant}>{label}</Badge>;
} 