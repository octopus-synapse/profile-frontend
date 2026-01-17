/**
 * Chat Store Tests
 *
 * Tests chat conversations and messaging operations.
 */

import { describe, it, expect, mock } from "bun:test";
import { createChatStore } from "../chat.store";
import type { ProfileApiClient } from "@profile/api-client";

const mockConversation = {
 id: "conv-1",
 participants: [{ id: "user-1" }, { id: "user-2" }],
 lastMessage: { content: "Hello" },
 unreadCount: 2,
 createdAt: "2025-01-14T00:00:00Z",
};

const mockMessage = {
 id: "msg-1",
 conversationId: "conv-1",
 senderId: "user-1",
 content: "Hello World",
 createdAt: "2025-01-14T10:00:00Z",
};

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["chat"]> = {}
) => {
 return {
  chat: {
   getConversations: mock(() => Promise.resolve({ data: [mockConversation] })),
   getConversation: mock(() => Promise.resolve(mockConversation)),
   getMessages: mock(() => Promise.resolve({ data: [mockMessage] })),
   sendMessage: mock(() => Promise.resolve(mockMessage)),
   sendMessageToConversation: mock(() => Promise.resolve(mockMessage)),
   markConversationAsRead: mock(() => Promise.resolve()),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("ChatStore", () => {
 describe("Initial State", () => {
  it("should have empty conversations array", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   expect(useStore.getState().conversations).toEqual([]);
  });

  it("should have null currentConversation", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   expect(useStore.getState().currentConversation).toBeNull();
  });

  it("should have empty messages array", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   expect(useStore.getState().messages).toEqual([]);
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setters", () => {
  it("should set conversations", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);
   const conversations = [mockConversation as any];

   useStore.getState().setConversations(conversations);

   expect(useStore.getState().conversations).toEqual(conversations);
  });

  it("should set current conversation", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   useStore.getState().setCurrentConversation(mockConversation as any);

   expect(useStore.getState().currentConversation).toEqual(mockConversation);
  });

  it("should set messages", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);
   const messages = [mockMessage as any];

   useStore.getState().setMessages(messages);

   expect(useStore.getState().messages).toEqual(messages);
  });

  it("should add message to existing messages", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);
   const newMessage = { ...mockMessage, id: "msg-2" } as any;

   useStore.getState().setMessages([mockMessage as any]);
   useStore.getState().addMessage(newMessage);

   expect(useStore.getState().messages).toHaveLength(2);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   useStore.getState().setError("Chat error");
   expect(useStore.getState().error).toBe("Chat error");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchConversations", () => {
  it("should fetch and store conversations", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   await useStore.getState().fetchConversations();

   expect(useStore.getState().conversations).toHaveLength(1);
   expect(useStore.getState().conversations[0].id).toBe("conv-1");
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getConversations: mock(() =>
     Promise.reject(new Error("Failed to load conversations"))
    ),
   });
   const useStore = createChatStore(apiClient);

   await expect(useStore.getState().fetchConversations()).rejects.toThrow(
    "Failed to load conversations"
   );
   expect(useStore.getState().error).toBe("Failed to load conversations");
  });
 });

 describe("fetchConversation", () => {
  it("should fetch single conversation by ID", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   await useStore.getState().fetchConversation("conv-1");

   expect(useStore.getState().currentConversation?.id).toBe("conv-1");
   expect(apiClient.chat.getConversation).toHaveBeenCalledWith("conv-1");
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getConversation: mock(() =>
     Promise.reject(new Error("Conversation not found"))
    ),
   });
   const useStore = createChatStore(apiClient);

   await expect(
    useStore.getState().fetchConversation("invalid")
   ).rejects.toThrow("Conversation not found");
   expect(useStore.getState().error).toBe("Conversation not found");
  });
 });

 describe("fetchMessages", () => {
  it("should fetch messages for conversation", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   await useStore.getState().fetchMessages("conv-1");

   expect(useStore.getState().messages).toHaveLength(1);
   expect(useStore.getState().messages[0].content).toBe("Hello World");
   expect(apiClient.chat.getMessages).toHaveBeenCalledWith("conv-1");
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    getMessages: mock(() =>
     Promise.reject(new Error("Failed to load messages"))
    ),
   });
   const useStore = createChatStore(apiClient);

   await expect(useStore.getState().fetchMessages("conv-1")).rejects.toThrow(
    "Failed to load messages"
   );
   expect(useStore.getState().error).toBe("Failed to load messages");
  });
 });

 describe("sendMessage", () => {
  it("should send message to recipient and add to messages", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   await useStore.getState().sendMessage("user-2", "Hello!");

   expect(apiClient.chat.sendMessage).toHaveBeenCalledWith({
    recipientId: "user-2",
    content: "Hello!",
   });
   expect(useStore.getState().messages).toHaveLength(1);
  });

  it("should handle send error", async () => {
   const apiClient = createMockApiClient({
    sendMessage: mock(() =>
     Promise.reject(new Error("Failed to send message"))
    ),
   });
   const useStore = createChatStore(apiClient);

   await expect(
    useStore.getState().sendMessage("user-2", "Hi")
   ).rejects.toThrow("Failed to send message");
   expect(useStore.getState().error).toBe("Failed to send message");
  });
 });

 describe("sendMessageToConversation", () => {
  it("should send message to existing conversation", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   await useStore.getState().sendMessageToConversation("conv-1", "Reply");

   expect(apiClient.chat.sendMessageToConversation).toHaveBeenCalledWith(
    "conv-1",
    "Reply"
   );
   expect(useStore.getState().messages).toHaveLength(1);
  });

  it("should handle send error", async () => {
   const apiClient = createMockApiClient({
    sendMessageToConversation: mock(() =>
     Promise.reject(new Error("Cannot send"))
    ),
   });
   const useStore = createChatStore(apiClient);

   await expect(
    useStore.getState().sendMessageToConversation("conv-1", "Reply")
   ).rejects.toThrow("Cannot send");
  });
 });

 describe("markAsRead", () => {
  it("should mark conversation as read and reset unread count", async () => {
   const apiClient = createMockApiClient();
   const useStore = createChatStore(apiClient);

   // Set up conversations first
   useStore
    .getState()
    .setConversations([{ ...mockConversation, unreadCount: 5 } as any]);

   await useStore.getState().markAsRead("conv-1");

   expect(apiClient.chat.markConversationAsRead).toHaveBeenCalledWith("conv-1");
   expect(useStore.getState().conversations[0].unreadCount).toBe(0);
  });

  it("should silently handle errors", async () => {
   const apiClient = createMockApiClient({
    markConversationAsRead: mock(() =>
     Promise.reject(new Error("Network error"))
    ),
   });
   const useStore = createChatStore(apiClient);

   // Should not throw
   await useStore.getState().markAsRead("conv-1");
   // Error should not be set for this operation
  });
 });
});
