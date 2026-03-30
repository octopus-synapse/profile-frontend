'use client';

/**
 * Follow Button Component
 * Uses SDK hooks and types directly.
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useFollowFollow, useFollowIsFollowing, useFollowUnfollow } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const t = useT();
  const { data: response, isLoading: isChecking } = useFollowIsFollowing(targetUserId);
  const follow = useFollowFollow();
  const unfollow = useFollowUnfollow();
  const [hovered, setHovered] = useState(false);

  const isFollowing = response?.status === 200 ? response.data.data.isFollowing : false;
  const isBusy = follow.isPending || unfollow.isPending;

  const handleClick = () => {
    if (isBusy) return;
    if (isFollowing) {
      unfollow.mutate({ userId: targetUserId });
    } else {
      follow.mutate({ userId: targetUserId });
    }
  };

  // While checking follow status, show a neutral placeholder
  if (isChecking) {
    return (
      <span className={cn('inline-flex', className)}>
        <Button type="button" variant="outline" tone="neutral" size="sm" loading disabled>
          {t('action.loading')}
        </Button>
      </span>
    );
  }

  const showUnfollow = isFollowing && hovered;

  // Determine variant and tone based on follow state
  const variant = isFollowing ? (showUnfollow ? 'soft' : 'outline') : 'solid';
  const tone = isFollowing ? (showUnfollow ? 'danger' : 'neutral') : 'primary';
  const icon = showUnfollow ? (
    <UserMinus className="h-3.5 w-3.5" strokeWidth={1.5} />
  ) : !isFollowing ? (
    <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
  ) : undefined;

  const label = isBusy
    ? t('action.loading')
    : showUnfollow
      ? t('social.follow.unfollow')
      : isFollowing
        ? t('social.follow.following')
        : t('social.follow.follow');

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Hover is purely visual feedback, Button handles actual interaction
    <div
      className={cn('inline-flex', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button
        type="button"
        variant={variant}
        tone={tone}
        size="sm"
        loading={isBusy}
        leftIcon={!isBusy ? icon : undefined}
        onPress={handleClick}
      >
        {label}
      </Button>
    </div>
  );
}
