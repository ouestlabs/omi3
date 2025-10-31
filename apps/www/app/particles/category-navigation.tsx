import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/default/ui/button";

type CategoryNavigationProps = {
  currentCategory?: string;
  categories?: Array<{ name: string; slug: string }>;
};

export function CategoryNavigation({
  currentCategory,
  categories,
}: CategoryNavigationProps) {
  return (
    <div className="mx-auto mt-4 w-full max-w-4xl">
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          className={cn(
            "rounded-md px-2 py-1",
            !currentCategory &&
              "bg-accent shadow-none! before:shadow-none! dark:bg-input dark:hover:bg-input"
          )}
          render={<Link href="/particles">All</Link>}
          size="xs"
          variant="outline"
        />
        {categories?.map((cat) => {
          const isActive = cat.slug === currentCategory;
          return (
            <Button
              className={cn(
                "rounded-md px-2 py-1 capitalize",
                isActive &&
                  "bg-accent shadow-none! before:shadow-none! dark:bg-input dark:hover:bg-input"
              )}
              key={cat.slug}
              render={<Link href={`/particles/${cat.slug}`} />}
              size="xs"
              variant="outline"
            >
              {cat.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
