/**
 * Chat Store
 * Manages chat conversations and messages with Zustand
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";
import type { Conversation, Message } from "@profile/api-client";

export interface ChatState {
 conversations: Conversation[];
 currentConversation: Conversation | null;
 messages: Message[];
 isLoading: boolean;
 error: string | null;
}

export interface ChatActions {
 setConversations: (conversations: Conversation[]) => void;
 setCurrentConversation: (conversation: Conversation | null) => void;
 setMessages: (messages: Message[]) => void;
 addMessage: (message: Message) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 fetchConversations: () => Promise<void>;
 fetchConversation: (id: string) => Promise<void>;
 fetchMessages: (conversationId: string) => Promise<void>;
 sendMessage: (recipientId: string, content: string) => Promise<void>;
 sendMessageToConversation: (
  conversationId: string,
  content: string
 ) => Promise<void>;
 markAsRead: (conversationId: string) => Promise<void>;
 clearError: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (apiClient: ProfileApiClient) =>
 create<ChatStore>((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  setConversations: (conversations) => set({ conversations }),

  setCurrentConversation: (currentConversation) => set({ currentConversation }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
   set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  fetchConversations: async () => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.chat.getConversations();
    set({ conversations: result.data, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch conversations";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchConversation: async (id) => {
   set({ isLoading: true, error: null });
   try {
    const conversation = await apiClient.chat.getConversation(id);
    set({ currentConversation: conversation, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch conversation";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchMessages: async (conversationId) => {
   set({ isLoading: true, error: null });
   try {
    const result = await apiClient.chat.getMessages(conversationId);
    set({ messages: result.data, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch messages";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  sendMessage: async (recipientId, content) => {
   set({ isLoading: true, error: null });
   try {
    const message = await apiClient.chat.sendMessage({ recipientId, content });
    get().addMessage(message);
    set({ isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to send message";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  sendMessageToConversation: async (conversationId, content) => {
   set({ isLoading: true, error: null });
   try {
    const message = await apiClient.chat.sendMessageToConversation(
     conversationId,
     content
    );
    get().addMessage(message);
    set({ isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to send message";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  markAsRead: async (conversationId) => {
   try {
    await apiClient.chat.markConversationAsRead(conversationId);
    // Update conversation unread count
    set((state) => ({
     conversations: state.conversations.map((c) =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
     ),
    }));
   } catch (error) {
    console.error("Failed to mark as read:", error);
   }
  },
 }));
