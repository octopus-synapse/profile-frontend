/** Validation constants and utility functions for the Professional Profile step */

export const SUMMARY_MIN = 50;
export const SUMMARY_MAX = 2000;

/** Extract GitHub username from a full URL or return as-is if already a username */
export function extractGitHubUsername(url: string | undefined): string {
  if (!url) return '';
  if (!url.includes('github.com')) return url.trim();
  const match = url.match(/github\.com\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)/);
  return match?.[1] ?? url.replace(/^https?:\/\/(www\.)?github\.com\//, '').trim();
}

/** Normalize empty strings to undefined for optional URL fields */
export function normalizeUrl(url: string | undefined): string | undefined {
  if (!url || url.trim() === '') return undefined;
  return url;
}
