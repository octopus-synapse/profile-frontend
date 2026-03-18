/**
 * Web App Manifest
 * Enables PWA installation and configuration
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Profile - Professional Resume Builder',
    short_name: 'Profile',
    description: 'Create stunning professional resumes with our modern resume builder',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'business', 'utilities'],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
  };
}
