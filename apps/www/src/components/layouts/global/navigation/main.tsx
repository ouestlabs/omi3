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
    <nav className={cn("items-center", className)} {...props}>
      {items.map((item) => (
        <Button
          asChild
          data-pressed={pathname.includes(item.href) || undefined}
          key={item.href}
          size="sm"
          variant="ghost"
        >
          <Link
            className={cn(pathname.includes(item.href) && "text-primary")}
            href={item.href}
          >
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export { MainNav };
