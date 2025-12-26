/**
 * Format utilities
 */

/**
 * Format a date to a localized string
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
 const d = typeof date === "string" ? new Date(date) : date;
 return d.toLocaleDateString(locale, {
  year: "numeric",
  month: "long",
  day: "numeric",
 });
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
 date: Date | string,
 locale = "en-US"
): string {
 const d = typeof date === "string" ? new Date(date) : date;
 const now = new Date();
 const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

 const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

 if (diffInSeconds < 60) {
  return rtf.format(-diffInSeconds, "second");
 }
 if (diffInSeconds < 3600) {
  return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
 }
 if (diffInSeconds < 86400) {
  return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
 }
 if (diffInSeconds < 2592000) {
  return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
 }
 if (diffInSeconds < 31536000) {
  return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
 }
 return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(num: number, locale = "en-US"): string {
 return new Intl.NumberFormat(locale).format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
 if (text.length <= maxLength) return text;
 return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
 return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert string to slug
 */
export function slugify(text: string): string {
 return text
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, "")
  .replace(/[\s_-]+/g, "-")
  .replace(/^-+|-+$/g, "");
}
