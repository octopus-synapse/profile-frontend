'use client';

import { Avatar, Badge, Button, Skeleton } from '@octopus-synapse/profile-ui';
import {
  type ConversationsListDataDtoConversationsConversationsItem,
  useChatGetConversations,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

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
      <p className="text-sm font-medium text-neutral-300">{t('social.chat.noConversations')}</p>
      <p className="mt-1 text-xs text-neutral-500">{t('social.chat.startConversation')}</p>
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationsListDataDtoConversationsConversationsItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isOnline?: boolean;
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  isOnline = false,
}: ConversationItemProps) {
  const t = useT();
  const displayName = conversation.participant.displayName ?? 'Unknown';
  const avatarUrl = conversation.participant.photoURL ?? undefined;
  const initials = displayName.charAt(0).toUpperCase();

  const preview = conversation.lastMessage?.content ?? t('social.chat.noMessagesPreview');
  const truncatedPreview = preview.length > 50 ? `${preview.slice(0, 50)}…` : preview;

  const timestamp = conversation.lastMessage?.createdAt
    ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
        addSuffix: true,
      })
    : '';

  return (
    <Button
      type="button"
      variant={isSelected ? 'soft' : 'ghost'}
      tone="neutral"
      size="lg"
      fullWidth
      pressed={isSelected}
      onPress={() => onSelect(conversation.id)}
    >
      <div className="flex w-full items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10">
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
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-neutral-900 bg-green-500" />
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-neutral-100">{displayName}</span>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="shrink-0 text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-neutral-400">{truncatedPreview}</p>
        </div>

        {timestamp && <span className="shrink-0 text-[10px] text-neutral-500">{timestamp}</span>}
      </div>
    </Button>
  );
}

// --- Main component ---

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
  isUserOnline?: (userId: string) => boolean;
}

export function ConversationList({ selectedId, onSelect, isUserOnline }: ConversationListProps) {
  const { data: response, isLoading } = useChatGetConversations();
  const conversations = response?.data?.data?.conversations?.conversations ?? [];

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <ConversationSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!conversations.length) {
    return <EmptyConversations />;
  }

  return (
    <div className="space-y-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onSelect={onSelect}
          isOnline={isUserOnline?.(conversation.participant.id) ?? false}
        />
      ))}
    </div>
  );
}
