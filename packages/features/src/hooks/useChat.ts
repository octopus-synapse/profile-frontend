/**
 * useChat Hook
 * Shared chat logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { ChatStore } from "@profile/stores";

export interface Conversation {
 id: string;
 participantId: string;
 participantUsername: string;
 participantAvatar: string | null;
 lastMessage: string | null;
 lastMessageAt: string | null;
 unreadCount: number;
}

export interface Message {
 id: string;
 conversationId: string;
 senderId: string;
 content: string;
 createdAt: string;
 readAt: string | null;
}

export interface UseChatOptions {
 store: ChatStore;
 autoFetchConversations?: boolean;
 onNewMessage?: (message: Message) => void;
 onError?: (error: string) => void;
}

export interface UseChatReturn {
 // State
 conversations: Conversation[];
 currentConversation: Conversation | null;
 messages: Message[];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchConversations: () => Promise<void>;
 fetchMessages: (conversationId: string) => Promise<void>;
 sendMessage: (conversationId: string, content: string) => Promise<void>;
 startConversation: (userId: string) => Promise<Conversation>;
 selectConversation: (conversation: Conversation | null) => void;
 markAsRead: (conversationId: string) => Promise<void>;
 clearError: () => void;
}

export function useChat(options: UseChatOptions): UseChatReturn {
 const {
  store,
  autoFetchConversations = false,
  onNewMessage,
  onError,
 } = options;

 const conversations = store.conversations;
 const currentConversation = store.currentConversation;
 const messages = store.messages;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch conversations
 useEffect(() => {
  if (autoFetchConversations && conversations.length === 0 && !isLoading) {
   store.fetchConversations().catch(() => {});
  }
 }, [autoFetchConversations, conversations.length, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchConversations = useCallback(async () => {
  try {
   await store.fetchConversations();
  } catch {
   // Error handled by store
  }
 }, [store]);

 const fetchMessages = useCallback(
  async (conversationId: string) => {
   try {
    await store.fetchMessages(conversationId);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const sendMessage = useCallback(
  async (conversationId: string, content: string) => {
   try {
    await store.sendMessage(conversationId, content);
    // Optionally notify
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const startConversation = useCallback(
  async (userId: string) => {
   return store.startConversation(userId);
  },
  [store]
 );

 const selectConversation = useCallback(
  (conversation: Conversation | null) => {
   store.setCurrentConversation(conversation);
   if (conversation) {
    store.fetchMessages(conversation.id).catch(() => {});
   }
  },
  [store]
 );

 const markAsRead = useCallback(
  async (conversationId: string) => {
   try {
    await store.markAsRead(conversationId);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  conversations,
  currentConversation,
  messages,
  isLoading,
  error,
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  selectConversation,
  markAsRead,
  clearError,
 };
}
