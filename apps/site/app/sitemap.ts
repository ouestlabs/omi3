import { generateLocaleRoutes, getStaticRoutes, getUrl } from './_utils/sitemap';

import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(routing.pathnames) as Array<keyof typeof routing.pathnames>;
  const staticRoutes = getStaticRoutes(keys);
  const localeRoutes = generateLocaleRoutes(staticRoutes, routing.locales, routing.defaultLocale, getUrl);

  return localeRoutes as MetadataRoute.Sitemap;
}
