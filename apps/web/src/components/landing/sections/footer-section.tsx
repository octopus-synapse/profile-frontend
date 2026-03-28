'use client';

import { useI18n } from '@profile/i18n';

export function FooterSection() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-zinc-900 bg-black px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-black tracking-tight text-white">
              PATCH<span className="text-cyan-500">.</span>
            </p>
            <p className="mt-1 text-sm text-zinc-500">{t('landing.footer.tagline')}</p>
          </div>

          <nav className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="transition-colors hover:text-zinc-300">
              {t('landing.footer.privacy')}
            </a>
            <a href="#" className="transition-colors hover:text-zinc-300">
              {t('landing.footer.terms')}
            </a>
            <a
              href={`mailto:${t('landing.footer.email')}`}
              className="transition-colors hover:text-cyan-400"
            >
              {t('landing.footer.email')}
            </a>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 border-t border-zinc-900 pt-6 text-xs text-zinc-600 md:flex-row md:items-center">
          <p>{t('landing.footer.copyright')}</p>
          <p className="font-mono">{t('landing.footer.built')}</p>
        </div>
      </div>
    </footer>
  );
}
