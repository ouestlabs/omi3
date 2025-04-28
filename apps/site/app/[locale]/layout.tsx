import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LangueSelect } from '@/components/i18n/select';
import { routing } from '@/i18n/routing';
import { Logo, montserrat } from '@omi3/ui/assets';
import { buttonVariants } from '@omi3/ui/components/button';
import { cn } from '@omi3/ui/lib/utils';
import { ThemeProvider, ThemeToggler } from '@omi3/ui/theme';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import type { Locale } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Manifest' });

  return {
    metadataBase: new URL('https://omi3.dev'),
    title: {
      default: t('name'),
      template: `%s - ${t('name')}`,
    },
    description: t('description'),
    keywords: ['web audio', 'web audio api', 'audio player', 'audio library', 'audio processing', 'open source'],
    referrer: 'origin-when-cross-origin',
    classification: 'Audio UI',
    category: 'Audio',
    applicationName: 'Omi3',
    creator: 'Omi3',
    authors: [{ name: 'Lucien Loua', url: 'https://github.com/lucien-loua' }],
    openGraph: {
      type: 'website',
      siteName: 'Omi3',
      title: {
        default: t('name'),
        template: `%s - ${t('name')}`,
      },
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        nocache: true,
        noimageindex: true,
        nosnippet: true,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className={cn(montserrat.className, 'min-h-full antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider timeZone="Africa/Conakry">
            <div className="max-w-5xl w-full mx-auto flex flex-col min-h-svh justify-center flex-1 gap-2 p-2">
              <header className="flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold tracking-tight">
                  audiocn
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
                    href="https://github.com/lucien-loua/omi3"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Logo.Github />
                  </Link>
                  <ThemeToggler />
                  <LangueSelect />
                </div>
              </header>
              {children}
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </body>
    </html>
  );
}
