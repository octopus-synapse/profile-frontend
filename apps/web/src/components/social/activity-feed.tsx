'use client';

/**
 * Activity Feed Component
 * Uses SDK hooks and types directly.
 */

import { useActivityGetFeed, useAuthSession } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { Activity as ActivityIcon, Clock } from 'lucide-react';

// Activity item type based on API response structure
interface Activity {
  id: string;
  actorPhotoURL?: string | null;
  actorName: string;
  description: string;
  createdAt: string;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex animate-pulse gap-3 px-1">
          <div className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/10" />
            <div className="h-2.5 w-1/4 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyFeed() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ActivityIcon className="mb-3 h-10 w-10 text-zinc-600" strokeWidth={1} />
      <p className="text-sm font-medium text-zinc-300">{t('social.feed.noActivity')}</p>
      <p className="mt-1 text-xs text-zinc-500">{t('social.feed.followPrompt')}</p>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-white/[0.03]">
      {/* Actor avatar */}
      {activity.actorPhotoURL ? (
        <img
          src={activity.actorPhotoURL}
          alt={activity.actorName}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
          {activity.actorName.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-zinc-300">
          <span className="font-medium text-white">{activity.actorName}</span>{' '}
          {activity.description}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const t = useT();
  const { data: sessionResponse } = useAuthSession();
  const userId = sessionResponse?.status === 200 ? sessionResponse.data.data.user?.id : undefined;

  const { data: feedResponse, isLoading } = useActivityGetFeed(userId ?? '', {
    query: { enabled: !!userId },
  });

  const activities: Activity[] =
    feedResponse?.status === 200 ? ((feedResponse.data.data.feed.data as Activity[]) ?? []) : [];

  return (
    <div className="space-y-1">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
        <ActivityIcon className="h-4 w-4" strokeWidth={1.5} />
        {t('social.feed.title')}
      </h2>

      {isLoading && <FeedSkeleton />}
      {!isLoading && activities.length === 0 && <EmptyFeed />}
      {!isLoading &&
        activities.length > 0 &&
        activities.map((a) => <ActivityItem key={a.id} activity={a} />)}
    </div>
  );
}
