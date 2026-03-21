export interface ShareLink {
  id: string;
  slug: string;
  resumeId: string;
  isActive: boolean;
  hasPassword: boolean;
  expiresAt: string | null;
  createdAt: string;
  publicUrl: string;
}

export function buildFullUrl(publicUrl: string): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return `${base}${publicUrl}`;
}
