/**
 * Next.js Middleware
 * Handles i18n routing and protects routes based on authentication and role
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/features/auth/services/auth-config";
import { ROUTES } from "@/config/routes";
import {
  i18nConfig,
  getLocaleFromHeaders,
  getLocaleFromPathname,
  type Locale,
} from "@/config/i18n.config";

// Cookie name for storing user's preferred locale
const LOCALE_COOKIE = "NEXT_LOCALE";

// Routes that require authentication (without locale prefix)
const protectedRoutes = ["/protected", "/onboarding"];

// Routes only for unauthenticated users (without locale prefix)
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

/**
 * Get the preferred locale from request
 * Priority: 1. URL path, 2. Cookie, 3. Accept-Language header, 4. Default
 */
function getPreferredLocale(request: NextRequest): Locale {
  // 1. Check cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (cookieLocale && i18nConfig.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language");
  return getLocaleFromHeaders(acceptLanguage);
}

/**
 * Remove locale prefix from pathname for route matching
 */
function getPathnameWithoutLocale(pathname: string): string {
  for (const locale of i18nConfig.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ========================================
  // i18n Routing
  // ========================================

  // Check if path already has a locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (!pathnameLocale) {
    // No locale in URL - redirect to localized URL
    const preferredLocale = getPreferredLocale(request);
    const newUrl = new URL(`/${preferredLocale}${pathname}`, request.url);

    // Preserve query params
    newUrl.search = request.nextUrl.search;

    const response = NextResponse.redirect(newUrl);

    // Set cookie to remember preference
    response.cookies.set(LOCALE_COOKIE, preferredLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  }

  // Update cookie if user manually changed locale and pass pathname header
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        "x-pathname": pathname,
      }),
    },
  });
  const currentCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (currentCookie !== pathnameLocale) {
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  // ========================================
  // Authentication & Authorization
  // ========================================

  // Get pathname without locale for route matching
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  // Get session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;
  const hasCompletedOnboarding = session?.user?.hasCompletedOnboarding;

  // Helper to create localized URL
  const createLocalizedUrl = (path: string) => {
    return new URL(`/${pathnameLocale}${path}`, request.url);
  };

  // Check if user is accessing auth routes while authenticated
  if (isAuthenticated && authRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
    // Redirect to onboarding if not completed, otherwise to protected area
    const redirectTo = hasCompletedOnboarding ? ROUTES.PROTECTED.PROFILE : ROUTES.ONBOARDING;
    return NextResponse.redirect(createLocalizedUrl(redirectTo));
  }

  // Check if user is accessing protected routes without authentication
  if (
    !isAuthenticated &&
    protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route))
  ) {
    const signInUrl = createLocalizedUrl(ROUTES.AUTH.SIGN_IN);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check if user is accessing admin routes
  if (pathnameWithoutLocale.startsWith("/admin")) {
    if (!isAuthenticated) {
      const signInUrl = createLocalizedUrl(ROUTES.AUTH.SIGN_IN);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (userRole !== "ADMIN") {
      // Redirect non-admin users to home with error
      return NextResponse.redirect(createLocalizedUrl(ROUTES.HOME));
    }
  }

  // Check if authenticated user needs to complete onboarding
  if (
    isAuthenticated &&
    !hasCompletedOnboarding &&
    pathnameWithoutLocale.startsWith("/protected") &&
    !pathnameWithoutLocale.startsWith("/onboarding")
  ) {
    // Security bypass: Allow ?bypass=true for support/recovery scenarios
    const bypassParam = request.nextUrl.searchParams.get("bypass");
    if (bypassParam === "true") {
      // Log bypass usage for security monitoring
      console.warn("[Middleware] Onboarding bypass used", {
        userId: session?.user?.id,
        path: pathnameWithoutLocale,
        timestamp: new Date().toISOString(),
      });
      return response;
    }

    return NextResponse.redirect(createLocalizedUrl(ROUTES.ONBOARDING));
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
