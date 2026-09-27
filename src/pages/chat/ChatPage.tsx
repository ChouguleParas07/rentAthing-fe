import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import ChatWindow from "@/components/chat/ChatWindow";
import { useProfile } from "@/hooks/auth/useProfile";
import { useUser } from "@/hooks/users/useUser";
import { MessageCircle, Search, Inbox, Archive, ShieldCheck } from "lucide-react";
import { format } from "date-fns";

interface ConversationItem {
  id: string;
  otherUserId: string;
  lastMessage: string;
  timestamp: string;
}

const ChatContactItem = ({
  conv,
  isActive,
  onSelect,
}: {
  conv: ConversationItem;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const { data: otherUser } = useUser(conv.otherUserId);
  const name = otherUser?.full_name || otherUser?.email || `User ${conv.otherUserId.substring(0, 8)}`;

  // Mocking role for visual mockup based on name or ID hash
  const isOwner = conv.otherUserId.charCodeAt(0) % 2 === 0;

  return (
    <div
      onClick={onSelect}
      className={`w-full text-left p-4 cursor-pointer transition-colors flex items-start gap-3 relative
        ${isActive ? "bg-green-50/50" : "hover:bg-gray-50"}
      `}
    >
      {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00A843] rounded-r-full" />}

      <div className="relative shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-lg flex items-center justify-center overflow-hidden">
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            (name[0] || "U").toUpperCase()
          )}
        </div>
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 truncate">
            <p className="font-extrabold text-gray-900 text-sm truncate">{name}</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${isOwner ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
              {isOwner ? "Owner" : "Renter"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium ml-2">
            {format(new Date(conv.timestamp), 'hh:mm a')}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate pr-2">{conv.lastMessage}</p>
        </div>
      </div>
    </div>
  );
};

export const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const { data: user } = useProfile();
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(null);

  const { data: messagesResponse, isLoading } = useQuery({
    queryKey: ["messages", "all"],
    queryFn: () => chatApi.getConversations({ limit: 100 }),
    enabled: !!user,
  });

  const messages = messagesResponse?.items || messagesResponse?.messages || [];

  useEffect(() => {
    if (messages && messages.length > 0 && !activeConversation) {
      const convos = getUniqueConversations();
      if (convos.length > 0) {
        const urlUserId = searchParams.get("user_id");
        if (urlUserId) {
          const matched = convos.find(c => c.otherUserId === urlUserId);
          if (matched) setActiveConversation(matched);
          else setActiveConversation(convos[0]);
        } else {
          setActiveConversation(convos[0]);
        }
      }
    }
  }, [messages, searchParams]);

  const getUniqueConversations = () => {
    if (!messages) return [];
    const convos = new Map<string, ConversationItem>();

    // Reverse to process newest first (assuming array is chronologically sorted)
    const reversedMessages = [...messages].reverse();

    for (const msg of reversedMessages) {
      const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
      if (!convos.has(otherUserId)) {
        convos.set(otherUserId, {
          id: msg.conversation_id || msg.id,
          otherUserId,
          lastMessage: msg.content,
          timestamp: msg.created_at,
        });
      }
    }

    return Array.from(convos.values());
  };

  const conversations = getUniqueConversations();

  return (
    <div className="min-h-screen bg-[#F8FAF9] px-6 py-10 md:px-12 pb-20 overflow-x-hidden relative z-0">

      {/* High-Fidelity Background Texture & Organic Shapes */}
      <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[800px] bg-gradient-to-br from-green-200/40 to-transparent rounded-[100%] blur-3xl transform -rotate-12" />
        <div className="absolute top-[-5%] right-[-5%] w-[60%] h-[700px] bg-gradient-to-bl from-emerald-200/50 via-lime-100/20 to-transparent rounded-[100%] blur-3xl" />
        <div className="absolute top-[10%] left-[30%] w-[40%] h-[600px] bg-lime-200/20 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 shrink-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1A2530] tracking-tight mb-2">Messages</h1>
            <p className="text-gray-500 text-lg">Chat with owners and renters, discuss details, and make your rentals easier.</p>
          </div>
          <div className="hidden md:flex bg-green-50/80 backdrop-blur-md px-5 py-3 rounded-2xl items-center gap-3 border border-green-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-green-700 text-sm">Live End-to-End Chat</div>
              <div className="text-green-600/70 text-[11px] font-medium tracking-wide">Fast • Secure • Real-time</div>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex gap-6 h-full min-h-0 flex-1">

          {/* Left Sidebar - Chat List */}
          <div className="w-[340px] bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
            <div className="p-5 border-b border-gray-50">
              <div className="relative mb-5">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-shadow"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-[#00A843] text-white py-2 px-3 rounded-xl text-xs font-bold shadow-sm shadow-green-600/20 flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" /> All Chats <span className="bg-white/20 px-1.5 rounded-full text-[10px]">2</span>
                </button>
                <button className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-gray-400" /> Unread <span className="bg-gray-100 text-gray-600 px-1.5 rounded-full text-[10px]">1</span>
                </button>
                <button className="p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center justify-center font-bold text-xs gap-1">
                  <Archive className="w-3.5 h-3.5 text-gray-400" /> Archived
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-10 text-center text-gray-500 text-sm flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading chats...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">No messages yet.</div>
              ) : (
                conversations.map((conv) => (
                  <ChatContactItem
                    key={conv.id}
                    conv={conv}
                    isActive={activeConversation?.otherUserId === conv.otherUserId}
                    onSelect={() => setActiveConversation(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Middle - Chat Window */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
            {activeConversation ? (
              <ChatWindow conversationId={activeConversation.id} recipientId={activeConversation.otherUserId} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4 text-green-600">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Stashly Messaging</h3>
                <p className="text-sm text-center max-w-md text-gray-500">
                  Select a contact from the sidebar or click "Message Owner" on any item page to start chatting.
                </p>
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  );
};

