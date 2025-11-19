import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { GithubStars } from "@/components/github-starts";
import { ThemeSwitcher } from "@/components/theme/switcher";
import { appConfig } from "@/lib/config";
import { Icons } from "@/lib/icons";
import { source } from "@/lib/source";
import { Button } from "@/registry/default/ui/button";
import { Separator } from "@/registry/default/ui/separator";
import { SiteConfig } from "./config";
import { MainNav } from "./navigation/main";
import { MobileNav } from "./navigation/mobile";

function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar/80 backdrop-blur-sm">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:h-4!">
          <MobileNav
            className="flex lg:hidden"
            items={appConfig.navItems}
            tree={pageTree}
          />
          <Button asChild className="hidden lg:flex" size="sm" variant="ghost">
            <Link
              aria-label="Home"
              className="flex items-center sm:pl-1"
              href={"/"}
            >
              <div
                aria-hidden
                className="flex shrink-0 select-none items-center justify-center gap-1 text-muted-foreground"
              >
                <Icons.audioUi className="pointer-events-none size-4 text-foreground sm:size-5" />
                <p className="-mt-[2.3px] sm:-mt-[3px] text-balance font-medium font-serif text-xl leading-snug sm:text-2xl">
                  {appConfig.name}
                </p>
              </div>
            </Link>
          </Button>
          <MainNav className="hidden lg:flex" items={appConfig.navItems} />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu navItems={appConfig.navItems} tree={pageTree} />
            </div>
            <Separator className="hidden lg:block" orientation="vertical" />
            <GithubStars />
            <Separator className="3xl:flex hidden" orientation="vertical" />
            <SiteConfig className="3xl:flex hidden" />
            <Separator orientation="vertical" />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
