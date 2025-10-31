import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-0.5">
      <p>
        <Link className="font-heading text-lg" href="/">
          audio <span className="text-muted-foreground/64">ui</span>
        </Link>
      </p>
      <p className="text-muted-foreground text-sm">
        built with ❤️ by{" "}
        <a
          className="font-semibold hover:underline"
          href="https://github.com/ouestlabs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ouest Labs
        </a>
      </p>
    </footer>
  );
}
