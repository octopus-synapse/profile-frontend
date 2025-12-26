/**
 * Next.js Middleware
 * Protects routes based on authentication and role
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/features/auth/services/auth-config";
import { ROUTES } from "@/config/routes";

// Routes that require authentication
const protectedRoutes = ["/protected", "/onboarding"];

// Routes only for unauthenticated users
const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;
  const hasCompletedOnboarding = session?.user?.hasCompletedOnboarding;

  // Check if user is accessing auth routes while authenticated
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    // Redirect to onboarding if not completed, otherwise to protected area
    const redirectTo = hasCompletedOnboarding ? ROUTES.PROTECTED.PROFILE : ROUTES.ONBOARDING;
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Check if user is accessing protected routes without authentication
  if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL(ROUTES.AUTH.SIGN_IN, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check if user is accessing admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const signInUrl = new URL(ROUTES.AUTH.SIGN_IN, request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (userRole !== "ADMIN") {
      // Redirect non-admin users to home with error
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
  }

  // Check if authenticated user needs to complete onboarding
  if (
    isAuthenticated &&
    !hasCompletedOnboarding &&
    pathname.startsWith("/protected") &&
    !pathname.startsWith("/onboarding")
  ) {
    return NextResponse.redirect(new URL(ROUTES.ONBOARDING, request.url));
  }

  return NextResponse.next();
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
