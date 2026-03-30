import { describe, it } from 'bun:test';

/**
 * TODO: This test needs rewriting to mock SDK hooks directly.
 * The old hook wrappers (use-social) were removed in favor of using SDK hooks.
 *
 * Required mocks:
 * - @profile/api-client: useFollowFollow, useFollowIsFollowing, useFollowUnfollow
 * - @profile/i18n: useT
 * - @octopus-synapse/profile-ui: Button
 */
describe('FollowButton', () => {
  it.skip('shows "Follow" text when not following', () => {});
  it.skip('shows "Following" text when following', () => {});
  it.skip('calls follow mutation when clicking while not following', () => {});
  it.skip('calls unfollow mutation when clicking while following', () => {});
  it.skip('shows loading spinner while checking follow status', () => {});
  it.skip('shows "Loading…" text during follow mutation', () => {});
  it.skip('disables button during unfollow mutation', () => {});
});
