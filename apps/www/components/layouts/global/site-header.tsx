import { Logo } from "audio-ui/assets";
import { ThemeToggler } from "audio-ui/theme";
import Link from "next/link";
import { CommandMenu } from "@/components/command-menu";
import { MainNav } from "@/components/layouts/global/navigation/main";
import { MobileNav } from "@/components/layouts/global/navigation/mobile";
import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";
import { Separator } from "@/registry/default/ui/separator";
import { GithubStars } from "./github-starts";

function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="sticky top-0 z-5 w-full bg-sidebar/80 backdrop-blur-sm before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border/50">
      <div className="container relative flex h-(--header-height) w-full items-center justify-between gap-2 px-4 sm:px-6">
        <MobileNav
          className="flex lg:hidden"
          items={appConfig.navItems}
          tree={pageTree}
        />
        <div className="-mt-0.5 flex shrink-0 items-center gap-1 font-heading text-2xl sm:text-[1.625em]">
          <Link
            aria-label="Home"
            className="flex items-center gap-1"
            href={"/"}
          >
            <Logo.AudioUI className="mt-1.5 hidden lg:block" />
            audio /<span className="text-muted-foreground/64"> ui</span>
          </Link>
        </div>
        <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <MainNav className="hidden lg:flex" items={appConfig.navItems} />
          <div className="mx-2 hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu navItems={appConfig.navItems} tree={pageTree} />
          </div>
          <Separator className="h-5 max-md:hidden" orientation="vertical" />
          <GithubStars />
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
