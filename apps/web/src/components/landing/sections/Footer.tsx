'use client';

/**
 * Footer - Landing Page
 *
 * Minimal footer with links.
 */

interface FooterProps {
  t: (key: string, params?: Record<string, string>) => string;
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 px-8 py-8 md:flex-row">
      <div className="text-xs tracking-wider text-zinc-600">{t('landing.footer.copyright')}</div>
      <div className="flex gap-8">
        <a
          href="#"
          className="text-xs tracking-wider text-zinc-600 transition-colors hover:text-zinc-300"
        >
          {t('landing.footer.interoperability')}
        </a>
        <a
          href="#"
          className="text-xs tracking-wider text-zinc-600 transition-colors hover:text-zinc-300"
        >
          {t('landing.footer.privacy')}
        </a>
      </div>
    </footer>
  );
}
