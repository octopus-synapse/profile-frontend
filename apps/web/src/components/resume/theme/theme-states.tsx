/**
 * ThemeStates — loading, empty, and delete confirmation states.
 */

'use client';

export function ThemeLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-muted h-48 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  onImport: () => void;
  onCreate: () => void;
}

export function ThemeEmptyState({ onImport, onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-4xl">🎨</div>
      <h3 className="mb-2 text-lg font-medium">No Themes Yet</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Create your first theme or import one from JSON
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onImport}
          className="hover:bg-muted rounded border px-4 py-2 text-sm"
        >
          Import JSON
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
        >
          Create Theme
        </button>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  onConfirm: () => void;
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ThemeDeleteConfirm({
  onConfirm,
  isOpen,
  onDelete,
  onCancel,
  isPending,
}: DeleteConfirmProps) {
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onConfirm}
        className="bg-destructive/10 hover:bg-destructive/20 text-destructive absolute top-2 right-2 rounded p-1.5"
        title="Delete theme"
      >
        🗑️
      </button>
    );
  }

  return (
    <div className="bg-background/90 absolute inset-0 flex items-center justify-center rounded-lg">
      <div className="p-4 text-center">
        <p className="mb-3 font-medium">Delete this theme?</p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="hover:bg-muted rounded border px-3 py-1 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground rounded px-3 py-1 text-sm"
          >
            {isPending ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
