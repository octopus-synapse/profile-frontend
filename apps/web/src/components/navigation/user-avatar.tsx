'use client';

import { selectEnvelopeData, useAuthSession } from '@profile/api-client';
import { Avatar } from '@/shared/components/ui';

export function UserAvatar() {
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = data?.user;

  if (!user) return null;

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center">
      <Avatar
        src={undefined}
        alt={displayName}
        fallback={initials}
        size="sm"
        className="h-8 w-8 ring-2 ring-white/10"
      />
    </div>
  );
}
