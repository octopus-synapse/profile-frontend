/**
 * Resume Page (Placeholder)
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Manage your resume",
};

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Resume</h1>
        <p className="mt-1 text-zinc-400">Build and customize your professional resume</p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <p className="text-zinc-500">Resume builder coming soon...</p>
      </div>
    </div>
  );
}
