import { Toaster } from '@omi3/ui/components/sonner';
import { ThemeProvider } from '@omi3/ui/theme';
import type { Metadata } from "next";
import "@omi3/ui/globals.css";
import { montserrat, silk } from '@omi3/ui/assets';

import Script from "next/script";

export const metadata: Metadata = {
  title: "AudioCn",
  description: "AudioCn is a registry for audio components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.className} antialiased`}
      >
        <ThemeProvider attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem>

          <div className="max-w-5xl w-full mx-auto flex flex-col min-h-svh">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
        <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </body>
    </html>
  );
}
