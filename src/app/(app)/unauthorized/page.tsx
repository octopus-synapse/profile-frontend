/**
 * Unauthorized Page
 * Shown when user doesn't have permission to access a resource
 */

import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Unauthorized | Profile",
  description: "You don't have permission to access this resource",
};

export default function UnauthorizedPage() {
  return (
    <div className="bg-canvas-default flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card variant="muted">
          <CardHeader>
            <div className="space-y-2 text-center">
              <div className="text-6xl">🔒</div>
              <h1 className="text-fg-default text-2xl font-bold">Access Denied</h1>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-fg-muted text-center">
              You don't have permission to access this page. Please contact an administrator if you
              believe this is an error.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href={ROUTES.HOME}>Go to Home</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={ROUTES.AUTH.SIGN_IN}>Sign in with different account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
