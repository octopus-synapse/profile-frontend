'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { MessageSquare } from 'lucide-react';
import { memo, useState } from 'react';
import { ChatDrawer } from './chat-drawer';

interface SendMessageButtonProps {
  recipientId: string;
  recipientName: string;
  recipientPhotoUrl?: string | null;
}

export const SendMessageButton = memo(function SendMessageButton({
  recipientId,
  recipientName,
  recipientPhotoUrl,
}: SendMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Button
        type="button"
        variant="outline"
        tone="neutral"
        size="sm"
        leftIcon={<MessageSquare className="h-4 w-4" />}
        onPress={() => setIsOpen(true)}
      >
        {t('chat.sendMessage')}
      </Button>

      <ChatDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        recipientId={recipientId}
        recipientName={recipientName}
        recipientPhotoUrl={recipientPhotoUrl}
      />
    </>
  );
});
