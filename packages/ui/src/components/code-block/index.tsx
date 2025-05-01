"use client"

import { cn } from "@omi3/ui/lib/utils"
import type React from "react"
import { useEffect, useState } from "react"
import { type BundledLanguage, type BundledTheme, codeToHtml } from "shiki"
import { useTheme } from "next-themes";

export interface CodeBlockProps extends React.ComponentProps<"div"> {
  lightTheme?: BundledTheme,
  darkTheme?: BundledTheme,
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border bg-card text-card-foreground rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CodeBlockCodeProps extends React.ComponentProps<"div"> {
  code: string
  language?: BundledLanguage,
  lightTheme?: BundledTheme,
  darkTheme?: BundledTheme,
}

function CodeBlockCode({
  code,
  language = "tsx",
  lightTheme = "nord",
  darkTheme = "tokyo-night",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function highlight() {
      if (!mounted || !code) {
        setHighlightedHtml(`<pre class="p-4"><code>${code || ""}</code></pre>`);
        return;
      }

      const defaultColor = theme === 'dark' ? 'dark' : 'light';

      try {
        const html = await codeToHtml(code, {
          lang: language,
          themes: {
            light: lightTheme,
            dark: darkTheme,
          },
          defaultColor: defaultColor,
        });
        setHighlightedHtml(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedHtml(`<pre class="p-4"><code>${code}</code></pre>`);
      }
    }
    highlight()
  }, [code, language, theme, lightTheme, darkTheme, mounted])

  const classNames = cn(
    "w-full overflow-x-auto text-[13px] [&>pre]:my-0 [&>pre]:px-4 [&>pre]:py-4",
    className,
    mounted && (theme === "dark" ? "dark" : "light")
  )

  return (
    <div
      className={classNames}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki requires this to render highlighted code
      dangerouslySetInnerHTML={{ __html: highlightedHtml || `<pre class="p-4"><code>${code || ""}</code></pre>` }}
      {...props}
    />
  )
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>

function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock }
