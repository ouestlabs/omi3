import { routing } from '@/i18n/routing';
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
