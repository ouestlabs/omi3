import { InformationIcon } from "@audio-ui/icons";
import { Icons } from "audio-ui/assets";
import React from "react";
import type { registryItemSchema } from "shadcn/schema";
import type { z } from "zod";
import { CodeBlockCommand } from "@/components/code-block/command";
import { CopyRegistry } from "@/components/layouts/doc/copy-registry";
import { ComponentSource } from "@/components/preview/source";
import { highlightCode } from "@/lib/highlight-code";
import { getRegistryItem } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Sheet, SheetPopup, SheetTrigger } from "@/registry/default/ui/sheet";

export type Particle = z.infer<typeof registryItemSchema> & {
  highlightedCode: string;
};

export async function ParticleDisplay({
  name,
  children,
  className,
}: { name: string } & React.ComponentProps<"div">) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://audio-ui.vercel.app";
  const particle = await getCachedRegistryItem(name);
  const highlightedCode = await getParticleHighlightedCode(
    particle?.files?.[0]?.content ?? ""
  );

  if (!(particle && highlightedCode)) {
    return null;
  }

  return (
    <div
      className={cn(
        "after:-inset-[5px] after:-z-1 relative flex min-w-0 flex-col rounded-xl border bg-muted/50 bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72",
        className
      )}
    >
      <div className="-m-px flex min-w-0 flex-1 flex-col flex-wrap items-center justify-center overflow-x-auto rounded-t-xl rounded-b-lg border bg-background p-6 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] lg:px-8 lg:py-12 dark:before:shadow-[0_-1px_--theme(--color-white/8%)]">
        <div data-slot="particle-wrapper">{children}</div>
      </div>
      <div className="flex items-center gap-3 rounded-b-xl p-2">
        <p className="flex flex-1 gap-1 truncate text-muted-foreground text-xs">
          <InformationIcon className="size-3 h-lh shrink-0" />
          <span className="truncate">{particle.description}</span>
        </p>
        <div className="flex items-center gap-1.5">
          {process.env.NODE_ENV === "development" && (
            <Button
              className="text-xs"
              disabled
              size="sm"
              title="Particle name"
              variant="outline"
            >
              {particle.name}
            </Button>
          )}
          <CopyRegistry value={`${baseUrl}/r/${name}.json`} variant="outline" />
          <Sheet>
            <SheetTrigger
              render={
                <Button className="text-xs" size="sm" variant="outline" />
              }
            >
              View code
            </SheetTrigger>
            <SheetPopup
              className="bg-sidebar duration-200 data-ending-style:translate-x-8 data-starting-style:translate-x-8 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:max-w-3xl"
              showCloseButton={false}
            >
              <div className="flex flex-1 flex-col overflow-hidden p-6">
                <div>
                  <h2 className="mb-4 font-heading text-xl">Installation</h2>
                  <figure data-rehype-pretty-code-figure>
                    <CodeBlockCommand
                      __bun__={`bunx --bun shadcn@latest add @audio/${name}`}
                      __npm__={`npx shadcn@latest add @audio/${name}`}
                      __pnpm__={`pnpm dlx shadcn@latest add @audio/${name}`}
                      __yarn__={`yarn dlx shadcn@latest add @audio/${name}`}
                    />
                  </figure>
                </div>
                <div className="flex h-full flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="mt-6 mb-4 font-heading text-xl">Code</h2>
                    <Button
                      render={
                        <a
                          href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(`${baseUrl}/r/${name}.json`)}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          title="Open in v0"
                        >
                          Open in v0
                        </a>
                      }
                      variant="outline"
                    >
                      Open in<span className="sr-only">v0</span>
                      <Icons.V0 className="size-5" />
                    </Button>
                  </div>
                  <ComponentSource
                    className="*:data-rehype-pretty-code-figure:no-scrollbar h-full overflow-hidden *:data-rehype-pretty-code-figure:mt-0 *:data-rehype-pretty-code-figure:max-h-full *:data-rehype-pretty-code-figure:overflow-y-auto"
                    collapsible={false}
                    name={name}
                  />
                </div>
              </div>
            </SheetPopup>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

const getCachedRegistryItem = React.cache(
  async (name: string) => await getRegistryItem(name)
);

const getParticleHighlightedCode = React.cache(
  async (content: string) => await highlightCode(content)
);
