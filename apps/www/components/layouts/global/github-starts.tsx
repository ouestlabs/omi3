"use client";
import { SiGithub } from "react-icons/si";
import { useGithubStars } from "@/hooks/use-github";
import { Button } from "@/registry/default/ui/button";

function GithubStars() {
  const { stargazersCount } = useGithubStars("ouestlabs", "omi3");

  return (
    <Button
      render={
        <a
          aria-label="GitHub"
          href="https://github.com/ouestlabs/omi3"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub />
          {stargazersCount}
        </a>
      }
      variant="outline"
    />
  );
}

export { GithubStars };
