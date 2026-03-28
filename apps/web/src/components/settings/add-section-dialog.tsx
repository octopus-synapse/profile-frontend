'use client';

/**
 * AddSectionDialog — Two-step dialog flow for adding new resume sections
 * Step 1: Search and select section type
 * Step 2: Opens SectionItemDialog to add item data
 */

import { useI18n } from '@profile/i18n';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SectionIcon } from '@/shared/components/section-icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { SectionItemDialog } from './section-item-dialog';
import type { DynamicSettingsNavItem } from './settings-page.utils';

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSections: DynamicSettingsNavItem[];
  resumeId: string;
  onSuccess?: () => void;
}

export function AddSectionDialog({
  open,
  onOpenChange,
  availableSections,
  resumeId,
  onSuccess,
}: AddSectionDialogProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<DynamicSettingsNavItem | null>(null);

  const filteredSections = useMemo(() => {
    if (!search.trim()) return availableSections;
    const query = search.toLowerCase();
    return availableSections.filter(
      (section) =>
        section.label.toLowerCase().includes(query) ||
        section.description?.toLowerCase().includes(query),
    );
  }, [availableSections, search]);

  const handleSelectSection = (section: DynamicSettingsNavItem) => {
    setSelectedSection(section);
    onOpenChange(false);
    setSearch('');
  };

  const handleItemDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedSection(null);
    }
  };

  const handleItemSuccess = () => {
    setSelectedSection(null);
    onSuccess?.();
  };

  const handleMainDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSearch('');
    }
    onOpenChange(isOpen);
  };

  return (
    <>
      {/* Step 1: Section Type Picker */}
      <Dialog open={open} onOpenChange={handleMainDialogClose}>
        <DialogContent className="max-h-[85vh] overflow-hidden !bg-[#0c0c0e] !border-zinc-800/50">
          <DialogHeader className="!pb-0">
            <DialogTitle className="text-lg font-light text-white">
              {t('settings.sections.addNew')}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-500">
              {t('settings.sections.addNewDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('settings.sections.searchPlaceholder')}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="mt-4 max-h-[50vh] overflow-y-auto">
            {filteredSections.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-500">{t('settings.sections.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => handleSelectSection(section)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all hover:bg-white/[0.04]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 transition-colors group-hover:bg-zinc-800">
                      <SectionIcon iconType={section.iconType} icon={section.icon} size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{section.label}</p>
                      {section.description && (
                        <p className="mt-0.5 truncate text-[12px] text-zinc-500">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <Plus className="h-4 w-4 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Step 2: Item Form Dialog */}
      {selectedSection && (
        <SectionItemDialog
          open={!!selectedSection}
          onOpenChange={handleItemDialogClose}
          resumeId={resumeId}
          sectionTypeKey={selectedSection.key}
          sectionLabel={selectedSection.label}
          onSuccess={handleItemSuccess}
        />
      )}
    </>
  );
}
