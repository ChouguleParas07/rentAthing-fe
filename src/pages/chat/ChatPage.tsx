import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import ChatWindow from "@/components/chat/ChatWindow";
import { useProfile } from "@/hooks/auth/useProfile";
import { MessageCircle } from "lucide-react";

export const ChatPage = () => {
  const { data: user } = useProfile();
  const [activeConversation, setActiveConversation] = useState<{ id: string, otherUserId: string } | null>(null);

  // We fetch a list of recent messages to determine active conversations
  const { data: history, isLoading } = useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatApi.getConversations({ limit: 50 }),
    enabled: !!user,
  });

  const getUniqueConversations = () => {
    if (!history?.items) return [];
    const convos = new Map<string, { id: string, otherUserId: string, lastMessage: string }>();

    history.items.forEach((msg) => {
      if (!convos.has(msg.conversation_id)) {
        const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
        convos.set(msg.conversation_id, {
          id: msg.conversation_id,
          otherUserId,
          lastMessage: msg.content
        });
      }
    });

    return Array.from(convos.values());
  };

  const conversations = getUniqueConversations();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
              Conversations
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-gray-500 text-sm">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">No messages yet.</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeConversation?.id === conv.id ? 'bg-indigo-50 border-indigo-100' : ''}`}
                  >
                    <p className="font-medium text-gray-900 truncate">User {conv.otherUserId.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 bg-gray-50/50">
            {activeConversation ? (
              <ChatWindow conversationId={activeConversation.id} recipientId={activeConversation.otherUserId} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
