/**
 * Profile Service
 * Handles fetching public profile data
 */

import { httpClient } from "@/shared/lib/http-client";
import type { PublicProfile } from "../types";

/**
 * Fetch a public profile by username
 */
export async function getPublicProfile(username: string): Promise<PublicProfile> {
  // The backend returns { user, resume } directly
  const data = await httpClient.get<PublicProfile>(`/users/${username}/profile`);
  return data;
}
