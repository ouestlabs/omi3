"use client";

import { MoonIcon, SunIcon } from "@audio-ui/icons";
import { Button } from "audio-ui/components/button";
import { useTheme } from "audio-ui/hooks/use-theme";
export function ThemeToggler() {
  const { toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme} size="icon" variant="outline">
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
