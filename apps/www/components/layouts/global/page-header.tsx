import { cn } from "audio-ui/lib/utils";

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={className} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center gap-2 px-0 py-8 text-center md:py-12 lg:py-16 xl:gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn("font-heading text-4xl lg:text-5xl", className)}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground lg:text-lg", className)}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading };
