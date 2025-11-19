"use client";

import template from "lodash/template";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import React from "react";
import { copyToClipboardWithMeta } from "@/components/copy-button";
import { useThemeConfig } from "@/components/theme/active";
import { Icons } from "@/lib/icons";
import { THEMES } from "@/lib/themes";
import {
  type BaseColor,
  baseColors,
  baseColorsOKLCH,
} from "@/registry/base-colors";
import { useIsMobile } from "@/registry/default/hooks/use-mobile";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";
import { Label } from "@/registry/default/ui/label";
import { ScrollArea, ScrollBar } from "@/registry/default/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs";

type BaseColorOKLCH = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

export function ThemeCustomizer({ className }: React.ComponentProps<"div">) {
  const { activeTheme = "neutral", setActiveTheme } = useThemeConfig();

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <ScrollArea className="hidden max-w-[96%] md:max-w-[600px] lg:flex lg:max-w-none">
        <div className="flex items-center">
          {THEMES.map((theme) => (
            <Button
              className="flex h-7 cursor-pointer items-center justify-center px-4 text-center font-medium text-base text-muted-foreground capitalize transition-colors hover:text-primary hover:no-underline data-[active=true]:text-primary"
              data-active={activeTheme === theme.name}
              key={theme.name}
              onClick={() => setActiveTheme(theme.name)}
              size="sm"
              variant="link"
            >
              {theme.name === "neutral" ? "Default" : theme.name}
            </Button>
          ))}
        </div>
        <ScrollBar className="invisible" orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center gap-2 lg:hidden">
        <Label className="sr-only" htmlFor="theme-selector">
          Theme
        </Label>
        <Select
          onValueChange={setActiveTheme}
          value={activeTheme === "default" ? "neutral" : activeTheme}
        >
          <SelectTrigger
            className="justify-start capitalize shadow-none *:data-[slot=select-value]:w-12 *:data-[slot=select-value]:capitalize"
            id="theme-selector"
            size="sm"
          >
            <span className="font-medium">Theme:</span>
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              {THEMES.map((theme) => (
                <SelectItem
                  className="capitalize data-[state=checked]:opacity-50"
                  key={theme.name}
                  value={theme.name}
                >
                  {theme.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <CopyCodeButton className="ml-auto" size="sm" variant="secondary" />
    </div>
  );
}

export function CopyCodeButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  let { activeTheme: activeThemeName = "neutral" } = useThemeConfig();
  activeThemeName = activeThemeName === "default" ? "neutral" : activeThemeName;
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Drawer onOpenChange={setOpen} open={open && isMobile}>
        <DrawerTrigger asChild>
          <Button className={cn("sm:hidden", className)} {...props}>
            Copy Code
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-auto">
          <DrawerHeader>
            <DrawerTitle className="capitalize">{activeThemeName}</DrawerTitle>
            <DrawerDescription>
              Copy and paste the following code into your CSS file.
            </DrawerDescription>
          </DrawerHeader>
          <CustomizerCode themeName={activeThemeName} />
        </DrawerContent>
      </Drawer>
      <Dialog onOpenChange={setOpen} open={open && !isMobile}>
        <DialogTrigger asChild>
          <Button
            className={cn("group/button hidden sm:flex", className)}
            data-size={props.size}
            {...props}
          >
            <CopyIcon />
            <span className="group-data-[size=icon-sm]/button:sr-only">
              Copy Code
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-xl border-none bg-clip-padding shadow-2xl outline-none ring-4 ring-neutral-200/80 md:max-w-2xl dark:bg-neutral-800 dark:ring-neutral-900">
          <DialogHeader>
            <DialogTitle className="capitalize">{activeThemeName}</DialogTitle>
            <DialogDescription>
              Copy and paste the following code into your CSS file.
            </DialogDescription>
          </DialogHeader>
          <CustomizerCode themeName={activeThemeName} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CustomizerCode({ themeName }: { themeName: string }) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const [tailwindVersion, setTailwindVersion] = React.useState("v4-oklch");
  const activeTheme = React.useMemo(
    () => baseColors.find((theme) => theme.name === themeName),
    [themeName]
  );
  const activeThemeOKLCH = React.useMemo(
    () => baseColorsOKLCH[themeName as keyof typeof baseColorsOKLCH],
    [themeName]
  );

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  }, [hasCopied]);

  return (
    <Tabs
      className="min-w-0 px-4 pb-4 md:p-0"
      onValueChange={setTailwindVersion}
      value={tailwindVersion}
    >
      <TabsList>
        <TabsTrigger value="v4-oklch">OKLCH</TabsTrigger>
        <TabsTrigger value="v4-hsl">HSL</TabsTrigger>
        <TabsTrigger value="v3">Tailwind v3</TabsTrigger>
      </TabsList>
      <TabsContent value="v4-oklch">
        <figure
          className="mx-0! mt-0 rounded-lg"
          data-rehype-pretty-code-figure
        >
          <figcaption
            className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
            data-language="css"
            data-rehype-pretty-code-title=""
            data-theme="github-dark github-light-default"
          >
            <Icons.css className="fill-foreground" />
            app/globals.css
          </figcaption>
          <pre className="no-scrollbar max-h-[300px] min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-[slot=tabs]:p-0 has-data-highlighted-line:px-0 has-data-line-numbers:px-0 md:max-h-[450px]">
            <Button
              className="absolute top-3 right-2 z-10 size-7 bg-code text-code-foreground shadow-none hover:opacity-100 focus-visible:opacity-100"
              data-slot="copy-button"
              onClick={() => {
                copyToClipboardWithMeta(
                  getThemeCodeOKLCH(activeThemeOKLCH, 0.65)
                );
                setHasCopied(true);
              }}
              size="icon"
              variant="ghost"
            >
              <span className="sr-only">Copy</span>
              {hasCopied ? <CopyCheckIcon /> : <CopyIcon />}
            </Button>
            <code data-language="css" data-line-numbers>
              <span className="line text-code-foreground" data-line>
                &nbsp;:root &#123;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;&nbsp;&nbsp;--radius: 0.65rem;
              </span>
              {Object.entries(activeThemeOKLCH?.light).map(([key, value]) => (
                <span className="line text-code-foreground" data-line key={key}>
                  &nbsp;&nbsp;&nbsp;--{key}: <ColorIndicator color={value} />{" "}
                  {value}
                </span>
              ))}
              <span className="line text-code-foreground" data-line>
                &nbsp;&#125;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;.dark &#123;
              </span>
              {Object.entries(activeThemeOKLCH?.dark).map(([key, value]) => (
                <span className="line text-code-foreground" data-line key={key}>
                  &nbsp;&nbsp;&nbsp;--{key}: <ColorIndicator color={value} />{" "}
                  {value}
                </span>
              ))}
              <span className="line text-code-foreground" data-line>
                &nbsp;&#125;
              </span>
            </code>
          </pre>
        </figure>
      </TabsContent>
      <TabsContent value="v4-hsl">
        <figure
          className="mx-0! mt-0 rounded-lg"
          data-rehype-pretty-code-figure
        >
          <figcaption
            className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
            data-language="css"
            data-rehype-pretty-code-title=""
            data-theme="github-dark github-light-default"
          >
            <Icons.css className="fill-foreground" />
            app/globals.css
          </figcaption>
          <pre className="no-scrollbar max-h-[300px] min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-[slot=tabs]:p-0 has-data-highlighted-line:px-0 has-data-line-numbers:px-0 md:max-h-[450px]">
            <Button
              className="absolute top-3 right-2 z-10 size-7 bg-code text-code-foreground shadow-none hover:opacity-100 focus-visible:opacity-100"
              data-slot="copy-button"
              onClick={() => {
                copyToClipboardWithMeta(getThemeCodeHSLV4(activeTheme, 0.65));
                setHasCopied(true);
              }}
              size="icon"
              variant="ghost"
            >
              <span className="sr-only">Copy</span>
              {hasCopied ? <CopyCheckIcon /> : <CopyIcon />}
            </Button>
            <code data-language="css" data-line-numbers>
              <span className="line text-code-foreground" data-line>
                &nbsp;:root &#123;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;&nbsp;&nbsp;--radius: 0.65rem;
              </span>
              {Object.entries(activeTheme?.cssVars.light || {}).map(
                ([key, value]) => (
                  <span
                    className="line text-code-foreground"
                    data-line
                    key={key}
                  >
                    &nbsp;&nbsp;&nbsp;--{key}:{" "}
                    <ColorIndicator color={`hsl(${value})`} /> hsl({value});
                  </span>
                )
              )}
              <span className="line text-code-foreground" data-line>
                &nbsp;&#125;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;
              </span>
              <span className="line text-code-foreground" data-line>
                &nbsp;.dark &#123;
              </span>
              {Object.entries(activeTheme?.cssVars.dark || {}).map(
                ([key, value]) => (
                  <span
                    className="line text-code-foreground"
                    data-line
                    key={key}
                  >
                    &nbsp;&nbsp;&nbsp;--{key}:{" "}
                    <ColorIndicator color={`hsl(${value})`} /> hsl({value});
                  </span>
                )
              )}
              <span className="line text-code-foreground" data-line>
                &nbsp;&#125;
              </span>
            </code>
          </pre>
        </figure>
      </TabsContent>
      <TabsContent value="v3">
        <figure
          className="mx-0! mt-0 rounded-lg"
          data-rehype-pretty-code-figure
        >
          <figcaption
            className="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70"
            data-language="css"
            data-rehype-pretty-code-title=""
            data-theme="github-dark github-light-default"
          >
            <Icons.css className="fill-foreground" />
            app/globals.css
          </figcaption>
          <pre className="no-scrollbar max-h-[300px] min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-data-[slot=tabs]:p-0 has-data-highlighted-line:px-0 has-data-line-numbers:px-0 md:max-h-[450px]">
            <Button
              className="absolute top-3 right-2 z-10 size-7 bg-code text-code-foreground shadow-none hover:opacity-100 focus-visible:opacity-100"
              data-slot="copy-button"
              onClick={() => {
                copyToClipboardWithMeta(getThemeCode(activeTheme, 0.5));
                setHasCopied(true);
              }}
              size="icon"
              variant="ghost"
            >
              <span className="sr-only">Copy</span>
              {hasCopied ? <CopyCheckIcon /> : <CopyIcon />}
            </Button>
            <code data-language="css" data-line-numbers>
              <span className="line" data-line>
                @layer base &#123;
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;:root &#123;
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.light.background})`}
                />{" "}
                {activeTheme?.cssVars.light.background}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.light.foreground})`}
                />{" "}
                {activeTheme?.cssVars.light.foreground}
              </span>
              {[
                "card",
                "popover",
                "primary",
                "secondary",
                "muted",
                "accent",
                "destructive",
              ].map((prefix) => (
                <React.Fragment key={prefix}>
                  <span className="line" data-line>
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                    <ColorIndicator
                      color={`hsl(${
                        activeTheme?.cssVars.light[
                          prefix as keyof typeof activeTheme.cssVars.light
                        ]
                      })`}
                    />{" "}
                    {
                      activeTheme?.cssVars.light[
                        prefix as keyof typeof activeTheme.cssVars.light
                      ]
                    }
                    ;
                  </span>
                  <span className="line" data-line>
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                    <ColorIndicator
                      color={`hsl(${
                        activeTheme?.cssVars.light[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                        ]
                      })`}
                    />{" "}
                    {
                      activeTheme?.cssVars.light[
                        `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                      ]
                    }
                    ;
                  </span>
                </React.Fragment>
              ))}
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.light.border})`}
                />{" "}
                {activeTheme?.cssVars.light.border}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.light.input})`}
                />{" "}
                {activeTheme?.cssVars.light.input}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.light.ring})`}
                />{" "}
                {activeTheme?.cssVars.light.ring}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--radius: 0.5rem;
              </span>
              {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                (prefix) => (
                  <React.Fragment key={prefix}>
                    <span className="line" data-line>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      <ColorIndicator
                        color={`hsl(${
                          activeTheme?.cssVars.light[
                            prefix as keyof typeof activeTheme.cssVars.light
                          ]
                        })`}
                      />{" "}
                      {
                        activeTheme?.cssVars.light[
                          prefix as keyof typeof activeTheme.cssVars.light
                        ]
                      }
                      ;
                    </span>
                  </React.Fragment>
                )
              )}
              <span className="line" data-line>
                &nbsp;&nbsp;&#125;
              </span>
              <span className="line" data-line>
                &nbsp;
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;.dark &#123;
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.dark.background})`}
                />{" "}
                {activeTheme?.cssVars.dark.background}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.dark.foreground})`}
                />{" "}
                {activeTheme?.cssVars.dark.foreground}
              </span>
              {[
                "card",
                "popover",
                "primary",
                "secondary",
                "muted",
                "accent",
                "destructive",
              ].map((prefix) => (
                <React.Fragment key={prefix}>
                  <span className="line" data-line>
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                    <ColorIndicator
                      color={`hsl(${
                        activeTheme?.cssVars.dark[
                          prefix as keyof typeof activeTheme.cssVars.dark
                        ]
                      })`}
                    />{" "}
                    {
                      activeTheme?.cssVars.dark[
                        prefix as keyof typeof activeTheme.cssVars.dark
                      ]
                    }
                    ;
                  </span>
                  <span className="line" data-line>
                    &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                    <ColorIndicator
                      color={`hsl(${
                        activeTheme?.cssVars.dark[
                          `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                        ]
                      })`}
                    />{" "}
                    {
                      activeTheme?.cssVars.dark[
                        `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                      ]
                    }
                    ;
                  </span>
                </React.Fragment>
              ))}
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.dark.border})`}
                />{" "}
                {activeTheme?.cssVars.dark.border}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.dark.input})`}
                />{" "}
                {activeTheme?.cssVars.dark.input}
              </span>
              <span className="line" data-line>
                &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
                <ColorIndicator
                  color={`hsl(${activeTheme?.cssVars.dark.ring})`}
                />{" "}
                {activeTheme?.cssVars.dark.ring}
              </span>
              {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].map(
                (prefix) => (
                  <React.Fragment key={prefix}>
                    <span className="line" data-line>
                      &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                      <ColorIndicator
                        color={`hsl(${
                          activeTheme?.cssVars.dark[
                            prefix as keyof typeof activeTheme.cssVars.dark
                          ]
                        })`}
                      />{" "}
                      {
                        activeTheme?.cssVars.dark[
                          prefix as keyof typeof activeTheme.cssVars.dark
                        ]
                      }
                      ;
                    </span>
                  </React.Fragment>
                )
              )}
              <span className="line" data-line>
                &nbsp;&nbsp;&#125;
              </span>
              <span className="line" data-line>
                &#125;
              </span>
            </code>
          </pre>
        </figure>
      </TabsContent>
    </Tabs>
  );
}

