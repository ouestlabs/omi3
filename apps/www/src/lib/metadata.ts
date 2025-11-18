import type { Metadata, Viewport } from "next";
import { appConfig } from "@/lib/config";

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
export const createViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
  width: "device-width",
  viewportFit: "auto",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function createMetadata(override: Partial<Metadata> = {}): Metadata {
  const baseDefaults: Metadata = {
    title: {
      template: `%s | ${appConfig.name} A modern Audio UI component library built on top of shadcn/ui.`,
      default: appConfig.name,
    },
    description: appConfig.description,
    applicationName: appConfig.name,
    appleWebApp: {
      title: appConfig.name,
      statusBarStyle: "default",
      capable: true,
    },
    authors: [
      {
        name: "Lucien Loua",
        url: "https://github.com/lucien-loua",
      },
    ],
    generator: appConfig.name,
    metadataBase: appConfig.url,
  };

  const merged: Metadata = {
    ...baseDefaults,
    ...override,
    openGraph: {
      ...(override.openGraph ?? {}),
      url: override.openGraph?.url ?? `${appConfig.url}`,
      images: override.openGraph?.images ?? appConfig.ogImage,
      siteName: appConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ouestlabs",
      ...(override.twitter ?? {}),
    },
    alternates: {
      ...(override.alternates ?? {}),
      types: {
        "application/rss+xml": [
          {
            title: `${appConfig.name} Docs`,
            url: `${appConfig.url}/rss.xml`,
          },
        ],
        ...(override.alternates?.types || {}),
      },
    },
  };

  return merged;
}
