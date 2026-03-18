import type { LucideIcon } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  action?: () => void;
  shortcut?: string;
  keywords?: string[];
}

export interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
}
