"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/registry/default/ui/button";

export function ThemeSwitcher() {
  const { toggleTheme } = useTheme();
  return (
    <Button onClick={toggleTheme} size="icon-sm" variant="outline">
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
