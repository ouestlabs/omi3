"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@omi3/ui/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
export function ThemeToggler() {
  const { toggleTheme } = useTheme()
  return (
    <Button
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
