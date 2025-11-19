import fs from "node:fs/promises";
import path from "node:path";
import type React from "react";
import { CodeBlock } from "@/components/md/block";
import { Collapse } from "@/components/md/code";
import { getRegistryItem } from "@/lib/registry";
import { Index } from "@/registry/__index__";
import { cn } from "@/registry/default/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs";

// Source
async function Source({
  name,
  src,
  title,
  language,
  collapsible = true,
  className,
}: React.ComponentProps<"div"> & {
  name?: string;
  src?: string;
  title?: string;
  language?: string;
  collapsible?: boolean;
}) {
  if (!(name || src)) {
    return null;
  }

  let code: string | undefined;

  if (name) {
    const item = await getRegistryItem(name);
    code = item?.files?.[0]?.content;
  }

  if (src) {
    const file = await fs.readFile(path.join(process.cwd(), src), "utf-8");
    code = file;
  }

  if (!code) {
    return null;
  }

  const lang = language ?? title?.split(".").pop() ?? "tsx";

  if (!collapsible) {
    return (
      <div className={cn("relative", className)}>
        <CodeBlock code={code} language={lang} title={title} />
      </div>
    );
  }

  return (
    <Collapse className={className}>
      <CodeBlock code={code} language={lang} title={title} />
    </Collapse>
  );
}

// Preview Tabs
function PreviewTabs({
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
        <TabsContent className="relative rounded-lg border" value="preview">
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

// Preview
function Preview({
  name,
  className,
  align = "center",
  hideCode = false,
  ...props
}: Omit<React.ComponentProps<"div">, "ref"> & {
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
  hideCode?: boolean;
}) {
  const Component = Index[name]?.component;

  if (!Component) {
    return (
      <p className="text-muted-foreground text-sm">
        Component{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    );
  }

  return (
    <PreviewTabs
      align={align}
      className={className}
      component={<Component />}
      hideCode={hideCode}
      source={<Source collapsible={false} name={name} />}
      {...props}
    />
  );
}

export { Source, Preview, PreviewTabs };
