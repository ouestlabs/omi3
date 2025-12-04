"use client";

import {
  BookIcon,
  BookOpenIcon,
  BubblesIcon,
  CornerDownLeft,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import type { ComponentProps } from "react";
import React from "react";
import { useConfig } from "@/hooks/use-config";
import { useIsMac } from "@/hooks/use-is-mac";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import type { source } from "@/lib/source";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/default/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import { Kbd, KbdGroup } from "@/registry/default/ui/kbd";
import { Separator } from "@/registry/default/ui/separator";

function CommandMenu({
  tree,
  navItems,
  ...props
}: ComponentProps<typeof Dialog> & {
  tree: typeof source.pageTree;
  navItems?: { href: string; label: string }[];
}) {
  const router = useRouter();
  const isMac = useIsMac();
  const [config] = useConfig();
  const [open, setOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<
    "page" | "component" | null
  >(null);
  const [copyPayload, setCopyPayload] = React.useState("");
  const packageManager = config?.packageManager || "pnpm";

  const handlePageHighlight = React.useCallback(
    (isComponent: boolean, item: { url: string; name?: React.ReactNode }) => {
      if (isComponent) {
        const componentName = item.url.split("/").pop();
        setSelectedType("component");
        const registryItem = `@audio/${componentName}`;
        let cmd: string;
        switch (packageManager) {
          case "pnpm":
            cmd = `pnpm dlx shadcn@latest add ${registryItem}`;
            break;
          case "bun":
            cmd = `bunx --bun shadcn@latest add ${registryItem}`;
            break;
          case "yarn":
            cmd = `yarn dlx shadcn@latest add ${registryItem}`;
            break;
          default:
            cmd = `npx shadcn@latest add ${registryItem}`;
        }

        setCopyPayload(cmd);
      } else {
        setSelectedType("page");
        setCopyPayload("");
      }
    },
    [packageManager]
  );

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  React.useEffect(() => {
    const isToggleShortcut = (e: KeyboardEvent) =>
      (e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/";

    const isCopyShortcut = (e: KeyboardEvent) =>
      e.key === "c" && (e.metaKey || e.ctrlKey);

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }
      if (target.isContentEditable) {
        return true;
      }
      return (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      );
    };

    const down = (e: KeyboardEvent) => {
      if (isToggleShortcut(e)) {
        if (!isEditableTarget(e.target)) {
          e.preventDefault();
          setOpen((prevOpen) => !prevOpen);
        }
        return;
      }

      if (
        isCopyShortcut(e) &&
        (selectedType === "page" || selectedType === "component")
      ) {
        if (copyPayload) {
          posthog.capture("command_menu_command_copied", {
            command: copyPayload,
          });
        }
        runCommand(() => {
          if (navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copyPayload);
          }
        });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [copyPayload, runCommand, selectedType]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "relative w-full justify-start pl-3 font-medium text-foreground sm:pr-12 md:w-48 lg:w-60 xl:w-64 dark:bg-card"
          )}
          onClick={() => setOpen(true)}
          size="sm"
          variant="outline"
          {...props}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>

          <div className="absolute top-1.25 right-1.5 hidden gap-1 sm:flex">
            <KbdGroup>
              <Kbd className="border">{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="border">K</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="rounded-none bg-transparent **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border **:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input]:py-0"
          filter={(value, search, keywords) => {
            const extendValue = `${value} ${keywords?.join(" ") || ""}`;
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Search documentation…" />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5 pt-1">
            <CommandEmpty asChild>
              <Empty className="my-1 h-[calc(100lvh-29.5rem-2px)] border bg-muted/20 text-center text-muted-foreground text-sm">
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No results found</EmptyTitle>
                  <EmptyDescription>
                    Try searching with different keywords.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CommandEmpty>
            {navItems && navItems.length > 0 && (
              <CommandGroup
                className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                heading="Pages"
              >
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    keywords={["nav", "navigation", item.label.toLowerCase()]}
                    onHighlight={() => {
                      setSelectedType("page");
                      setCopyPayload("");
                    }}
                    onSelect={() => {
                      posthog.capture("command_menu_item_selected", {
                        item_url: item.href,
                        item_name: item.label,
                        item_type: "page",
                      });
                      runCommand(() => router.push(item.href));
                    }}
                    value={`Navigation ${item.label}`}
                  >
                    <BookOpenIcon className="size-4" />

                    {item.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {tree.children.map((group) => (
              <CommandGroup
                className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                heading={group.name}
                key={group.$id}
              >
                {group.type === "folder" &&
                  group.children.map((item) => {
                    if (item.type === "page") {
                      const isComponent = item.url.includes("/components/");

                      return (
                        <CommandMenuItem
                          key={item.url}
                          keywords={isComponent ? ["component"] : undefined}
                          onHighlight={() =>
                            handlePageHighlight(isComponent, item)
                          }
                          onSelect={() => {
                            posthog.capture("command_menu_item_selected", {
                              item_url: item.url,
                              item_name: item.name?.toString(),
                              item_type: isComponent ? "component" : "page",
                            });
                            runCommand(() => router.push(item.url));
                          }}
                          value={
                            item.name?.toString()
                              ? `${group.name} ${item.name}`
                              : ""
                          }
                        >
                          {isComponent ? (
                            <BubblesIcon className="size-4" />
                          ) : (
                            <BookIcon className="size-4" />
                          )}
                          {item.name}
                        </CommandMenuItem>
                      );
                    }
                    return null;
                  })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 font-medium text-muted-foreground text-xs dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeft />
            </CommandMenuKbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? "Go to Page"
              : null}
          </div>
          {copyPayload && (
            <>
              <Separator className="h-4!" orientation="vertical" />
              <div className="flex min-w-0 items-center gap-1">
                <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                <span className="truncate">{copyPayload}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void;
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.();
      }
    }
  });

  return (
    <CommandItem
      className={cn(
        "h-9 rounded-md border border-transparent px-3! font-medium data-[selected=true]:border-input data-[selected=true]:bg-input/50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium font-sans text-[0.7rem] text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

export { CommandMenu };
