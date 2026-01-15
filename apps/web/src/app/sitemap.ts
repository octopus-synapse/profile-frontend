/**
 * Dynamic Sitemap Generation
 * Generates sitemap.xml for search engine crawlers
 */

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://profile.octopus-synapse.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // TODO: Fetch public profiles from API for dynamic routes
  // const publicProfiles = await fetchPublicProfiles();
  // const profileRoutes = publicProfiles.map((profile) => ({
  //   url: `${BASE_URL}/${profile.username}`,
  //   lastModified: profile.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));

  return [...staticRoutes];
}
