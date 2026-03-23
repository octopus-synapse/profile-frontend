'use client';

import { useT } from '@profile/i18n';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import {
  Avatar,
  Badge,
  Skeleton,
} from '@/shared/components/ui';
import { useConversations } from './hooks/use-chat';
import type { Conversation } from './hooks/use-chat';

// --- Sub-components ---

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-44" />
      </div>
      <Skeleton className="h-3 w-10" />
    </div>
  );
}

function EmptyConversations() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MessageSquare className="mb-3 h-10 w-10 text-neutral-400" />
      <p className="text-sm font-medium text-neutral-300">
        {t('social.chat.noConversations')}
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        {t('social.chat.startConversation')}
      </p>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string;
  onSelect: (id: string) => void;
}

function ConversationItem({
  conversation,
  isSelected,
  currentUserId,
  onSelect,
}: ConversationItemProps) {
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId,
  );
  const displayName = otherParticipant?.displayName ?? 'Unknown';
  const avatarUrl = otherParticipant?.avatarUrl ?? undefined;
  const initials = displayName.charAt(0).toUpperCase();

  const t = useT();
  const preview = conversation.lastMessage?.content ?? t('social.chat.noMessagesPreview');
  const truncatedPreview =
    preview.length > 50 ? `${preview.slice(0, 50)}…` : preview;

  const timestamp = conversation.lastMessage?.createdAt
    ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
        addSuffix: true,
      })
    : '';

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
        isSelected
          ? 'bg-neutral-800 ring-1 ring-neutral-600'
          : 'hover:bg-neutral-800/50'
      }`}
    >
      <Avatar className="h-10 w-10 shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-neutral-700 text-sm font-medium text-neutral-200">
            {initials}
          </span>
        )}
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-neutral-100">
            {displayName}
          </span>
          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="shrink-0 text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-neutral-400">
          {truncatedPreview}
        </p>
      </div>

      {timestamp && (
        <span className="shrink-0 text-[10px] text-neutral-500">
          {timestamp}
        </span>
      )}
    </button>
  );
}

// --- Main component ---

interface ConversationListProps {
  selectedId: string | null;
  currentUserId: string;
  onSelect: (conversationId: string) => void;
}

export function ConversationList({
  selectedId,
  currentUserId,
  onSelect,
}: ConversationListProps) {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return <EmptyConversations />;
  }

  return (
    <div className="space-y-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          currentUserId={currentUserId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
