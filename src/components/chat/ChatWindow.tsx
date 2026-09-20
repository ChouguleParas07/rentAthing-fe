import React, { useEffect, useState, useRef } from "react";
import { Send, CheckCheck, User as UserIcon, ShieldCheck, MapPin, Trash2, AlertTriangle } from "lucide-react";
import { ChatWebSocket, chatApi } from "@/api/chat.api";
import type { Message } from "@/api/chat.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/auth/useProfile";
import { useUser } from "@/hooks/users/useUser";
import { useNavigate } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";

interface ChatWindowProps {
  recipientId: string;
  conversationId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ recipientId, conversationId }) => {
  const { data: currentUser } = useProfile();
  const { data: recipientUser } = useUser(recipientId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history } = useQuery({
    queryKey: ["chat", conversationId],
    queryFn: () => chatApi.getConversations({ conversation_id: conversationId, limit: 100 }),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (history?.items) {
      setMessages([...history.items].reverse());
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

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    let sentViaWs = false;
    if (wsRef.current) {
      try {
        wsRef.current.sendMessage(recipientId, text);
        sentViaWs = true;
      } catch (e) {
        sentViaWs = false;
      }
    }

    if (!sentViaWs) {
      try {
        const newMsg = await chatApi.sendMessage({
          receiver_id: recipientId,
          content: text,
          conversation_id: conversationId,
        });
        setMessages((prev) => [...prev, newMsg]);
      } catch (err) {
        console.error("Failed to send message via HTTP fallback:", err);
      }
    }
  };

  const handleClearChat = async () => {
    setIsClearing(true);
    try {
      await chatApi.clearConversation(conversationId);
      setMessages([]);
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      setIsClearModalOpen(false);
    } catch (err) {
      console.error("Failed to clear chat:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const recipientName = recipientUser?.full_name || recipientUser?.email || `User ${recipientId.substring(0, 8)}`;
  const avatarLetter = (recipientName[0] || "U").toUpperCase();

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      {/* WhatsApp-Style Chat Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Clickable Avatar Photo */}
          <button
            onClick={() => navigate(`/profile/${recipientId}`)}
            className="relative group focus:outline-none"
            title="View User Profile"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
              {recipientUser?.avatar_url ? (
                <img src={recipientUser.avatar_url} alt={recipientName} className="w-full h-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>

          <div>
            <button
              onClick={() => navigate(`/profile/${recipientId}`)}
              className="text-left font-bold text-gray-900 hover:text-green-700 text-base leading-tight block group flex items-center gap-1.5"
            >
              <span>{recipientName}</span>
              {recipientUser?.role && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-green-100 text-green-800">
                  {recipientUser.role}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active now</span>
              {recipientUser?.city && (
                <span className="text-gray-400 font-normal flex items-center gap-0.5">
                  • <MapPin className="w-3 h-3 inline" /> {recipientUser.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-rose-100 flex items-center gap-1 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Clear Chat
          </button>
          <button
            onClick={() => navigate(`/profile/${recipientId}`)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 transition-colors"
          >
            <UserIcon className="w-3.5 h-3.5 text-gray-500" /> Profile
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.length === 0 ? (
          <div className="text-center my-auto bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-gray-200/80 max-w-sm mx-auto shadow-xs">
            <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-gray-900 text-sm">End-to-End Rental Chat</p>
            <p className="text-xs text-gray-500 mt-1">Say hello to {recipientName}! Discuss dates, pickup location, or questions.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-xs flex flex-col gap-1 ${isMe
                    ? "bg-emerald-600 text-white self-end rounded-br-xs"
                    : "bg-white text-gray-900 self-start border border-gray-100 rounded-bl-xs"
                  }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-emerald-100" : "text-gray-400"
                    }`}
                >
                  <span>{formatMessageTime(msg.created_at)}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200 inline" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Message ${recipientName}...`}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 bg-gray-50 outline-none focus:border-green-600 focus:bg-white transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:hover:bg-green-600 transition-all flex items-center justify-center h-11 w-11 shrink-0 shadow-md shadow-green-600/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600 font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-600" /> Clear Chat History
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to clear all messages in this conversation with <span className="font-bold text-gray-900">{recipientName}</span>?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-700">
            Messages are preserved safely on the server and will not be deleted automatically. Using "Clear Chat" will reset history for this view.
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClearChat}
              disabled={isClearing}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isClearing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Clear Chat
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatWindow;
