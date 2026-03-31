/**
 * SidebarHelpers — shared sidebar UI components.
 * Dark mode premium styling.
 */

import { Button } from '@octopus-synapse/profile-ui';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function SidebarTabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <span className="flex flex-1">
      <Button
        type="button"
        variant={active ? 'soft' : 'ghost'}
        tone={active ? 'info' : 'neutral'}
        size="md"
        fullWidth
        leftIcon={icon}
        pressed={active}
        onPress={onClick}
      >
        {label}
      </Button>
    </span>
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
    <Button
      type="button"
      variant="outline"
      tone="neutral"
      size="md"
      fullWidth
      leftIcon={<Icon className="h-4 w-4" strokeWidth={1.5} />}
      onPress={onClick}
    >
      {label}
    </Button>
  );
}
