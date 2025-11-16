import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-0.5">
      <p>
        <Link className="font-heading text-lg" href="/">
          audio/<span className="text-muted-foreground/64">ui</span>
        </Link>
      </p>
      <p className="text-muted-foreground text-sm">
        Built by{" "}
        <a
          className="font-semibold hover:underline"
          href="https://github.com/lucien-loua"
          rel="noopener noreferrer"
          target="_blank"
        >
          lU
        </a>
        , the source code is available on{" "}
        <a
          className="font-semibold hover:underline"
          href="https://github.com/lucien-loua/audio-ui"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
