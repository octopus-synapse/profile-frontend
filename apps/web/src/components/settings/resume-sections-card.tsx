import { useI18n } from '@profile/i18n';
import { SectionIcon } from '@/shared/components/section-icon';
import type { DynamicSettingsNavItem } from './settings-page.utils';

interface ResumeSectionsCardProps {
  dynamicSections: DynamicSettingsNavItem[];
  onOpenSection?: (sectionKey: string) => void;
}

export function ResumeSectionsCard({ dynamicSections, onOpenSection }: ResumeSectionsCardProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
      <div>
        <h3 className="text-base font-semibold text-white">
          {t('settings.resume.sections.title')}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">{t('settings.resume.sections.description')}</p>
      </div>
      {dynamicSections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
          <p className="text-sm text-zinc-500">{t('settings.resume.sections.loading')}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {dynamicSections.map((section) => {
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onOpenSection?.(section.key)}
                className="group rounded-xl border border-white/10 bg-[#0A0A0A]/60 p-4 text-left transition-all hover:border-blue-500/40 hover:bg-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <SectionIcon iconType={section.iconType} icon={section.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white truncate">{section.label}</p>
                      {section.count > 0 && (
                        <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">
                          {section.count}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      {section.count > 0
                        ? `${section.count} ${section.count === 1 ? 'entry' : 'entries'}`
                        : 'Not added yet'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs font-medium text-blue-400 transition-colors group-hover:text-blue-300">
                  <span>{section.count > 0 ? 'Manage' : 'Add'}</span>
                  <svg
                    className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
