import type { Item } from "fumadocs-core/page-tree";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/registry/default/ui/button";

type DocFooterProps = {
  neighbours: {
    previous?: Item;
    next?: Item;
  };
};

export function DocFooter({ neighbours }: DocFooterProps) {
  return (
    <div className="flex items-center gap-2 pt-6">
      {neighbours.previous && (
        <Button asChild className="shadow-none" variant="outline">
          <Link href={neighbours.previous.url}>
            <ArrowLeftIcon /> {neighbours.previous.name}
          </Link>
        </Button>
      )}
      {neighbours.next && (
        <Button asChild className="ms-auto shadow-none" variant="outline">
          <Link href={neighbours.next.url}>
            {neighbours.next.name} <ArrowRightIcon />
          </Link>
        </Button>
      )}
    </div>
  );
}
