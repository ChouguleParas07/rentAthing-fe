import React, { useEffect, useState, useRef } from "react";
import { Send, CheckCheck, ShieldCheck, Trash2, AlertTriangle, MoreHorizontal } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const myTypingTimeoutRef = useRef<number | null>(null);
  const lastTypingSentRef = useRef<number>(0);

  const { data: history } = useQuery({
    queryKey: ["chat", conversationId],
    queryFn: () => chatApi.getConversations({ conversation_id: conversationId, limit: 100 }),
    enabled: !!conversationId,
  });

  useEffect(() => {
    const list = history?.items || history?.messages;
    if (list) {
      setMessages([...list].reverse());
    }
  }, [history]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = new ChatWebSocket(conversationId, token);
    ws.onMessage = (msg) => {
      if (msg.type === "typing") {
        if (msg.sender_id !== currentUser?.id) {
          setIsTyping(msg.is_typing);
          if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
          if (msg.is_typing) {
            typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 3000);
          }
        }
      } else {
        setMessages((prev) => [...prev, msg as Message]);
        if (msg.sender_id !== currentUser?.id) {
          setIsTyping(false);
        }
      }
    };
    ws.connect();
    wsRef.current = ws;

    return () => {
      ws.disconnect();
    };
  }, [conversationId, currentUser?.id]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (e.target.value.trim() === "") {
      wsRef.current?.sendTyping(false);
      lastTypingSentRef.current = 0;
      return;
    }

    const now = Date.now();
    if (now - lastTypingSentRef.current > 1500) {
      wsRef.current?.sendTyping(true);
      lastTypingSentRef.current = now;
    }

    if (myTypingTimeoutRef.current) window.clearTimeout(myTypingTimeoutRef.current);
    myTypingTimeoutRef.current = window.setTimeout(() => {
      wsRef.current?.sendTyping(false);
      lastTypingSentRef.current = 0;
    }, 2000);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    wsRef.current?.sendTyping(false);

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
    <div className="flex flex-col h-full w-full">
      {/* WhatsApp-Style Chat Header */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between z-10 rounded-t-[2rem]">
        <div className="flex items-center gap-4 pl-2">
          {/* Clickable Avatar Photo */}
          <button
            onClick={() => navigate(`/profile/${recipientId}`)}
            className="relative group focus:outline-none shrink-0"
            title="View User Profile"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
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
              className="text-left font-extrabold text-gray-900 hover:text-green-700 text-base leading-tight block group flex items-center gap-2"
            >
              <span>{recipientName}</span>
              {recipientUser?.role && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-green-100 text-green-700">
                  {recipientUser.role}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-600 font-bold">Active now</span>
              {recipientUser?.city && (
                <span className="flex items-center gap-1 before:content-['•'] before:mr-1">
                  {recipientUser.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 pr-2">
          <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div ref={containerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 relative z-0">

        {/* Subtle Watermark Pattern (Simulated with absolute div) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83-54.627 54.627-.83-.83L54.627 0zM29.627 0l.83.83-29.627 29.627-.83-.83L29.627 0zM59.627 29.17l.83.83-29.627 29.627-.83-.83L59.627 29.17z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

        {messages.length === 0 ? (
          <div className="text-center my-auto bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-100 max-w-sm mx-auto shadow-sm">
            <ShieldCheck className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="font-extrabold text-[#1A2530] text-base">End-to-End Rental Chat</p>
            <p className="text-sm text-gray-500 mt-2">Say hello to {recipientName}! Discuss dates, pickup location, or questions.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`max-w-[75%] md:max-w-[65%] rounded-3xl px-5 py-3 shadow-sm flex flex-col gap-1 relative z-10 ${isMe
                  ? "bg-[#D1F4E0] text-[#1A2530] self-end rounded-tr-sm"
                  : "bg-white text-[#1A2530] self-start border border-gray-100 rounded-tl-sm"
                  }`}
              >
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                {/* Specific Embedded Item Mockup (If Message Content contains "Cordless Drill") */}
                {msg.content.includes("Cordless Drill") && (
                  <div className="mt-2 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0">
                      <img src="https://placehold.co/200x200/e2e8f0/1e293b?text=Drill" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-[#1A2530] line-clamp-1">Cordless Drill/Driver Kit</h4>
                      <div className="font-extrabold text-[#00A843] text-sm mt-0.5">₹400.00<span className="text-[10px] text-gray-500 font-normal">/day</span></div>
                      <a href="#" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 mt-1 hover:underline">View Listing <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-center justify-end gap-1 text-[9px] font-bold ${isMe ? "text-green-700" : "text-gray-400"
                    }`}
                >
                  <span>{formatMessageTime(msg.created_at)}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-green-600 inline" />}
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex self-start bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs max-w-[75%] md:max-w-[65%] gap-1">
            <span className="text-sm italic">{recipientName} is typing</span>
            <span className="flex items-center space-x-1 ml-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md rounded-b-[2rem] border-t border-gray-100 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3 relative"
        >
          <button type="button" className="text-gray-400 hover:text-gray-600 p-2 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-sm transition-shadow"
          />

          <button type="button" className="absolute right-16 text-gray-400 hover:text-gray-600 p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-11 h-11 bg-[#00A843] text-white rounded-full flex flex-col items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#009038] hover:scale-105 active:scale-95 transition-all shadow-md shadow-green-600/20"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
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
