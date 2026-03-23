/**
 * Profile Service
 * Handles fetching public profile data
 */

import { apiFetch } from '@profile/api-client';
import type { PublicProfile } from '../types';

/**
 * Fetch a public profile by username
 */
export async function getPublicProfile(username: string): Promise<PublicProfile> {
  return apiFetch.get<PublicProfile>(`/api/v1/users/${username}/profile`);
}
