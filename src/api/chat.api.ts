import api from "./axios";

export type Message = {
  type?: "message";
  id: string;
  sender_id: string;
  receiver_id: string;
  conversation_id: string;
  content: string;
  created_at: string;
};

export type ChatEvent = Message | { type: "typing"; sender_id: string; is_typing: boolean };

export type MessageListResponse = {
  items?: Message[];
  messages?: Message[];
  total: number;
};

export const chatApi = {
  getConversations: (params?: { other_user_id?: string; conversation_id?: string; skip?: number; limit?: number }) =>
    api.get<MessageListResponse>("/chat/conversations", { params }).then((res) => res.data),

  sendMessage: (payload: { receiver_id: string; content: string; conversation_id?: string }) =>
    api.post<Message>("/chat/messages", payload).then((res) => res.data),

  clearConversation: (conversationId: string) =>
    api.delete<{ message: string }>(`/chat/conversations/${conversationId}`).then((res) => res.data),
};

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private token: string;
  private conversationId: string;
  public onMessage?: (msg: ChatEvent) => void;
  public onError?: (err: Event) => void;
  public onClose?: (ev: CloseEvent) => void;

  constructor(conversationId: string, token: string) {
    this.conversationId = conversationId;
    this.token = token;
  }

  connect() {
    const baseUrl = import.meta.env.VITE_API_URL || "https://rent-a-thing-seven.vercel.app";
    const wsBase = baseUrl.replace(/^http/, "ws");
    const wsUrl = `${wsBase}/chat/ws/${this.conversationId}`;
    this.ws = new WebSocket(wsUrl, [this.token]);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WS Error from server:", data.error);
        return;
      }
      this.onMessage?.(data as ChatEvent);
    };

    this.ws.onerror = (err) => {
      console.error("WS Error:", err);
      this.onError?.(err);
    };

    this.ws.onclose = (ev) => {
      this.onClose?.(ev);
    };
  }

  sendMessage(receiverId: string, content: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "message", receiver_id: receiverId, content }));
    }
  }

  sendTyping(isTyping: boolean) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
