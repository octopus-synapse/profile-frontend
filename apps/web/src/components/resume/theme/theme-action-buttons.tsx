/**
 * ThemeActionButtons — import and create buttons for theme manager.
 */

interface ImportButtonProps {
  onClick: () => void;
}

export function ImportButton({ onClick }: ImportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted flex items-center gap-2 rounded border px-3 py-2 text-sm"
    >
      <span>📥</span> Import JSON
    </button>
  );
}

interface CreateButtonProps {
  onClick: () => void;
}

export function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded px-3 py-2 text-sm"
    >
      <span>➕</span> New Theme
    </button>
  );
}
