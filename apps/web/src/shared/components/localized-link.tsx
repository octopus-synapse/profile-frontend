'use client';

/**
 * LocalizedLink Component
 * Automatically adds the current locale prefix to internal links
 */

import Link, { type LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import type { AnchorHTMLAttributes } from 'react';
import { hasLocalePrefix, i18nConfig, type Locale } from '@profile/i18n';

interface LocalizedLinkProps
  extends Omit<LinkProps, 'href'>,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  href: string;
  children: React.ReactNode;
  locale?: Locale;
}

/**
 * Check if a URL is external
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
}

/**
 * Check if URL is a hash-only link (anchor)
 */
function isHashLink(url: string): boolean {
  return url.startsWith('#');
}

export function LocalizedLink({
  href,
  children,
  locale: forceLocale,
  ...props
}: LocalizedLinkProps) {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || i18nConfig.defaultLocale;
  const targetLocale = forceLocale || currentLocale;

  // Don't modify external URLs, hash links, or URLs that already have locale prefix
  if (isExternalUrl(href) || isHashLink(href) || hasLocalePrefix(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  // Add locale prefix to internal URLs
  const localizedHref = href.startsWith('/')
    ? `/${targetLocale}${href}`
    : `/${targetLocale}/${href}`;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}

/**
 * Hook to get localized path
 */
export function useLocalizedPath() {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || i18nConfig.defaultLocale;

  return (path: string, locale?: Locale): string => {
    const targetLocale = locale || currentLocale;

    if (isExternalUrl(path) || isHashLink(path) || hasLocalePrefix(path)) {
      return path;
    }

    return path.startsWith('/') ? `/${targetLocale}${path}` : `/${targetLocale}/${path}`;
  };
}
