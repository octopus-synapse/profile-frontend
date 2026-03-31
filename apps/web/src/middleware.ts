/**
 * Next.js Middleware
 *
 * Single responsibility: i18n locale routing + auth gate for /protected
 * All role/permission checks delegated to page components using SDK fields.
 */

import { authSession } from '@profile/api-client/client';
import {
  getLocaleFromHeaders,
  getLocaleFromPathname,
  i18nConfig,
  type Locale,
} from '@profile/i18n/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isProtectedRoute, ROUTES } from '@/config/routes';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (cookieLocale && i18nConfig.locales.includes(cookieLocale)) return cookieLocale;
  return getLocaleFromHeaders(request.headers.get('Accept-Language'));
}

function stripLocale(pathname: string): string {
  for (const locale of i18nConfig.locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
    if (pathname === `/${locale}`) return '/';
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  // === i18n: Redirect to localized URL if missing locale ===
  if (!locale) {
    const preferredLocale = getPreferredLocale(request);
    const url = new URL(`/${preferredLocale}${pathname}`, request.url);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      maxAge: 31536000,
      path: '/',
    });
    return response;
  }

  // Pass through with locale cookie sync
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'x-pathname': pathname,
      }),
    },
  });
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { maxAge: 31536000, path: '/' });
  }

  // === Auth gate: Block /protected/* if not authenticated ===
  const path = stripLocale(pathname);
  if (isProtectedRoute(path)) {
    const cookieHeader = request.headers.get('cookie');
    const session = await authSession(cookieHeader);

    if (!session.data.authenticated) {
      const signInUrl = new URL(`/${locale}${ROUTES.AUTH.SIGN_IN}`, request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
