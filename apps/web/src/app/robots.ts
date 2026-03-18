/**
 * Robots.txt Generation
 * Controls search engine crawler behavior
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://profile.octopus-synapse.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/protected/',
          '/admin/',
          '/onboarding/',
          '/auth/reset-password',
          '/auth/verify-email',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
