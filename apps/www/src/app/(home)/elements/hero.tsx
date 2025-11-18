import Link from "next/link";
import { memo } from "react";
import { PixelBlast } from "@/app/(home)/elements/pixel-blast";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layouts/global";
import { Button } from "@/registry/default/ui/button";

export const Hero = memo(function _Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <PixelBlast color="var(--primary)" variant="square" />
      <div className="flex flex-col gap-6">
        <PageHeader className="relative">
          <PageHeaderHeading className="max-w-4xl! text-7xl!">
            <span className="flex items-baseline gap-2 font-serif sm:gap-3">
              <span className="font-bold leading-[0.95] tracking-[-0.03em]">
                Audio
              </span>
              <span className="font-normal font-waldenburg tracking-[-0.02em] opacity-90">
                UI
              </span>
            </span>
          </PageHeaderHeading>
          <PageHeaderDescription>
            Acollection of accessible, and composable Audio UI React components.
            Built on top of shadcn/ui and styled with Tailwind CSS.
          </PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/docs/components">View Components</Link>
            </Button>
          </PageActions>
        </PageHeader>
      </div>
    </section>
  );
});
