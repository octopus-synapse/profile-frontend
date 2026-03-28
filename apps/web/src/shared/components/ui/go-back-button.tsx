'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center justify-center gap-2 border border-pf-border-default bg-transparent px-6 py-3 font-mono text-sm text-pf-fg-default transition-colors hover:bg-pf-hover-subtle"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
      Go Back
    </button>
  );
}
