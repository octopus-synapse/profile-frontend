'use client';

import { selectEnvelopeData, useAuthSession } from '@profile/api-client';
import { ActivityFeed } from '@/components/social/activity-feed';
import { ProfileCard } from '@/components/social/profile-card';

export function FeedPage() {
  const { data: session } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-5xl gap-8 py-6">
      <main className="flex-1">
        <ActivityFeed />
      </main>

      <aside className="hidden w-72 shrink-0 lg:block">
        <ProfileCard
          userId={user.id}
          name={user.name}
          username={user.username}
          photoURL={null}
          bio={null}
          isSelf
        />
      </aside>
    </div>
  );
}