function ColorIndicator({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-3 border border-border/50"
      style={{ backgroundColor: color }}
    />
  );
}

function getThemeCodeOKLCH(theme: BaseColorOKLCH | undefined, radius: number) {
  if (!theme) {
    return "";
  }

  const rootSection =
    ":root {\n  --radius: " +
    radius +
    "rem;\n" +
    Object.entries(theme.light)
      .map((entry) => `  --${entry[0]}: ${entry[1]};`)
      .join("\n") +
    "\n}\n\n.dark {\n" +
    Object.entries(theme.dark)
      .map((entry) => `  --${entry[0]}: ${entry[1]};`)
      .join("\n") +
    "\n}\n";

  return rootSection;
}

function getThemeCode(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return "";
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius: radius.toString(),
  });
}

function getThemeCodeHSLV4(theme: BaseColor | undefined, radius: number) {
  if (!theme) {
    return "";
  }

  const rootSection =
    ":root {\n  --radius: " +
    radius +
    "rem;\n" +
    Object.entries(theme.cssVars.light)
      .map((entry) => `  --${entry[0]}: hsl(${entry[1]});`)
      .join("\n") +
    "\n}\n\n.dark {\n" +
    Object.entries(theme.cssVars.dark)
      .map((entry) => `  --${entry[0]}: hsl(${entry[1]});`)
      .join("\n") +
    "\n}\n";

  return rootSection;
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}
`;
