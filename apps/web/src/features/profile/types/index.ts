/**
 * Public Profile Types
 */

import type { Resume } from "@/features/resume/types";

export interface PublicUser {
  displayName: string | null;
  photoURL: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface PublicProfile {
  user: PublicUser;
  resume: Resume | null;
}
