"use client";
import { CheckIcon } from "lucide-react";
import type * as React from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Icons } from "@/lib/icons";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Tooltip,
  TooltipContent,
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
      <TooltipTrigger asChild>
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
            <CheckIcon className="size-3.5" />
          ) : (
            <Icons.mcp className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isCopied ? "Copied" : "Copy Registry URL"}
      </TooltipContent>
    </Tooltip>
  );
}
