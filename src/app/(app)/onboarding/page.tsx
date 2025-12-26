/**
 * Onboarding Page (Placeholder)
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Complete your profile setup",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Welcome to Profile! 👋</h1>
          <p className="mt-2 text-zinc-400">Let&apos;s set up your professional profile</p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
          <p className="text-zinc-500">Onboarding wizard coming soon...</p>
        </div>
      </div>
    </div>
  );
}
