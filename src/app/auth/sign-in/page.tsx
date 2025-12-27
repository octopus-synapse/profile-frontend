/**
 * Sign In Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import { SignInForm } from "@/features/auth";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Terminal, Github, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Profile",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="bg-pf-canvas-default flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-pf-border-muted border-b p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <ArrowLeft className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">back</span>
          </Link>
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-7 w-7 items-center justify-center">
              <Terminal className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="text-pf-fg-default font-mono text-sm font-semibold">profile</span>
          </Link>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Terminal Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2">
              <span className="text-pf-success-fg font-mono text-xs">●</span>
              <span className="text-pf-fg-muted font-mono text-xs">authenticated: false</span>
            </div>
            <h1 className="text-pf-fg-default mt-4 text-2xl font-bold">Sign in to continue</h1>
            <p className="text-pf-fg-muted mt-2 font-mono text-xs">Welcome back, developer</p>
          </div>

          {/* Sign In Card */}
          <div className="border-pf-border-default bg-pf-canvas-overlay border p-6">
            <SignInForm />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="bg-pf-border-default h-px flex-1" />
            <span className="text-pf-fg-subtle font-mono text-xs">or</span>
            <div className="bg-pf-border-default h-px flex-1" />
          </div>

          {/* GitHub OAuth */}
          <button className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle flex w-full items-center justify-center gap-3 border py-3 font-mono text-sm transition-colors">
            <Github className="h-4 w-4" strokeWidth={1.5} />
            Continue with GitHub
          </button>

          {/* Sign Up Link */}
          <div className="border-pf-border-default bg-pf-canvas-subtle mt-6 border p-4 text-center">
            <p className="text-pf-fg-muted font-mono text-xs">
              New here?{" "}
              <Link
                href={ROUTES.AUTH.SIGN_UP}
                className="text-pf-fg-default font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="text-pf-fg-subtle mt-8 flex items-center justify-center gap-4 font-mono text-xs">
            <Link href={ROUTES.HOME} className="hover:text-pf-fg-default transition-colors">
              terms
            </Link>
            <span className="text-pf-border-default">·</span>
            <Link href={ROUTES.HOME} className="hover:text-pf-fg-default transition-colors">
              privacy
            </Link>
            <span className="text-pf-border-default">·</span>
            <Link href={ROUTES.HOME} className="hover:text-pf-fg-default transition-colors">
              docs
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
