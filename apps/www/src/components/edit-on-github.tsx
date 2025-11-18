import { appConfig } from "@/lib/config";
import { Icons } from "@/lib/icons";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";

export function EditOnGithub({
  path,
  variant = "link",
  size = "sm",
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  path: string;
}) {
  return (
    <Button
      asChild
      className={cn("h-[1.8rem]", className)}
      size={size}
      variant={variant}
      {...props}
    >
      <a
        href={`${appConfig.links.github}/blob/main/content/docs/${path}`}
        target="_blank"
      >
        Edit on GitHub <Icons.github className="size-5" />
      </a>
    </Button>
  );
}
