import { InfoIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Callout } from "@/components/callout";
import { CodeCollapsibleWrapper } from "@/components/code-block/collapsible";
import { CodeBlockCommand } from "@/components/code-block/command";
import { CodeTabs } from "@/components/code-block/tabs";
import { ComponentsList } from "@/components/components-list";
import { CopyButton } from "@/components/copy-button";
import { Mermaid } from "@/components/mermaid";
import { ComponentPreview } from "@/components/preview";
import { ComponentSource } from "@/components/preview/source";
import { getIconForLanguageExtension } from "@/lib/icons";
import { cn } from "@/registry/default/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/alert";
import { Button } from "@/registry/default/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
      <h1
        className={cn("mt-2 scroll-m-20 font-heading text-3xl", className)}
        {...props}
      />
    ),
    h2: ({ className, children, ...props }: React.ComponentProps<"h2">) => {
      const id =
        (props as { id?: string }).id ||
        children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase();

      return (
        <h2
          {...props}
          className={cn(
            "mt-12 scroll-m-20 font-heading text-2xl first:mt-0 lg:mt-16 [&+p]:mt-4! *:[code]:text-2xl",
            className
          )}
          id={id}
        >
          <a
            className="no-underline underline-offset-4 hover:underline"
            href={`#${id}`}
          >
            {children}
          </a>
        </h2>
      );
    },
    h3: ({ className, children, ...props }: React.ComponentProps<"h3">) => {
      const id =
        (props as { id?: string }).id ||
        children
          ?.toString()
          .replace(/ /g, "-")
          .replace(/'/g, "")
          .replace(/\?/g, "")
          .toLowerCase();

      return (
        <h3
          {...props}
          className={cn(
            "mt-8 scroll-m-20 font-semibold text-lg *:[code]:text-lg",
            className
          )}
          id={id}
        >
          <a
            className="no-underline underline-offset-4 hover:underline"
            href={`#${id}`}
          >
            {children}
          </a>
        </h3>
      );
    },
    h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
      <h4
        className={cn("mt-8 scroll-m-20 font-medium tracking-tight", className)}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.ComponentProps<"h5">) => (
      <h5
        className={cn(
          "mt-8 scroll-m-20 font-medium text-lg tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h6: ({ className, ...props }: React.ComponentProps<"h6">) => (
      <h6
        className={cn(
          "mt-8 scroll-m-20 font-medium text-base tracking-tight",
          className
        )}
        {...props}
      />
    ),
    a: ({ className, ...props }: React.ComponentProps<"a">) => (
      <a
        className={cn(
          "font-medium text-foreground underline underline-offset-4",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: React.ComponentProps<"p">) => (
      <p
        className={cn(
          "not-first:mt-6 text-muted-foreground leading-relaxed",
          className
        )}
        {...props}
      />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong
        className={cn("font-medium text-foreground", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
      <ul
        className={cn("my-6 ms-6 list-disc text-muted-foreground", className)}
        {...props}
      />
    ),
    ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
      <ol
        className={cn(
          "my-6 ms-6 list-decimal text-muted-foreground",
          className
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.ComponentProps<"li">) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    blockquote: ({
      className,
      ...props
    }: React.ComponentProps<"blockquote">) => (
      <blockquote
        className={cn("mt-6 border-l-2 ps-6 italic", className)}
        {...props}
      />
    ),
    img: ({
      className,
      alt,
      height,
      width,
      ...props
    }: React.ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      // biome-ignore lint/performance/noImgElement: use native <img> element instead of next/image.
      <img
        alt={alt}
        className={cn("rounded-md", className)}
        height={height}
        width={width}
        {...props}
      />
    ),
    hr: ({ ...props }: React.ComponentProps<"hr">) => (
      <hr className="my-4 md:my-8" {...props} />
    ),
    table: ({ className, ...props }: React.ComponentProps<"table">) => (
      <div className="my-6 w-full overflow-y-auto">
        <table
          className={cn(
            "relative w-full overflow-hidden border-none text-sm",
            className
          )}
          {...props}
        />
      </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
      <tr
        className={cn("m-0 border-b last:border-b-none", className)}
        {...props}
      />
    ),
    th: ({ className, ...props }: React.ComponentProps<"th">) => (
      <th
        className={cn(
          "px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentProps<"td">) => (
      <td
        className={cn(
          "px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 text-[.8125rem] outline-none has-data-[slot=tabs]:p-0 has-data-highlighted-line:px-0 has-data-line-numbers:px-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    ),
    figure: ({ className, ...props }: React.ComponentProps<"figure">) => (
      <figure className={cn(className)} {...props} />
    ),
    figcaption: ({
      className,
      children,
      ...props
    }: React.ComponentProps<"figcaption">) => {
      const iconExtension =
        "data-language" in props && typeof props["data-language"] === "string"
          ? getIconForLanguageExtension(props["data-language"])
          : null;

      return (
        <figcaption
          className={cn(
            "flex items-center gap-2 text-code-foreground [&_svg]:size-5 [&_svg]:text-code-foreground [&_svg]:opacity-70 sm:[&_svg]:size-4",
            className
          )}
          {...props}
        >
          {iconExtension}
          {children}
        </figcaption>
      );
    },
    code: ({
      className,
      __raw__,
      __src__,
      __npm__,
      __yarn__,
      __pnpm__,
      __bun__,
      ...props
    }: React.ComponentProps<"code"> & {
      __raw__?: string;
      __src__?: string;
      __npm__?: string;
      __yarn__?: string;
      __pnpm__?: string;
      __bun__?: string;
    }) => {
      // Inline Code.
      if (typeof props.children === "string") {
        return (
          <code
            className={cn(
              "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] outline-none",
              className
            )}
            {...props}
          />
        );
      }

      // npm command.
      const isNpmCommand = __npm__ && __yarn__ && __pnpm__ && __bun__;
      if (isNpmCommand) {
        return (
          <CodeBlockCommand
            __bun__={__bun__}
            __npm__={__npm__}
            __pnpm__={__pnpm__}
            __yarn__={__yarn__}
          />
        );
      }

      // Default codeblock.
      return (
        <>
          {__raw__ && <CopyButton src={__src__} value={__raw__} />}
          <code {...props} />
        </>
      );
    },
    Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={cn("mt-8 scroll-m-32 font-medium tracking-tight", className)}
        {...props}
      />
    ),
    Steps: ({ ...props }) => (
      <div
        className="steps [&>h3]:step mb-12 [counter-reset:step] *:[h3]:first:mt-0!"
        {...props}
      />
    ),
    Image: ({
      src,
      className,
      width,
      height,
      alt,
      ...props
    }: React.ComponentProps<"img">) => (
      <Image
        alt={alt || ""}
        className={cn("mt-6 rounded-md border", className)}
        height={Number(height)}
        src={typeof src === "string" ? src : ""}
        width={Number(width)}
        {...props}
      />
    ),
    Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
      <Tabs className={cn(className)} {...props} />
    ),
    TabsList: ({
      className,
      ...props
    }: React.ComponentProps<typeof TabsList>) => (
      <TabsList className={cn("bg-transparent p-0", className)} {...props} />
    ),
    TabsTrigger: ({
      className,
      ...props
    }: React.ComponentProps<typeof TabsTrigger>) => (
      <TabsTrigger
        className={cn(
          "rounded-lg data-[state=active]:border data-[state=active]:border-border data-[state=active]:shadow-none",
          className
        )}
        {...props}
      />
    ),
    TabsContent: ({
      className,
      ...props
    }: React.ComponentProps<typeof TabsContent>) => (
      <TabsContent
        className={cn(
          "relative [&>.steps]:mt-6 [&_h3]:font-medium [&_h3]:text-base *:[figure]:first:mt-0",
          className
        )}
        {...props}
      />
    ),
    Tab: ({ className, ...props }: React.ComponentProps<"div">) => (
      <div className={cn(className)} {...props} />
    ),
    Alert: ({ className, ...props }: React.ComponentProps<typeof Alert>) => (
      <Alert className={cn("my-6", className)} {...props} />
    ),
    Button,
    Callout: ({
      className,
      ...props
    }: React.ComponentProps<typeof Callout>) => (
      <Callout className={cn("my-6", className)} {...props} />
    ),
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    AlertTitle,
    AlertDescription,
    InfoIcon,
    CodeTabs,
    ComponentPreview,
    ComponentSource,
    CodeCollapsibleWrapper,
    ComponentsList,
    Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
      <Link
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
    Mermaid,
    ...components,
  };
}
