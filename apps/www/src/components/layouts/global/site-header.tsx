import { AudioLines } from "lucide-react";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { GithubStars } from "@/components/github-starts";
import { ThemeToggler } from "@/components/theme";
import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { Separator } from "@/registry/default/ui/separator";
import { MainNav } from "./navigation/main";
import { MobileNav } from "./navigation/mobile";

function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="sticky top-0 z-5 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/50">
      <div className="relative flex w-full items-center justify-between gap-3 p-3">
        <MobileNav
          className="flex lg:hidden"
          items={appConfig.navItems}
          tree={pageTree}
        />
        <Link
          aria-label="Home"
          className="flex items-center sm:pl-1"
          href={"/"}
        >
          <div
            aria-hidden
            className="flex shrink-0 select-none items-center justify-center gap-1 text-muted-foreground"
          >
            <AudioLines className="pointer-events-none size-4 text-foreground sm:size-5" />
            <p className="-mt-[2.3px] sm:-mt-[3px] text-balance font-medium text-xl leading-snug sm:text-2xl">
              audio/ui
            </p>
          </div>
        </Link>

        <div className="ms-auto flex items-center gap-3 md:flex-1 md:justify-end">
          <MainNav className="hidden lg:flex" items={appConfig.navItems} />
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu navItems={appConfig.navItems} tree={pageTree} />
          </div>
          <Separator className="h-7! max-md:hidden" orientation="vertical" />
          <GithubStars />
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
