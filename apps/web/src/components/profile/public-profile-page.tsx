/**
 * Public Profile Page Component
 * Displays a user's public profile with their resume
 */

"use client";

import { usePublicProfile } from "./hooks";
import { PublicProfileHeader } from "./public-profile-header";
import { PublicProfileResume } from "./public-profile-resume";
import { PublicProfileNotFound } from "./public-profile-not-found";
import { LoadingState } from "@/shared/components/ui";

interface PublicProfilePageProps {
  username: string;
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const { data: profile, isLoading, error } = usePublicProfile(username);

  if (isLoading) {
    return (
      <div className="bg-pf-canvas-default min-h-screen">
        <LoadingState message="Loading profile..." minHeight="100vh" />
      </div>
    );
  }

  if (error || !profile) {
    return <PublicProfileNotFound username={username} />;
  }

  // Merge user and resume data for display
  const displayData = {
    name: profile.user.displayName || profile.resume?.fullName || username,
    jobTitle: profile.resume?.jobTitle || null,
    photoURL: profile.user.photoURL || null,
    bio: profile.user.bio || profile.resume?.summary || null,
    location: profile.user.location || profile.resume?.location || null,
    website: profile.user.website || profile.resume?.website || null,
    linkedin: profile.user.linkedin || profile.resume?.linkedin || null,
    github: profile.user.github || profile.resume?.github || null,
    email: profile.resume?.emailContact || null,
    phone: profile.resume?.phone || null,
  };

  return (
    <div className="bg-pf-canvas-default min-h-screen">
      <PublicProfileHeader data={displayData} username={username} />
      {profile.resume && <PublicProfileResume resume={profile.resume} />}
    </div>
  );
}
