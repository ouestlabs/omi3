import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-0.5 group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0">
      <p>
        <Link className="font-heading text-lg" href="/">
          audio/<span className="text-muted-foreground/64">ui</span>
        </Link>
      </p>
      <p className="text-muted-foreground text-sm">
        Built by{" "}
        <a
          className="font-semibold hover:underline"
          href="https://github.com/ouestlabs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ouest Labs
        </a>
        , the source code is available on{" "}
        <a
          className="font-semibold hover:underline"
          href="https://github.com/ouestlabs/audio-ui"
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
