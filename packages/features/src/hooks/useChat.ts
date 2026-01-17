/**
 * useChat Hook
 * Shared chat logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { ChatStore } from "@profile/stores";

export interface UseChatOptions {
 store: ChatStore;
 autoFetchConversations?: boolean;
 onError?: (error: string) => void;
}

export interface UseChatReturn {
 // State
 conversations: ChatStore["conversations"];
 currentConversation: ChatStore["currentConversation"];
 messages: ChatStore["messages"];
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchConversations: () => Promise<void>;
 fetchConversation: (id: string) => Promise<void>;
 fetchMessages: (conversationId: string) => Promise<void>;
 sendMessage: (recipientId: string, content: string) => Promise<void>;
 sendMessageToConversation: (conversationId: string, content: string) => Promise<void>;
 selectConversation: (conversation: ChatStore["currentConversation"]) => void;
 markAsRead: (conversationId: string) => Promise<void>;
 clearError: () => void;
}

export function useChat(options: UseChatOptions): UseChatReturn {
 const { store, autoFetchConversations = false, onError } = options;

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

 const fetchConversation = useCallback(
  async (id: string) => {
   try {
    await store.fetchConversation(id);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

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
  async (recipientId: string, content: string) => {
   try {
    await store.sendMessage(recipientId, content);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const sendMessageToConversation = useCallback(
  async (conversationId: string, content: string) => {
   try {
    await store.sendMessageToConversation(conversationId, content);
   } catch {
    // Error handled by store
   }
  },
  [store]
 );

 const selectConversation = useCallback(
  (conversation: ChatStore["currentConversation"]) => {
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
  fetchConversation,
  fetchMessages,
  sendMessage,
  sendMessageToConversation,
  selectConversation,
  markAsRead,
  clearError,
 };
}
