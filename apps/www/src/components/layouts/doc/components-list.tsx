import Link from "next/link";

import { PAGES_NEW } from "@/lib/docs";
import { source } from "@/lib/source";

export function ComponentsList() {
  const components = source.pageTree.children.find(
    (page) => page.name === "Components"
  );

  if (components?.type !== "folder") {
    return null;
  }

  const list = components.children.filter(
    (component) => component.type === "page"
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {list.map((component) => (
        <Link
          className="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline md:text-base"
          href={component.url}
          key={component.$id}
        >
          {component.name}
          {PAGES_NEW.includes(component.url) && (
            <span className="flex size-2 rounded-full bg-primary" title="New" />
          )}
        </Link>
      ))}
    </div>
  );
}
