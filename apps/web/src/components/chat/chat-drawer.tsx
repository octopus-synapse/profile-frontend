'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send, X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Avatar } from '@/shared/components/ui';
import { chatKeys, useConversationWith, useCreateConversation, useMessages, useSendMessage } from './hooks/use-chat';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientPhotoUrl?: string | null;
}

export const ChatDrawer = memo(function ChatDrawer({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  recipientPhotoUrl,
}: ChatDrawerProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Get or create conversation
  const { data: conversationData, isLoading: isLoadingConversation } = useConversationWith(recipientId);
  const conversationId = conversationData?.conversationId;

  // Get messages if conversation exists
  const { data: messages, isLoading: isLoadingMessages } = useMessages(conversationId ?? '');

  // Mutations
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessage('');

    try {
      if (conversationId) {
        // Existing conversation
        await sendMessageMutation.mutateAsync({
          conversationId,
          content: trimmedMessage,
        });
      } else {
        // Create new conversation
        await createConversationMutation.mutateAsync({
          recipientId,
          content: trimmedMessage,
        });
        // Refetch conversation to get the ID
        queryClient.invalidateQueries({ queryKey: [...chatKeys.all, 'conversation-with', recipientId] });
      }
    } catch {
      // Error handling - restore message
      setMessage(trimmedMessage);
    }
  }, [message, conversationId, recipientId, sendMessageMutation, createConversationMutation, queryClient]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const isSending = sendMessageMutation.isPending || createConversationMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#0c0c0e] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/50 px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {recipientPhotoUrl ? (
                    <img
                      src={recipientPhotoUrl}
                      alt={recipientName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white">
                      {recipientName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium text-white">{recipientName}</h3>
                  <p className="text-xs text-zinc-500">Mensagem direta</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingConversation || isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-600" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      content={msg.content}
                      isOwn={msg.senderId !== recipientId}
                      timestamp={msg.createdAt}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-zinc-800/50 p-4">
                    <Avatar className="h-16 w-16">
                      {recipientPhotoUrl ? (
                        <img
                          src={recipientPhotoUrl}
                          alt={recipientName}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-zinc-700 text-xl font-medium text-white">
                          {recipientName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </Avatar>
                  </div>
                  <h4 className="text-sm font-medium text-white">{recipientName}</h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Envie uma mensagem para iniciar a conversa
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800/50 p-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  disabled={isSending}
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-700 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={!message.trim() || isSending}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black transition-all hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Message bubble component
const MessageBubble = memo(function MessageBubble({
  content,
  isOwn,
  timestamp,
}: {
  content: string;
  isOwn: boolean;
  timestamp: string;
}) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-white text-black'
            : 'bg-zinc-800 text-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isOwn ? 'text-zinc-500' : 'text-zinc-500'
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
});
