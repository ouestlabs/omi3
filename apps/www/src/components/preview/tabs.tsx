"use client";

import { cn } from "@/registry/default/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs";

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
  return (
    <div
      className={cn("group relative mt-4 mb-12 flex flex-col gap-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview">
        {!hideCode && (
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              className="data-[state=active]:border data-[state=active]:border-border data-[state=active]:shadow-none"
              value="preview"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border data-[state=active]:border-border data-[state=active]:shadow-none"
              value="code"
            >
              Code
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent
          className="relative rounded-(--radius) border"
          value="preview"
        >
          <div
            className={cn(
              "preview flex h-[450px] w-full justify-center overflow-y-auto p-10 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center max-sm:px-6"
            )}
            data-align={align}
          >
            {component}
          </div>
        </TabsContent>
        <TabsContent
          className="relative rounded-none **:[figure]:m-0! **:[pre]:h-[450px]"
          value="code"
        >
          {source}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { ComponentPreviewTabs };
