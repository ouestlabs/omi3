import type { Metadata } from "next";
import { appConfig } from "@/lib/config";

const META_THEME_COLORS = Object.freeze({
  light: "#ffffff",
  dark: "#09090b",
});

function createViewport() {
  return {
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: META_THEME_COLORS.light,
      },
      { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

function createMetadata(override: Partial<Metadata> = {}): Metadata {
  return {
    title: {
      template: `%s - ${appConfig.name} | Audio UI Components for React | Accessible & Composable`,
      default: `${appConfig.name} - Build accessible React audio interfaces fast with composable Audio UI components. Copy, paste, and own. Explore docs and ready-made components.`,
    },
    description: appConfig.description,
    applicationName: appConfig.name,
    metadataBase: appConfig.url,
    appleWebApp: {
      title: appConfig.name,
      statusBarStyle: "default",
      capable: true,
    },
    authors: [{ name: "Lucien Loua", url: "https://github.com/lucien-loua" }],
    generator: appConfig.name,
    keywords: [
      "audio UI components",
      "React audio player",
      "accessible components",
      "shadcn/ui",
      "React UI",
    ],
    ...override,
    openGraph: {
      url: `${appConfig.url}`,
      siteName: appConfig.name,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ouestlabs",
      ...override.twitter,
    },
    alternates: {
      ...override.alternates,
      types: {
        "application/rss+xml": [
          { title: `${appConfig.name} Docs`, url: `${appConfig.url}/rss.xml` },
        ],
        ...override.alternates?.types,
      },
    },
  };
}

export { META_THEME_COLORS, createViewport, createMetadata };
