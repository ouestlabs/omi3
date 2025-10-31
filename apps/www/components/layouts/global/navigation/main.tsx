"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";

function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("items-center gap-2", className)} {...props}>
      {items.map((item) => (
        <Button
          data-pressed={pathname.includes(item.href) || undefined}
          key={item.href}
          render={
            <Link
              className={cn(pathname.includes(item.href) && "text-primary")}
              href={item.href}
            />
          }
          variant="ghost"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}

export { MainNav };
