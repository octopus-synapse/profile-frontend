/**
 * Chat Domain Types
 * API types for chat operations
 */

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

export interface ConversationParticipant {
 id: string;
 username: string;
 name: string | null;
 avatar: string | null;
}

export interface Conversation {
 id: string;
 participants: ConversationParticipant[];
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
