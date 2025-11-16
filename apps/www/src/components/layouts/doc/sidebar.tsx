"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PAGES_NEW } from "@/lib/docs";
import type { source } from "@/lib/source";
import { Badge } from "@/registry/default/ui/badge";

function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname();

  return (
    <Sidebar
      className="sticky top-(--header-height) z-30 hidden h-[calc(100svh-var(--header-height))] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="no-scrollbar px-4 py-2">
        <div className="h-(--top-spacing) shrink-0" />
        {tree.children.map((item) => (
          <SidebarGroup className="gap-1" key={item.$id}>
            <SidebarGroupLabel className="h-7 px-0 text-sidebar-accent-foreground">
              {item.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {item.type === "folder" && (
                <SidebarMenu className="gap-0.5">
                  {item.children.map(
                    (i) =>
                      i.type === "page" && (
                        <SidebarMenuItem key={i.url}>
                          <SidebarMenuButton
                            asChild
                            className="from-secondary to-secondary/64 ps-3.5 text-sidebar-foreground/64 hover:bg-transparent active:bg-transparent data-[active=true]:bg-linear-to-tr"
                            isActive={i.url === pathname}
                          >
                            <Link
                              className="flex items-center justify-between gap-2"
                              href={i.url}
                            >
                              {i.name}
                              {PAGES_NEW.includes(i.url) && <Badge>New</Badge>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                  )}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export { DocsSidebar };
