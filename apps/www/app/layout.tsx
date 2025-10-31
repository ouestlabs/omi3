import "./globals.css";

import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Instrument_Serif,
} from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/layouts/global";
import { cn } from "@/lib/utils";
import { Providers } from "./_providers";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});
const geist_mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://audio-ui.vercel.app"),
  title:
    "audio ui - A modern Audio UI component library built on top of Base UI. Built for developers and AI.",
  description:
    "audio ui is a collection of accessible, and composable React components. Built on top of Base UI and styled with Tailwind CSS,",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-sidebar antialiased",
          bricolage.className,
          bricolage.variable,
          instrument.variable,
          geist_mono.variable
        )}
      >
        <Providers>
          <div className="before:-z-10 relative flex min-h-svh flex-col overflow-clip [--header-height:4rem] before:pointer-events-none before:absolute before:inset-0 before:bg-sidebar">
            <div
              aria-hidden="true"
              className="before:-left-3 after:-right-3 container pointer-events-none absolute inset-0 z-6 before:absolute before:inset-y-0 before:w-px before:bg-border/50 after:absolute after:inset-y-0 after:w-px after:bg-border/50"
            />
            <div
              aria-hidden="true"
              className="before:-left-[11.5px] before:-ml-1 after:-right-[11.5px] after:-mr-1 container pointer-events-none fixed inset-0 z-6 before:absolute before:top-[calc(var(--header-height)-4.5px)] before:z-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[calc(var(--header-height)-4.5px)] after:z-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs"
            />
            <SiteHeader />
            {children}
          </div>
        </Providers>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </body>
    </html>
  );
}
