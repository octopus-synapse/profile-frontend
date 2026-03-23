'use client';

import { useAuthSession } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { useState } from 'react';
import { ConversationList } from '@/components/chat/conversation-list';
import { MessageThread } from '@/components/chat/message-thread';

export function ChatPage() {
  const { data: session } = useAuthSession();
  const t = useT();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const currentUserId = session?.data?.user?.id ?? '';

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
      <aside className="w-80 shrink-0 border-r border-neutral-200 dark:border-neutral-800">
        <ConversationList
          selectedId={selectedConversationId}
          currentUserId={currentUserId}
          onSelect={setSelectedConversationId}
        />
      </aside>

      <main className="flex flex-1 items-center justify-center">
        {selectedConversationId ? (
          <MessageThread
            conversationId={selectedConversationId}
            currentUserId={currentUserId}
          />
        ) : (
          <p className="text-neutral-500">
            {t('social.chat.selectConversation')}
          </p>
        )}
      </main>
    </div>
  );
}
