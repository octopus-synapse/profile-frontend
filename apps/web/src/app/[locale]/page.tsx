'use client';

import { LandingNavbar } from '@/components/landing';
import { PatchLandingStatic } from '@/components/landing/PatchLandingStatic';

export default function PatchLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-zinc-200 antialiased selection:bg-cyan-300/20">
      <LandingNavbar />
      <main className="relative z-10">
        <PatchLandingStatic />
      </main>
    </div>
  );
}
