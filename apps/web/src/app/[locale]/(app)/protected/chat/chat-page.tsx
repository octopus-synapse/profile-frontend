'use client';

import { selectEnvelopeData, useAuthSession } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { useState } from 'react';
import { ConnectionBanner } from '@/components/chat/connection-banner';
import { ConversationList } from '@/components/chat/conversation-list';
import { useOnlineStatus } from '@/components/chat/hooks/use-online-status';
import { useSocketEvents } from '@/components/chat/hooks/use-socket-events';
import { MessageThread } from '@/components/chat/message-thread';

export function ChatPage() {
  const { data: session } = useAuthSession({ query: { select: selectEnvelopeData } });
  const t = useT();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const { handleUserStatus, isOnline } = useOnlineStatus();
  useSocketEvents(handleUserStatus);

  const currentUserId = session?.user?.id ?? '';

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <ConnectionBanner />
      <div className="flex flex-1 gap-0 overflow-hidden">
        <aside className="w-80 shrink-0 border-r border-neutral-200 dark:border-neutral-800">
          <ConversationList
            selectedId={selectedConversationId}
            currentUserId={currentUserId}
            onSelect={setSelectedConversationId}
            isUserOnline={isOnline}
          />
        </aside>

        <main className="flex flex-1 items-center justify-center">
          {selectedConversationId ? (
            <MessageThread conversationId={selectedConversationId} currentUserId={currentUserId} />
          ) : (
            <p className="text-neutral-500">{t('social.chat.selectConversation')}</p>
          )}
        </main>
      </div>
    </div>
  );
}
