import type { Metadata } from "next";
import "@omi3/ui/globals.css";
import { geist } from '@omi3/ui/assets';

import Script from "next/script";
import { Header } from './_components/header';
import { Footer } from './_components/footer';
import { Providers } from './_providers';

export const metadata: Metadata = {
  title: "@omi3/ui - audio components for the web",
  description: "@omi3/ui is a registry for audio components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.className} antialiased`}
      >
        <Providers>
          <div className="max-w-5xl w-full mx-auto flex flex-col min-h-svh">
            <Header />
            {children}
            <Footer />
          </div>
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </Providers>
      </body>
    </html >
  );
}
