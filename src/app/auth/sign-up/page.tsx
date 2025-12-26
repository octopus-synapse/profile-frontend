/**
 * Sign Up Page
 * Public authentication page for user registration
 */

import { Metadata } from "next";
import { SignUpForm } from "@/features/auth";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Sign Up | Profile",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="bg-canvas-default flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href={ROUTES.HOME} className="inline-block">
            <h1 className="text-fg-default text-3xl font-bold">Profile</h1>
          </Link>
        </div>

        {/* Sign Up Card */}
        <Card variant="muted">
          <CardHeader>
            <h2 className="text-fg-default text-center text-xl font-semibold">
              Create your account
            </h2>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <Card variant="outline" className="text-center">
          <CardContent className="py-4">
            <p className="text-fg-muted text-sm">
              Already have an account?{" "}
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className="text-accent-fg font-medium hover:underline"
              >
                Sign in
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
