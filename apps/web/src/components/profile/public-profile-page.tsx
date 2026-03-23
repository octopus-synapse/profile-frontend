/**
 * Public Profile Page Component
 * Displays a user's public profile with their resume
 */

'use client';

import { useT } from '@profile/i18n';
import { LoadingState } from '@/shared/components/ui';
import { usePublicProfile } from './hooks';
import { PublicProfileHeader } from './public-profile-header';
import { PublicProfileNotFound } from './public-profile-not-found';
import { PublicProfileResume } from './public-profile-resume';

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const t = useT();
  const { data: profile, isLoading, error } = usePublicProfile(username);

  if (isLoading) {
    return (
      <div className="bg-pf-canvas-default min-h-screen">
        <LoadingState message={t('social.profile.loading')} minHeight="100vh" />
      </div>
    );
  }

  if (error || !profile) {
    return <PublicProfileNotFound username={username} />;
  }

  // Merge user and resume data for display
  // ResumeDto.personalInfo contains user details (fullName, email, etc.)
  const personalInfo = profile.resume?.personalInfo as Record<string, unknown> | undefined;

  const displayData = {
    name: profile.user.displayName || String(personalInfo?.fullName ?? '') || username,
    jobTitle: personalInfo?.jobTitle ? String(personalInfo.jobTitle) : null,
    photoURL: profile.user.photoURL || null,
    bio: profile.user.bio || (personalInfo?.summary ? String(personalInfo.summary) : null),
    location:
      profile.user.location || (personalInfo?.location ? String(personalInfo.location) : null),
    website: profile.user.website || (personalInfo?.website ? String(personalInfo.website) : null),
    linkedin:
      profile.user.linkedin || (personalInfo?.linkedin ? String(personalInfo.linkedin) : null),
    github: profile.user.github || (personalInfo?.github ? String(personalInfo.github) : null),
    email: personalInfo?.email ? String(personalInfo.email) : null,
    phone: personalInfo?.phone ? String(personalInfo.phone) : null,
  };

  return (
    <div className="bg-pf-canvas-default min-h-screen">
      <PublicProfileHeader data={displayData} username={username} />
      {profile.resume && <PublicProfileResume resume={profile.resume} />}
    </div>
  );
}
