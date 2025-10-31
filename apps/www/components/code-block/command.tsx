"use client";

import { CodeIcon, CopyIcon, CopySuccessIcon } from "@audio-ui/icons";
import React from "react";
import { useConfig } from "@/hooks/use-config";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/default/ui/tabs";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: React.ComponentProps<"pre"> & {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
}) {
  const [config, setConfig] = useConfig();
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const packageManager = config.packageManager || "pnpm";
  const tabs = React.useMemo(
    () => ({
      pnpm: __pnpm__,
      npm: __npm__,
      yarn: __yarn__,
      bun: __bun__,
    }),
    [__npm__, __pnpm__, __yarn__, __bun__]
  );

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager];

    if (!command) {
      return;
    }

    copyToClipboard(command);
  }, [packageManager, tabs, copyToClipboard]);

  return (
    <div className="overflow-x-auto">
      <Tabs
        className="gap-0"
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
          });
        }}
        value={packageManager}
      >
        <div className="flex items-center gap-2 border-border/64 border-b px-4 py-1 font-mono">
          <CodeIcon />
          <TabsList className="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none">
            {Object.entries(tabs).map(([key]) => (
              <TabsTab className="rounded-lg" key={key} value={key}>
                {key}
              </TabsTab>
            ))}
          </TabsList>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => (
            <TabsPanel className="mt-0 px-4 py-3.5" key={key} value={key}>
              <pre>
                <code
                  className="relative font-mono text-[.8125rem] leading-none"
                  data-language="bash"
                >
                  {value}
                </code>
              </pre>
            </TabsPanel>
          ))}
        </div>
      </Tabs>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              className="absolute top-1.5 right-1.5 z-3 size-9 opacity-70 hover:opacity-100 focus-visible:opacity-100 sm:size-8"
              data-slot="copy-button"
              onClick={copyCommand}
              size="icon"
              variant="ghost"
            >
              <span className="sr-only">Copy</span>
              {isCopied ? <CopySuccessIcon /> : <CopyIcon />}
            </Button>
          }
        />
        <TooltipPopup>{isCopied ? "Copied" : "Copy to Clipboard"}</TooltipPopup>
      </Tooltip>
    </div>
  );
}

export { CodeBlockCommand };
