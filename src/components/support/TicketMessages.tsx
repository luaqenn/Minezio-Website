import LexicalViewer from "../LexicalViewer";
import { Avatar } from "../ui/avatar";

interface Message {
  senderId: string;
  content: Record<string, any>; // Lexical JSON or plain text
  sender?: { id: string; username: string; email: string };
  createdAt: string;
}

interface TicketMessagesProps {
  messages: Message[];
  currentUserId: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function TicketMessages({ messages, currentUserId }: TicketMessagesProps) {
  if (!messages || messages.length === 0) {
    return <div className="text-center text-gray-400 py-8">Henüz mesaj yok.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, i) => {
        const isOwn = msg.senderId === currentUserId;
        return (
          <div
            key={i}
            className={`flex items-start gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            {!isOwn && (
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-base">
                {getInitials(msg.sender?.username || "Kullanıcı")}
              </div>
            )}
            <div className={`max-w-[70%] p-3 rounded-xl shadow text-sm ${isOwn ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
              <div className="mb-1 font-semibold text-xs">
                {msg.sender?.username || (isOwn ? "Siz" : "Kullanıcı")}
                <span className="ml-2 text-gray-400 text-[10px]">{new Date(msg.createdAt).toLocaleString('tr-TR')}</span>
              </div>
              <div>
                <LexicalViewer content={msg.content} />
              </div>
            </div>
            {isOwn && (
              <Avatar username={msg.sender?.username || ""} />
            )}
          </div>
        );
      })}
    </div>
  );
} 