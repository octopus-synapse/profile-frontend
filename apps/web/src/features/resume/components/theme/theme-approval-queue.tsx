/**
 * Theme Approval Queue Component
 * For approvers to see and review pending themes
 */

"use client";

import { useState } from "react";
import { usePendingThemes } from "../../hooks";
import type { Theme } from "../../services/theme.types";
import { ThemeCard } from "./theme-card";
import { ThemeReviewModal } from "./theme-review-modal";

export function ThemeApprovalQueue() {
  const [reviewingTheme, setReviewingTheme] = useState<Theme | null>(null);
  const { data: themes, isLoading, error } = usePendingThemes();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;
  if (!themes?.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      <Header count={themes.length} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            showActions={false}
            onSelect={() => setReviewingTheme(theme)}
          />
        ))}
      </div>

      {reviewingTheme && (
        <ThemeReviewModal
          theme={reviewingTheme}
          isOpen={!!reviewingTheme}
          onClose={() => setReviewingTheme(null)}
        />
      )}
    </div>
  );
}

function Header({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">Pending Theme Reviews</h2>
        <p className="text-muted-foreground text-sm">
          {count} theme{count !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-14 w-64 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">✅</div>
      <h3 className="mb-2 text-lg font-medium">All Caught Up!</h3>
      <p className="text-muted-foreground max-w-sm">
        No themes are pending approval. Check back later when users submit new themes for review.
      </p>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h3 className="text-pf-danger-fg mb-2 text-lg font-medium">Failed to Load</h3>
      <p className="text-muted-foreground max-w-sm">
        {error.message || "Could not load pending themes. Please try again."}
      </p>
    </div>
  );
}
