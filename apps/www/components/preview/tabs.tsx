"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTab } from "@/registry/default/ui/tabs";

function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
}) {
  const [tab, setTab] = React.useState("preview");

  return (
    <div
      className={cn("group relative mt-4 mb-12 flex flex-col gap-2", className)}
      {...props}
    >
      <Tabs onValueChange={setTab} value={tab}>
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList className="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none">
              <TabsTab className="rounded-lg" value="preview">
                Preview
              </TabsTab>
              <TabsTab className="rounded-lg" value="code">
                Code
              </TabsTab>
            </TabsList>
          )}
        </div>
      </Tabs>
      <div
        className="relative rounded-xl border data-[tab=code]:bg-code"
        data-tab={tab}
      >
        <div
          className="invisible data-[active=true]:visible"
          data-active={tab === "preview"}
          data-slot="preview"
        >
          <div
            className={cn(
              "preview flex h-[450px] w-full justify-center overflow-y-auto p-10 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center max-sm:px-6"
            )}
            data-align={align}
          >
            {component}
          </div>
        </div>
        <div
          className="absolute inset-0 hidden overflow-hidden data-[active=true]:block **:[figure]:m-0! **:[pre]:h-[450px]"
          data-active={tab === "code"}
          data-slot="code"
        >
          {source}
        </div>
      </div>
    </div>
  );
}

export { ComponentPreviewTabs };
