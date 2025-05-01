"use client";

import { Button } from "@omi3/ui/components/button";
import { cn } from "@omi3/ui/lib/utils";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { type HTMLAttributes, useEffect, useState, useId } from "react";
import { codeToHtml, type BundledTheme, type BundledLanguage } from "shiki";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@omi3/ui/components/tooltip";
import { Label } from "@omi3/ui/components/label";

interface ScriptBlockProps extends HTMLAttributes<HTMLDivElement> {
  showMultiplePackageOptions?: boolean;
  codeLanguage?: BundledLanguage;
  lightTheme?: BundledTheme;
  darkTheme?: BundledTheme;
  commandMap: Record<string, string>;
  className?: string;
  label?: string;
}

export function ScriptBlock({
  showMultiplePackageOptions = true,
  codeLanguage = "shell",
  lightTheme = "nord",
  darkTheme = "tokyo-night",
  commandMap,
  className,
  label = "Installation Command",
}: ScriptBlockProps) {
  const packageManagers = Object.keys(commandMap);
  const [packageManager, setPackageManager] = useState(packageManagers[0]);
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const { theme } = useTheme();
  const command = packageManager ? commandMap[packageManager] : "";
  const id = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadHighlightedCode() {
      if (!mounted || !command) {
        setHighlightedCode('<pre class="p-2 px-4 font-mono">&nbsp;</pre>');
        return;
      }
      try {
        const defaultThemeColor = theme === "dark" ? "dark" : "light";
        const highlighted = await codeToHtml(command, {
          lang: codeLanguage,
          themes: {
            light: lightTheme,
            dark: darkTheme,
          },
          defaultColor: defaultThemeColor,
        });
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(`<pre class="p-2 px-4 font-mono">${command}</pre>`);
      }
    }

    loadHighlightedCode();
  }, [command, theme, codeLanguage, lightTheme, darkTheme, mounted]);

  const handleCopy = () => {
    if (!command) {
      return;
    }
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {showMultiplePackageOptions && packageManagers.length > 1 && (
        <div className="relative">
          <div className="inline-flex overflow-hidden rounded-md border border-border text-xs">
            {packageManagers.map((pm, index) => (
              <div key={pm} className="flex items-center">
                {index > 0 && (
                  <div className="h-4 w-px bg-border" aria-hidden="true" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "relative rounded-none bg-background px-2 py-1 hover:bg-background",
                    packageManager === pm ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setPackageManager(pm)}
                >
                  {pm}
                  {packageManager === pm && (
                    <motion.div
                      className="absolute inset-x-0 bottom-[1px] mx-auto h-0.5 w-[90%] bg-primary"
                      layoutId={`activeTab-${id}`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="relative flex items-stretch">
        <div
          id={id}
          className={cn(
            "min-w-[200px] grow overflow-hidden rounded-s-md border border-e-0 border-border font-mono text-sm",
            '[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:border-none [&>pre]:bg-transparent',
            mounted && (theme === "dark" ? "dark" : "light")
          )}
        >
          {highlightedCode ? (
            <div
              className="[&>pre]:h-full [&>pre]:overflow-x-auto [&>pre]:p-2 [&>pre]:px-3 [&>pre]:font-mono"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki needs this
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          ) : (
            <pre className="h-full p-2 px-3 font-mono">
              &nbsp;
            </pre>
          )}
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={handleCopy}
                className="relative z-10 h-auto w-auto min-w-[40px] shrink-0 rounded-s-none rounded-e-md border border-border px-3"
                aria-label={copied ? "Copied" : "Copy to clipboard"}
                disabled={!command || copied}
              >
                <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
                <Check
                  className={cn(
                    "absolute inset-0 m-auto h-4 w-4 stroke-emerald-500 transition-all",
                    copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                  aria-hidden="true"
                />
                <Copy
                  className={cn(
                    "absolute inset-0 m-auto h-4 w-4 transition-all",
                    copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                  )}
                  aria-hidden="true"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              {copied ? "Copied!" : "Copy to clipboard"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
