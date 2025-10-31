"use client";

import type { Toggle as TogglePrimitive } from "@base-ui-components/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui-components/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/registry/default/ui/separator";
import {
  Toggle as ToggleComponent,
  type toggleVariants,
} from "@/registry/default/ui/toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive
      className={cn(
        "flex w-fit *:pointer-coarse:after:min-w-auto",
        variant === "default"
          ? "gap-0.5"
          : "[--clip-end:-1rem] [--clip-start:-1rem]",
        className
      )}
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function Toggle({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;

  return (
    <ToggleComponent
      className={cn(
        resolvedVariant === "outline" &&
          "not-first:before:-start-0.5 not-last:before:-end-0.5 not-first:rounded-s-none not-last:rounded-e-none border-x-0 not-first:before:rounded-s-none not-last:before:rounded-e-none first:border-s last:border-e focus-visible:z-10 before:[clip-path:inset(-1rem_var(--clip-end)_-1rem_var(--clip-start))] not-first:before:[--clip-start:2px] not-last:before:[--clip-end:2px] not-last:has-[+[data-slot=separator]]:before:[--clip-end:1.5px] [[data-slot=separator]+&]:before:[--clip-start:1.5px]",
        className
      )}
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      size={resolvedSize}
      variant={resolvedVariant}
      {...props}
    >
      {children}
    </ToggleComponent>
  );
}

function ToggleGroupSeparator({ className, ...props }: { className?: string }) {
  return <Separator className={className} orientation="vertical" {...props} />;
}

export { ToggleGroup, Toggle, Toggle as ToggleGroupItem, ToggleGroupSeparator };
