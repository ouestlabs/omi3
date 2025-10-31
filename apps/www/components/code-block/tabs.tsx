"use client";

import React from "react";

import { useConfig } from "@/hooks/use-config";
import { Tabs } from "@/registry/default/ui/tabs";

function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig();

  const installationType = React.useMemo(
    () => config.installationType || "cli",
    [config]
  );

  return (
    <Tabs
      className="relative mt-6 w-full"
      onValueChange={(value) =>
        setConfig({ ...config, installationType: value as "cli" | "manual" })
      }
      value={installationType}
    >
      {children}
    </Tabs>
  );
}
export { CodeTabs };
