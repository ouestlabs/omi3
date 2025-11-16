"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import {
  AudioProvider,
  demoTracks,
} from "@/registry/default/ui/audio/provider";
import { Toaster } from "@/registry/default/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <AudioProvider tracks={demoTracks}>{children}</AudioProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
