import { i18nConfig, type Locale } from '@profile/i18n/server';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Syne } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import { RootProvider } from '@/shared/providers';
import { themeScript } from '@/shared/providers/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: {
    default: 'PATCH - Professional Developer Profiles',
    template: '%s | PATCH',
  },
  description: 'Create and share your professional developer profile and resume with PATCH.',
  keywords: ['developer', 'profile', 'resume', 'portfolio', 'career', 'PATCH'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && i18nConfig.locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return i18nConfig.defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale from URL path via headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/';
  const locale = getLocaleFromPath(pathname);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} ${syne.variable} min-h-screen bg-[#030303] font-sans text-white antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
