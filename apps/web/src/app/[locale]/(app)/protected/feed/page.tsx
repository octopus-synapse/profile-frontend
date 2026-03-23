/**
 * Feed Page
 * Social hub: activity feed + profile card sidebar
 */

import type { Metadata } from 'next';
import { FeedPage } from './feed-page';

export const metadata: Metadata = {
  title: 'Feed | PATCH',
  description: 'See what your connections are up to',
};

export default function FeedRoute() {
  return <FeedPage />;
}
