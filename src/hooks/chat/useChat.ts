import { useQuery } from "@tanstack/react-query";
import { chatApi } from "../../api/chat.api";

export const useChatHistory = (otherUserId: string, options?: { skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["chat", "history", otherUserId, options],
    queryFn: () => chatApi.getConversations({ other_user_id: otherUserId, ...options }),
    enabled: !!otherUserId,
  });
};
