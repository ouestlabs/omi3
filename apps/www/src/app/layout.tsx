import "../styles/globals.css";

import type { Metadata } from "next";
import {
  Geist_Mono as FontMono,
  Bricolage_Grotesque as FontSans,
  Instrument_Serif as FontSerif,
} from "next/font/google";
import { SiteHeader } from "@/components/layouts/global";
import { META_THEME_COLORS } from "@/lib/metadata";
import { cn } from "@/registry/default/lib/utils";
import { Providers } from "./_providers";
export const metadata: Metadata = {
  metadataBase: new URL("https://audio-ui.vercel.app"),
  title:
    "audio/ui - A modern Audio UI component library built on top of shadcn/ui.",
  description:
    "audio/ui is a collection of accessible, and composable React components. Built on top of shadcn/ui and styled with Tailwind CSS.",
};

const sans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const serif = FontSerif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});
const mono = FontMono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <ignore>
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
          }}
        />
        <meta content={META_THEME_COLORS.light} name="theme-color" />
      </head>
      <body className={cn(sans.variable, serif.variable, mono.variable)}>
        <Providers>
          <div className="before:-z-10 relative flex min-h-svh flex-col overflow-clip [--header-height:4rem] before:pointer-events-none before:absolute before:inset-0 before:bg-sidebar">
            <SiteHeader />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
