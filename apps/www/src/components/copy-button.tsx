"use client";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import React from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

function CopyButton({
  value,
  className,
  variant = "ghost",
  tooltip = "Copy to Clipboard",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
  tooltip?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "absolute top-3 right-2 z-10 size-7 bg-code hover:opacity-100 focus-visible:opacity-100",
            className
          )}
          data-copied={hasCopied}
          data-slot="copy-button"
          onClick={() => {
            copyToClipboardWithMeta(value);
            setHasCopied(true);
          }}
          size="icon"
          variant={variant}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? <CopyCheckIcon /> : <CopyIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{hasCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { CopyButton, copyToClipboardWithMeta };
