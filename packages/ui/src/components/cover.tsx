"use client";

import { Avatar as CoverPrimitive } from "@base-ui-components/react/avatar";

import { cn } from "audio-ui/lib/utils";

function Cover({ className, ...props }: CoverPrimitive.Root.Props) {
  return (
    <CoverPrimitive.Root
      className={cn(
        "inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-background align-middle font-medium text-xs",
        className
      )}
      data-slot="cover"
      {...props}
    />
  );
}

function CoverImage({ className, ...props }: CoverPrimitive.Image.Props) {
  return (
    <CoverPrimitive.Image
      className={cn("size-full object-cover", className)}
      data-slot="cover-image"
      {...props}
    />
  );
}

function CoverFallback({ className, ...props }: CoverPrimitive.Fallback.Props) {
  return (
    <CoverPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted",
        className
      )}
      data-slot="cover-fallback"
      {...props}
    />
  );
}

export { Cover, CoverImage, CoverFallback };
