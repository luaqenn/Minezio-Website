import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar } from '../ui/avatar';
import { Send, MessageCircle, CornerDownRight } from 'lucide-react';
import type { User, WallMessage } from '@/lib/types/user';
import { useUserService } from '@/lib/services/user.service';

// Backend'den gelen WallMessage yapısı hem sender hem user içerebilir, tipleri gevşetiyoruz
type WallMessageAny = any;

interface WallProps {
  currentUser: User | null;
  profileUser: User;
  initialMessages?: WallMessage[];
}

const Wall: React.FC<WallProps> = ({ currentUser, profileUser, initialMessages = [] }) => {
  const userService = useUserService();
  const [messages, setMessages] = useState<WallMessageAny[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [replyLoading, setReplyLoading] = useState<{ [key: string]: boolean }>({});

  // Mesajları backend'den çek
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await userService.getWallMessages(profileUser.id);
        // API User döndürüyor, wallMessages içinden al
        setMessages(data || []);
      } catch (e) {
        setMessages([]);
      }
    };
    fetchMessages();
    // eslint-disable-next-line
  }, [profileUser.id]);

  // Mesaj gönder
  const handleSend = async () => {
    if (!input.trim() || !currentUser) return;
    setLoading(true);
    try {
      // Optimistik yeni mesaj objesi
      const newMsg = {
        id: Math.random().toString(36).substr(2, 9),
        content: input,
        createdAt: new Date().toISOString(),
        sender: currentUser,
        replies: [],
      };
      setMessages(prev => [newMsg, ...prev]);
      setInput('');
      await userService.sendWallMessage(profileUser.id, '', input);
      // (isteğe bağlı: backend'den tekrar fetch edilebilir, ama anlık ekranda gösterilecek)
    } finally {
      setLoading(false);
    }
  };

  // Yanıt gönder
  const handleReply = async (msgId: string) => {
    if (!replyInputs[msgId]?.trim() || !currentUser) return;
    setReplyLoading((prev) => ({ ...prev, [msgId]: true }));
    try {
      // Optimistik yeni yanıt objesi
      const newReply = {
        id: Math.random().toString(36).substr(2, 9),
        content: replyInputs[msgId],
        createdAt: new Date().toISOString(),
        sender: currentUser,
        replies: [],
      };
      setMessages(prevMsgs => prevMsgs.map(msg =>
        msg.id === msgId
          ? { ...msg, replies: [...(msg.replies || []), newReply] }
          : msg
      ));
      setReplyInputs((prev) => ({ ...prev, [msgId]: '' }));
      await userService.replyWallMessage(profileUser.id, msgId, replyInputs[msgId]);
      // (isteğe bağlı: backend'den tekrar fetch edilebilir, ama anlık ekranda gösterilecek)
    } finally {
      setReplyLoading((prev) => ({ ...prev, [msgId]: false }));
    }
  };

  // Yanıt inputunu güncelle
  const handleReplyInput = (msgId: string, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [msgId]: value }));
  };

  // Mesaj ve yanıtları render eden yardımcı fonksiyon
  const renderMessage = (msg: WallMessage, isReply = false) => {
    const userObj = msg.sender;

    return (
      <div key={msg.id} className={`flex gap-3 items-start p-3 rounded-lg ${isReply ? 'ml-8 bg-black/5 dark:bg-gray-700/20' : 'hover:bg-black/5 dark:hover:bg-gray-700/40'} transition-colors`}>
        <Avatar username={userObj?.username || 'Kullanıcı'} className={`w-8 h-8 flex-shrink-0 text-${userObj.role.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-100">
              {userObj?.username || 'Kullanıcı'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(msg.createdAt).toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {msg.content}
          </div>
          {/* Yanıtlar */}
          {msg.replies && msg.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {msg.replies.map((reply: WallMessageAny) => renderMessage(reply, true))}
            </div>
          )}
          {/* Yanıt inputu */}
          {currentUser && !isReply && (
            <div className="flex gap-2 mt-2 items-center">
              <Input
                value={replyInputs[msg.id] || ''}
                onChange={e => handleReplyInput(msg.id, e.target.value)}
                placeholder="Yanıt yaz..."
                disabled={replyLoading[msg.id]}
                onKeyDown={e => { if (e.key === 'Enter') handleReply(msg.id); }}
                className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/20 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={() => handleReply(msg.id)}
                disabled={replyLoading[msg.id] || !(replyInputs[msg.id]?.trim())}
                className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <CornerDownRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden mb-6">
      <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
          Kullanıcı Duvarı
        </h3>
      </div>
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">Henüz mesaj yok.</p>
          </div>
        )}
        {messages.map((msg) => renderMessage(msg))}
      </div>
      <div className="p-4 border-t border-white/10 dark:border-gray-700/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={currentUser ? 'Bir mesaj yaz...' : 'Giriş yapmalısınız'}
            disabled={!currentUser || loading}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 bg-white/50 dark:bg-gray-700/50 border-white/20 dark:border-gray-600/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={!currentUser || loading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wall; 