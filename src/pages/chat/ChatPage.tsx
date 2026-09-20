import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import ChatWindow from "@/components/chat/ChatWindow";
import { useProfile } from "@/hooks/auth/useProfile";
import { useUser } from "@/hooks/users/useUser";
import { MessageCircle } from "lucide-react";

interface ConversationItem {
  id: string;
  otherUserId: string;
  lastMessage: string;
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
  const navigate = useNavigate();

  const name = otherUser?.full_name || otherUser?.email || `User ${conv.otherUserId.substring(0, 8)}`;
  const avatarLetter = (name[0] || "U").toUpperCase();

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${conv.otherUserId}`);
  };

  return (
    <div
      onClick={onSelect}
      className={`w-full text-left p-3.5 border-b border-gray-100 hover:bg-emerald-50/50 cursor-pointer transition-colors flex items-center gap-3 ${isActive ? "bg-emerald-50/80 border-l-4 border-l-emerald-600" : ""
        }`}
    >
      {/* Clickable Profile Avatar Photo */}
      <button
        onClick={handleAvatarClick}
        title="View User Profile"
        className="relative shrink-0 group focus:outline-none"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-bold text-lg flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            avatarLetter
          )}
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          {otherUser?.role && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-green-100 text-green-800 shrink-0">
              {otherUser.role}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
      </div>
    </div>
  );
};

export const ChatPage = () => {
  const { data: user } = useProfile();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("user_id");

  const [activeConversation, setActiveConversation] = useState<{ id: string; otherUserId: string } | null>(null);

  // We fetch a list of recent messages to determine active conversations
  const { data: history, isLoading } = useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatApi.getConversations({ limit: 50 }),
    enabled: !!user,
  });

  useEffect(() => {
    if (user && targetUserId && targetUserId !== user.id) {
      const convoId = [user.id, targetUserId].sort().join("_");
      setActiveConversation({ id: convoId, otherUserId: targetUserId });
    }
  }, [user, targetUserId]);

  const getUniqueConversations = () => {
    const convos = new Map<string, ConversationItem>();

    if (history?.items) {
      history.items.forEach((msg) => {
        const convoKey = msg.conversation_id || [msg.sender_id, msg.receiver_id].sort().join("_");
        if (!convos.has(convoKey)) {
          const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
          convos.set(convoKey, {
            id: convoKey,
            otherUserId,
            lastMessage: msg.content,
          });
        }
      });
    }

    if (user && targetUserId && targetUserId !== user.id) {
      const targetConvoId = [user.id, targetUserId].sort().join("_");
      if (!convos.has(targetConvoId)) {
        convos.set(targetConvoId, {
          id: targetConvoId,
          otherUserId: targetUserId,
          lastMessage: "Start a conversation...",
        });
      }
    }

    return Array.from(convos.values());
  };

  const conversations = getUniqueConversations();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
            Live End-to-End Chat
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[620px]">
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-900 text-sm uppercase tracking-wider bg-gray-50/50 flex justify-between items-center">
              <span>Chats</span>
              <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {conversations.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-gray-500 text-sm flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading chats...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No messages yet.</div>
              ) : (
                conversations.map((conv) => (
                  <ChatContactItem
                    key={conv.id}
                    conv={conv}
                    isActive={activeConversation?.id === conv.id}
                    onSelect={() => setActiveConversation(conv)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 bg-gray-50/50">
            {activeConversation ? (
              <ChatWindow conversationId={activeConversation.id} recipientId={activeConversation.otherUserId} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4 text-green-600">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Stashly Messaging</h3>
                <p className="text-sm text-center max-w-sm text-gray-500">
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

