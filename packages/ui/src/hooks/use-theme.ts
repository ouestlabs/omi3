"use client";

import { useTheme as useNextTheme } from "next-themes";
import React from "react";

function useTheme() {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [, startTransition] = React.useTransition();
  const themeActions = React.useMemo(
    () => ({
      toggleTheme: () => {
        startTransition(() => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        });
      },
    }),
    [resolvedTheme, setTheme]
  );
  return {
    setTheme,
    ...themeActions,
  };
}
export { useTheme };
