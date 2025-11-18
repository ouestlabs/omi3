import { findNeighbour } from "fumadocs-core/page-tree";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsCopyPage } from "@/components/layouts/doc/copy-page";
import { DocsTableOfContents } from "@/components/layouts/doc/toc";
import { SiteFooter } from "@/components/layouts/global/site-footer";
import { absoluteUrl } from "@/lib/config";
import { createMetadata } from "@/lib/metadata";
import {
  getGitHubUrl,
  getMarkdownUrl,
  getPageImage,
  source,
} from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { Button } from "@/registry/default/ui/button";

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/docs/[[...slug]]">) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) {
    return createMetadata({
      title: "Not Found",
    });
  }

  const doc = page.data;

  const description =
    doc.description ?? "A collection of composable Audio UI components";

  const image = {
    url: getPageImage(page).url,
  };

  return createMetadata({
    title: doc.title,
    description,
    openGraph: {
      url: page.url,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const doc = page.data;
  const rawContent = await page.data.getText("raw");
  const MDX = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url, {
    separateRoot: false,
  });

  const links = doc.links;

  return (
    <div
      className="flex min-h-[calc(100vh-var(--header-height)+5px)] items-stretch sm:text-[.9375rem] xl:w-full"
      data-slot="docs"
    >
      <div className="relative mb-16 flex min-w-0 flex-1 flex-col bg-muted/50 sm:mb-15 lg:my-8 lg:mr-4 lg:rounded-2xl lg:border">
        <div className="-m-px flex flex-1 flex-col bg-background p-6 lg:rounded-2xl lg:border">
          <div className="mx-auto flex w-full flex-1 flex-col lg:max-w-4xl">
            <div className="flex flex-1 flex-col gap-8 pb-16 sm:pb-0">
              <div className="flex flex-col gap-2">
                <div className="flex grow items-start justify-between">
                  <h1 className="scroll-m-20 font-heading text-3xl xl:text-4xl">
                    {doc.title}
                  </h1>
                  <div className="docs-nav fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-border/50 border-t bg-background/80 px-6 py-4 backdrop-blur-sm lg:static lg:z-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pt-1.5 lg:backdrop-blur-none">
                    <DocsCopyPage
                      githubUrl={getGitHubUrl(page)}
                      markdownUrl={getMarkdownUrl(page)}
                      page={rawContent}
                      url={absoluteUrl(page.url)}
                    />
                    {neighbours.previous && (
                      <Button
                        asChild
                        className="extend-touch-target ml-auto"
                        size="icon-sm"
                        variant="outline"
                      >
                        <Link href={neighbours.previous.url}>
                          <ArrowLeftIcon />
                          <span className="sr-only">Previous</span>
                        </Link>
                      </Button>
                    )}
                    {neighbours.next && (
                      <Button
                        asChild
                        className="extend-touch-target"
                        size="icon-sm"
                        variant="outline"
                      >
                        <Link href={neighbours.next.url}>
                          <span className="sr-only">Next</span>
                          <ArrowRightIcon />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                {doc.description && (
                  <p className="text-muted-foreground sm:text-lg">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  {links?.doc && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={links.doc} rel="noreferrer" target="_blank">
                        <ArrowUpRightIcon />
                        Docs
                      </Link>
                    </Button>
                  )}
                  {links?.api && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={links.api} rel="noreferrer" target="_blank">
                        <ArrowUpRightIcon />
                        API Reference
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
                <MDX components={getMDXComponents()} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-6">
              {neighbours.previous && (
                <Button asChild className="shadow-none" variant="outline">
                  <Link href={neighbours.previous.url}>
                    <ArrowLeftIcon /> {neighbours.previous.name}
                  </Link>
                </Button>
              )}
              {neighbours.next && (
                <Button
                  asChild
                  className="ms-auto shadow-none"
                  variant="outline"
                >
                  <Link href={neighbours.next.url}>
                    {neighbours.next.name} <ArrowRightIcon />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-6 lg:rounded-b-2xl lg:px-8">
          <SiteFooter />
        </div>
      </div>
      <div className="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <div className="no-scrollbar flex min-h-0 flex-col gap-2 overflow-y-auto py-2">
          <div className="h-(--top-spacing) shrink-0" />
          {doc.toc?.length ? <DocsTableOfContents toc={doc.toc} /> : null}
        </div>
      </div>
    </div>
  );
}
