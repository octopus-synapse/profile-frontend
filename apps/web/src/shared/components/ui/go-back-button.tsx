'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center justify-center gap-2 border border-white/10 bg-transparent px-6 py-3 font-mono text-sm text-white transition-colors hover:bg-white/5"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
      Go Back
    </button>
  );
}
