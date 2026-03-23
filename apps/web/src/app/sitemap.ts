/**
 * Dynamic Sitemap Generation
 * Fetches public profiles from the backend to include in sitemap.xml
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://profile.octopus-synapse.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SearchResult {
  username: string;
  updatedAt?: string;
}

interface SearchResponse {
  success: boolean;
  data: { results: SearchResult[]; total: number };
}

async function fetchPublicProfiles(): Promise<SearchResult[]> {
  try {
    const res = await fetch(`${API_URL}/api/search?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as SearchResponse;
    return body.data?.results ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const profiles = await fetchPublicProfiles();
  const profileRoutes: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${BASE_URL}/${profile.username}`,
    lastModified: profile.updatedAt ? new Date(profile.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...profileRoutes];
}
