/**
 * Chat Page
 * Split-panel layout: conversation list + message thread
 */

import type { Metadata } from 'next';
import { ChatPage } from './chat-page';

export const metadata: Metadata = {
  title: 'Chat | PATCH',
  description: 'Real-time messaging with your connections',
};

export default function ChatRoute() {
  return <ChatPage />;
}
