'use client';

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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/30"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Enviar Mensagem</span>
      </button>

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
