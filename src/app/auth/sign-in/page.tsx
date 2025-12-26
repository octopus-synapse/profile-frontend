/**
 * Sign In Page
 * Public authentication page for user login
 */

import { Metadata } from "next";
import { SignInForm } from "@/features/auth";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Sign In | Profile",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="bg-canvas-default flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href={ROUTES.HOME} className="inline-block">
            <h1 className="text-fg-default text-3xl font-bold">Profile</h1>
          </Link>
        </div>

        {/* Sign In Card */}
        <Card variant="muted">
          <CardHeader>
            <h2 className="text-fg-default text-center text-xl font-semibold">
              Sign in to Profile
            </h2>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <Card variant="outline" className="text-center">
          <CardContent className="py-4">
            <p className="text-fg-muted text-sm">
              New to Profile?{" "}
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="text-accent-fg font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-fg-muted space-x-3 text-center text-xs">
          <Link href={ROUTES.HOME} className="hover:text-accent-fg">
            Terms
          </Link>
          <Link href={ROUTES.HOME} className="hover:text-accent-fg">
            Privacy
          </Link>
          <Link href={ROUTES.HOME} className="hover:text-accent-fg">
            Security
          </Link>
          <Link href={ROUTES.HOME} className="hover:text-accent-fg">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
