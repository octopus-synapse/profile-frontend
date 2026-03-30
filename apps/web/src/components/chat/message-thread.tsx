'use client';

import { Button, Input, Skeleton, showToast } from '@octopus-synapse/profile-ui';
import {
  type MessagesListDataDtoMessagesMessagesItem,
  useChatGetMessages,
  useChatMarkConversationAsRead,
  useChatSendMessageToConversation,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTyping } from '@/shared/hooks/use-typing';
import { useSocket } from '@/shared/providers/socket-provider';

// --- Sub-components ---

function MessageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`msg-skeleton-${i}`}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <Skeleton className={`h-10 rounded-xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
        </div>
      ))}
    </div>
  );
}

function EmptyThread() {
  const t = useT();
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <MessageSquare className="mb-3 h-10 w-10 text-neutral-400" />
      <p className="text-sm font-medium text-neutral-300">{t('social.chat.noMessages')}</p>
      <p className="mt-1 text-xs text-neutral-500">{t('social.chat.startMessage')}</p>
    </div>
  );
}

interface MessageBubbleProps {
  message: MessagesListDataDtoMessagesMessagesItem;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwn ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-800 text-neutral-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        <span
          className={`mt-1 block text-right text-[10px] ${
            isOwn ? 'text-neutral-500' : 'text-neutral-500'
          }`}
        >
          {time}
          {isOwn && <span className="ml-1">{message.readAt ? '✓✓' : '✓'}</span>}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  const t = useT();
  return (
    <div className="flex items-center gap-2 px-4 py-1">
      <div className="flex gap-1">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-xs text-neutral-500">{t('social.chat.typing')}</span>
    </div>
  );
}

// --- Message input ---

interface MessageInputProps {
  onSend: (content: string) => void;
  isSending: boolean;
  onTyping?: () => void;
  onTypingStop?: () => void;
}

function MessageInput({ onSend, isSending, onTyping, onTypingStop }: MessageInputProps) {
  const t = useT();
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || isSending) return;
      onTypingStop?.();
      onSend(trimmed);
      setValue('');
    },
    [value, isSending, onSend, onTypingStop],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onTyping?.();
    },
    [onTyping],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-neutral-800 p-3"
    >
      <Input
        value={value}
        onChange={handleChange}
        onBlur={onTypingStop}
        placeholder={t('social.chat.messagePlaceholder')}
        className="flex-1"
        disabled={isSending}
        autoComplete="off"
      />
      <Button type="submit" disabled={!value.trim() || isSending} className="shrink-0">
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
}

// --- Main component ---

interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
}

export function MessageThread({ conversationId, currentUserId }: MessageThreadProps) {
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messagesResponse, isLoading } = useChatGetMessages(conversationId, undefined, {
    query: { enabled: !!conversationId },
  });
  const messages = messagesResponse?.data?.data?.messages?.messages ?? [];

  const sendMessage = useChatSendMessageToConversation();
  const markAsReadMutation = useChatMarkConversationAsRead();
  const { socket, isConnected } = useSocket();
  const { isOtherTyping, emitTypingStart, emitTypingStop } = useTyping(conversationId);

  // Mark as read helper
  const markAsRead = useCallback(
    (convId: string) => {
      markAsReadMutation.mutate({ conversationId: convId });
    },
    [markAsReadMutation],
  );

  // Auto-join conversation room and mark as read
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    socket.emit('conversation:join', { conversationId });
    markAsRead(conversationId);

    return () => {
      socket.emit('conversation:leave', { conversationId });
    };
  }, [socket, isConnected, conversationId, markAsRead]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage.mutate(
        { conversationId, data: { content } },
        {
          onError: () => {
            showToast.error(t('social.chat.sendFailed'));
          },
        },
      );
    },
    [conversationId, sendMessage, t],
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {!messages.length ? (
          <EmptyThread />
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
          ))
        )}
      </div>

      {isOtherTyping && <TypingIndicator />}

      <MessageInput
        onSend={handleSend}
        isSending={sendMessage.isPending}
        onTyping={emitTypingStart}
        onTypingStop={emitTypingStop}
      />
    </div>
  );
}
