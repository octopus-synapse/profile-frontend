/**
 * Public Profile Types
 */

import type { ResumeDto } from '@profile/api-client';

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
  resume: ResumeDto | null;
}
