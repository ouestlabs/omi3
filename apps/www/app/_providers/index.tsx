"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "audio-engine/react";
import { ThemeProvider } from "audio-ui/theme";
import { Provider as JotaiProvider } from "jotai";
import { ToastProvider } from "@/registry/default/ui/toast";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <AudioProvider>
            <ToastProvider>{children}</ToastProvider>
          </AudioProvider>
        </ThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
