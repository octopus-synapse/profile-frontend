/**
 * Public Profile Page Component
 * Displays a user's public profile with their resume
 * Uses SDK-generated hooks directly - no manual types or services
 */

'use client';

import { LoadingState } from '@octopus-synapse/profile-ui';
import {
  type ResumeDetailsDataDtoResume,
  useUsersGetPublicProfileByUsername,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { PublicProfileHeader } from './public-profile-header';
import { PublicProfileNotFound } from './public-profile-not-found';
import { PublicProfileResume } from './public-profile-resume';

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const t = useT();
  const { data: response, isLoading, error } = useUsersGetPublicProfileByUsername(username);

  if (isLoading) {
    return (
      <div className="bg-pf-canvas-default min-h-screen">
        <LoadingState message={t('social.profile.loading')} minHeight="100vh" />
      </div>
    );
  }

  const profile = response?.data?.data;

  if (error || !profile) {
    return <PublicProfileNotFound username={username} />;
  }

  // Extract user and resume from SDK response
  const user = profile.user as Record<string, unknown>;
  const resume = profile.resume as ResumeDetailsDataDtoResume | null;
  const personalInfo = resume?.personalInfo as Record<string, unknown> | undefined;

  const displayData = {
    name: String(user.displayName ?? '') || String(personalInfo?.fullName ?? '') || username,
    jobTitle: personalInfo?.jobTitle ? String(personalInfo.jobTitle) : null,
    photoURL: user.photoURL ? String(user.photoURL) : null,
    bio: String(user.bio ?? '') || (personalInfo?.summary ? String(personalInfo.summary) : null),
    location:
      String(user.location ?? '') ||
      (personalInfo?.location ? String(personalInfo.location) : null),
    website:
      String(user.website ?? '') || (personalInfo?.website ? String(personalInfo.website) : null),
    linkedin:
      String(user.linkedin ?? '') ||
      (personalInfo?.linkedin ? String(personalInfo.linkedin) : null),
    github:
      String(user.github ?? '') || (personalInfo?.github ? String(personalInfo.github) : null),
    email: personalInfo?.email ? String(personalInfo.email) : null,
    phone: personalInfo?.phone ? String(personalInfo.phone) : null,
  };

  // Extract userId from user object
  const profileUserId = user.id ? String(user.id) : undefined;

  return (
    <div className="bg-pf-canvas-default min-h-screen">
      <PublicProfileHeader data={displayData} username={username} profileUserId={profileUserId} />
      {resume && <PublicProfileResume resume={resume} />}
    </div>
  );
}
