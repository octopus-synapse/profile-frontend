import React from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';

// ── Mutable mock state ──────────────────────────────────

const mockFollowMutate = mock();
const mockUnfollowMutate = mock();

let mockIsFollowingReturn = {
  data: { isFollowing: false } as { isFollowing: boolean } | undefined,
  isLoading: false,
};
let mockFollowReturn = { mutate: mockFollowMutate, isPending: false };
let mockUnfollowReturn = { mutate: mockUnfollowMutate, isPending: false };

void mock.module('../hooks/use-social', () => ({
  useIsFollowing: () => mockIsFollowingReturn,
  useFollowUser: () => mockFollowReturn,
  useUnfollowUser: () => mockUnfollowReturn,
}));

import { FollowButton } from '../follow-button';

// ── Tests ───────────────────────────────────────────────

describe('FollowButton', () => {
  beforeEach(() => {
    mockFollowMutate.mockClear();
    mockUnfollowMutate.mockClear();
    mockIsFollowingReturn = { data: { isFollowing: false }, isLoading: false };
    mockFollowReturn = { mutate: mockFollowMutate, isPending: false };
    mockUnfollowReturn = { mutate: mockUnfollowMutate, isPending: false };
  });

  it('shows "Follow" text when not following', () => {
    render(<FollowButton targetUserId="user-42" />);

    expect(screen.getByText('Follow')).not.toBeNull();
  });

  it('shows "Following" text when following', () => {
    mockIsFollowingReturn = { data: { isFollowing: true }, isLoading: false };

    render(<FollowButton targetUserId="user-42" />);

    expect(screen.getByText('Following')).not.toBeNull();
  });

  it('calls follow mutation when clicking while not following', () => {
    render(<FollowButton targetUserId="user-42" />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockFollowMutate).toHaveBeenCalledWith('user-42');
  });

  it('calls unfollow mutation when clicking while following', () => {
    mockIsFollowingReturn = { data: { isFollowing: true }, isLoading: false };

    render(<FollowButton targetUserId="user-42" />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockUnfollowMutate).toHaveBeenCalledWith('user-42');
  });

  it('shows loading spinner while checking follow status', () => {
    mockIsFollowingReturn = { data: undefined, isLoading: true };

    render(<FollowButton targetUserId="user-42" />);

    expect(screen.getByTestId('icon-loader')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows "Loading…" text during follow mutation', () => {
    mockFollowReturn = { mutate: mockFollowMutate, isPending: true };

    render(<FollowButton targetUserId="user-42" />);

    expect(screen.getByText('Loading…')).not.toBeNull();
  });

  it('disables button during unfollow mutation', () => {
    mockIsFollowingReturn = { data: { isFollowing: true }, isLoading: false };
    mockUnfollowReturn = { mutate: mockUnfollowMutate, isPending: true };

    render(<FollowButton targetUserId="user-42" />);

    expect(
      (screen.getByRole('button') as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});
