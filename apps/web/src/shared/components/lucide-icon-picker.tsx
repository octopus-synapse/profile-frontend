'use client';

import { Button, ScrollArea } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { FileText, Search } from 'lucide-react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import { Suspense, useDeferredValue, useMemo, useState } from 'react';

const ICONS_PER_PAGE = 60;

interface LucideIconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

function IconPreview({ name }: { name: string }) {
  return (
    <Suspense fallback={<FileText size={16} strokeWidth={1.5} />}>
      <DynamicIcon name={name as never} size={16} strokeWidth={1.5} />
    </Suspense>
  );
}

function useFilteredIcons(search: string) {
  const deferredSearch = useDeferredValue(search);
  return useMemo(() => {
    const allNames = iconNames as readonly string[];
    if (!deferredSearch) return allNames.slice(0, ICONS_PER_PAGE);
    const query = deferredSearch.toLowerCase();
    return allNames.filter((name) => name.includes(query)).slice(0, ICONS_PER_PAGE);
  }, [deferredSearch]);
}

export function LucideIconPicker({ value, onChange }: LucideIconPickerProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filteredIcons = useFilteredIcons(search);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="block w-full">
          <Button
            type="button"
            variant="outline"
            tone="neutral"
            size="md"
            fullWidth
            leftIcon={
              value ? <IconPreview name={value} /> : <FileText size={16} strokeWidth={1.5} />
            }
          >
            {value || 'Select icon...'}
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="bg-pf-canvas-default border-pf-border-default w-72 rounded-lg border p-0 shadow-lg"
        align="start"
        sideOffset={4}
      >
        <div className="border-pf-border-default flex items-center gap-2 border-b px-3 py-2">
          <Search size={14} className="text-pf-fg-muted" />
          <input
            className="text-pf-fg-default placeholder:text-pf-fg-muted w-full bg-transparent text-sm outline-none"
            placeholder={t('ui.iconPicker.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-56">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((name) => (
              <Button
                key={name}
                type="button"
                variant={value === name ? 'solid' : 'ghost'}
                tone={value === name ? 'primary' : 'neutral'}
                size="sm"
                iconOnly
                title={name}
                pressed={value === name}
                onPress={() => handleSelect(name)}
              >
                <IconPreview name={name} />
              </Button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-pf-fg-muted py-6 text-center text-sm">
              {t('ui.iconPicker.noResults')}
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
