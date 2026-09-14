import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { ChatWebSocket, chatApi } from "@/api/chat.api";
import type { Message } from "@/api/chat.api";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/auth/useProfile";

interface ChatWindowProps {
  recipientId: string;
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ recipientId, conversationId }) => {
  const { data: user } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<ChatWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history } = useQuery({
    queryKey: ["chat", conversationId],
    queryFn: () => chatApi.getConversations({ conversation_id: conversationId, limit: 100 }),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (history?.items) {
      setMessages([...history.items].reverse()); // Assume history is sorted desc
    }
  }, [history]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = new ChatWebSocket(conversationId, token);
    ws.onMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    ws.connect();
    wsRef.current = ws;

    return () => {
      ws.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;
    wsRef.current.sendMessage(recipientId, input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Chat with User {recipientId.substring(0, 8)}</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 my-auto text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-indigo-600 text-white self-end rounded-br-none' : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'}`}>
                {msg.content}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button onClick={handleSend} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center h-10 w-10 shrink-0">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
