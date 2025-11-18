"use client";
import { useGithubStars } from "@/hooks/use-github";
import { Icons } from "@/lib/icons";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";

import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/default/ui/button-group";
import { Skeleton } from "@/registry/default/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

function GithubStars() {
  const { stargazersCount, isLoading } = useGithubStars("ouestlabs", "omi3");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ButtonGroup>
          <Button asChild size="icon-sm" variant="outline">
            <a
              aria-label="GitHub"
              href="https://github.com/ouestlabs/audio-ui"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.github />
            </a>
          </Button>
          <ButtonGroupText
            className={cn(
              "tabular-num relative text-muted-foreground",
              isLoading && "px-0.5"
            )}
          >
            {isLoading ? (
              <Skeleton className="h-6.5 w-11 rounded-s-none rounded-e" />
            ) : (
              new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(stargazersCount)
            )}
          </ButtonGroupText>
        </ButtonGroup>
      </TooltipTrigger>
      <TooltipContent className="font-sans">
        {new Intl.NumberFormat("en-US").format(stargazersCount)} stars
      </TooltipContent>
    </Tooltip>
  );
}

export { GithubStars };
