'use client';


import { usePathname, useRouter } from '@/i18n/navigation';
import React, { useTransition } from 'react';

import { Icons } from '@omi3/ui/assets';
import { Badge } from '@omi3/ui/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@omi3/ui/components/select';
import type { Locale } from 'next-intl';
import { useParams } from 'next/navigation';

const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

export function LangueSelect() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (lang: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: lang });
    });
  };

  const selectedLocale = LOCALES.find((locale) => locale.code === params.locale);

  return (
    <Select value={params.locale as string} onValueChange={handleLanguageChange} disabled={isPending}>
      <SelectTrigger aria-label="Languages">
        <div className="flex w-full items-center gap-2 justify-between">
          <Icons.Languages className="size-5 animate-pulse" />
          <SelectValue>{selectedLocale?.code.toUpperCase()}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
