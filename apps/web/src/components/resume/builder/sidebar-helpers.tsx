/**
 * SidebarHelpers — shared sidebar UI components.
 * Dark mode premium styling.
 */

import { cn } from '@/shared/utils';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function SidebarTabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-all',
        active
          ? 'border-pf-accent-fg bg-pf-accent-subtle text-pf-fg-default'
          : 'border-transparent text-pf-fg-subtle hover:bg-pf-hover-subtle hover:text-pf-fg-muted',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-pf-fg-subtle">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

export function SidebarActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg border border-pf-border-muted bg-pf-hover-subtle/50 p-3 text-sm font-medium text-pf-fg-muted transition-all hover:border-pf-border-default hover:bg-pf-hover-subtle hover:text-pf-fg-default"
    >
      <Icon
        className="h-4 w-4 text-pf-fg-subtle transition-colors group-hover:text-pf-accent-fg"
        strokeWidth={1.5}
      />
      {label}
    </button>
  );
}
