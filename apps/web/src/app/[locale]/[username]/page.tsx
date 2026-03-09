/**
 * Public Profile Page
 * Dynamic route for displaying public user profiles
 * URL: /[locale]/[username]
 */

import { PublicProfilePage } from "@/components/profile";

interface PageProps {
  params: Promise<{
    locale: string;
    username: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;

  return <PublicProfilePage username={username} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;

  return {
    title: `@${username} | PATCH`,
    description: `View ${username}'s professional profile on PATCH`,
  };
}
