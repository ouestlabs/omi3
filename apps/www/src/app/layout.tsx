import "./globals.css";

import type { Metadata } from "next";
import { SiteHeader } from "@/components/layouts/global";
import { cn } from "@/registry/default/lib/utils";
import { Providers } from "./_providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://audio-ui.vercel.app"),
  title:
    "audio/ui - A modern Audio UI component library built on top of shadcn/ui. Built for developers and AI.",
  description:
    "audio/ui is a collection of accessible, and composable React components. Built on top of shadcn/ui and styled with Tailwind CSS,",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className={cn("bg-sidebar")}>
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
