import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const REPORT_TYPES = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Taciz/Hakaret" },
  { value: "inappropriate_content", label: "Uygunsuz İçerik" },
  { value: "fraud", label: "Dolandırıcılık" },
  { value: "other", label: "Diğer" },
];

interface UserActionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  action: "report" | "ban";
  loading?: boolean;
}

const UserActionModal: React.FC<UserActionModalProps> = ({ open, onClose, onSubmit, action, loading }) => {
  const [type, setType] = useState(REPORT_TYPES[0].value);
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    if (action === "ban") {
      onSubmit({ banReason: reason });
    } else {
      onSubmit({ type, reason });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === "report" ? "Kullanıcıyı Raporla" : "Kullanıcıyı Banla"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {action === "report" && (
            <div>
              <label className="block text-sm font-medium mb-1">Rapor Tipi</label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                value={type}
                onChange={e => setType(e.target.value)}
                disabled={loading}
              >
                {REPORT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">{action === "ban" ? "Ban Sebebi" : "Açıklama"}</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={action === "ban" ? "Ban sebebini yazınız..." : "Sebebinizi yazınız..."}
              rows={4}
              disabled={loading}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 resize-none min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>İptal</Button>
            <Button type="submit" disabled={loading || !reason.trim()}>
              {action === "report" ? "Raporla" : "Banla"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserActionModal; 