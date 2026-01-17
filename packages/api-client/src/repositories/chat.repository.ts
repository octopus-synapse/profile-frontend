/**
 * Chat Repository
 * Handles chat messages and conversations
 */

import type { HttpClient } from "../client";

const BASE_URL = "/chat";

export interface SendMessageDto {
 recipientId: string;
 content: string;
}

export interface Message {
 id: string;
 conversationId: string;
 senderId: string;
 content: string;
 isRead: boolean;
 createdAt: string;
 updatedAt: string;
}

export interface Conversation {
 id: string;
 participants: Array<{
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
 }>;
 lastMessage: Message | null;
 unreadCount: number;
 createdAt: string;
 updatedAt: string;
}

export interface PaginatedConversations {
 data: Conversation[];
 total: number;
 page: number;
 limit: number;
 hasMore: boolean;
}

export interface PaginatedMessages {
 data: Message[];
 cursor: string | null;
 hasMore: boolean;
}

export interface BlockUserDto {
 blockedUserId: string;
}

export interface BlockedUser {
 id: string;
 userId: string;
 blockedUserId: string;
 blockedUser: {
  id: string;
  username: string;
  name: string | null;
 };
 createdAt: string;
}

export function createChatRepository(client: HttpClient) {
 return {
  /**
   * Send a message to a user
   */
  async sendMessage(dto: SendMessageDto): Promise<Message> {
   return client.post<Message>(`${BASE_URL}/messages`, dto);
  },

  /**
   * Send a message to an existing conversation
   */
  async sendMessageToConversation(
   conversationId: string,
   content: string
  ): Promise<Message> {
   return client.post<Message>(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
     content,
    }
   );
  },

  /**
   * Get all conversations
   */
  async getConversations(
   page = 1,
   limit = 20
  ): Promise<PaginatedConversations> {
   return client.get<PaginatedConversations>(`${BASE_URL}/conversations`, {
    params: { page, limit },
   });
  },

  /**
   * Get a single conversation
   */
  async getConversation(conversationId: string): Promise<Conversation> {
   return client.get<Conversation>(
    `${BASE_URL}/conversations/${conversationId}`
   );
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(
   conversationId: string,
   cursor?: string,
   limit = 50
  ): Promise<PaginatedMessages> {
   return client.get<PaginatedMessages>(
    `${BASE_URL}/conversations/${conversationId}/messages`,
    {
     params: { cursor, limit },
    }
   );
  },

  /**
   * Mark conversation as read
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
   await client.post(`${BASE_URL}/conversations/${conversationId}/read`);
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
   await client.delete(`${BASE_URL}/conversations/${conversationId}`);
  },

  /**
   * Block a user
   */
  async blockUser(dto: BlockUserDto): Promise<BlockedUser> {
   return client.post<BlockedUser>("/chat/blocks", dto);
  },

  /**
   * Unblock a user
   */
  async unblockUser(blockedUserId: string): Promise<void> {
   await client.delete(`/chat/blocks/${blockedUserId}`);
  },

  /**
   * Get list of blocked users
   */
  async getBlockedUsers(): Promise<BlockedUser[]> {
   const response = await client.get<{ data: BlockedUser[] }>("/chat/blocks");
   return response.data;
  },

  /**
   * Check if a user is blocked
   */
  async isBlocked(userId: string): Promise<boolean> {
   const response = await client.get<{ isBlocked: boolean }>(
    `/chat/blocks/${userId}/check`
   );
   return response.isBlocked;
  },
 };
}

export type ChatRepository = ReturnType<typeof createChatRepository>;
