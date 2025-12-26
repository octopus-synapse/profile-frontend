/**
 * Settings Page (Placeholder)
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="mt-1 text-zinc-400">Manage your account settings and preferences</p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <p className="text-zinc-500">Settings panel coming soon...</p>
      </div>
    </div>
  );
}
