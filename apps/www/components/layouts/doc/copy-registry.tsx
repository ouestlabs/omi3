"use client";
import { CopySuccessIcon } from "@audio-ui/icons";
import { Icons } from "audio-ui/assets";
import type * as React from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

export function CopyRegistry({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className={cn(className)}
            data-slot="copy-button"
            onClick={() => copyToClipboard(value)}
            size="icon-sm"
            variant={variant}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {isCopied ? (
              <CopySuccessIcon className="size-3.5" />
            ) : (
              <Icons.Mcp className="size-3.5" />
            )}
          </Button>
        }
      />
      <TooltipPopup>{isCopied ? "Copied" : "Copy Registry URL"}</TooltipPopup>
    </Tooltip>
  );
}
