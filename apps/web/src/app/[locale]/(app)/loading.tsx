/**
 * Loading State for App Routes
 */

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-pf-border border-t-pf-fg h-8 w-8 animate-spin rounded-full border-2" />
        <p className="text-pf-fg-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
