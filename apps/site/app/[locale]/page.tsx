import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AudioPlayer } from '@/components/audio/player';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.player' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <AudioPlayer />
    </main>
  );
}
