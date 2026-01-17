/**
 * Loading State for Protected Routes
 */

export default function ProtectedLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-pf-border border-t-pf-fg h-10 w-10 animate-spin rounded-full border-2" />
        <p className="text-pf-fg-muted text-sm">Loading your content...</p>
      </div>
    </div>
  );
}
