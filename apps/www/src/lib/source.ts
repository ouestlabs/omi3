import { docs } from "@source/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { absoluteUrl, appConfig } from "@/lib/config";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title}\n\n${processed}`;
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export function getMarkdownUrl(page: InferPageType<typeof source>): string {
  return absoluteUrl(`${page.url}.md`);
}

function findFolderForPage(
  tree: typeof source.pageTree,
  targetUrl: string
): { name: string; isIndex: boolean } | null {
  for (const child of tree.children) {
    if (child.type !== "folder") {
      continue;
    }

    const hasMatchingPage = child.children.some(
      (item) => item.type === "page" && item.url === targetUrl
    );

    if (hasMatchingPage) {
      return {
        name: String(child.name),
        isIndex: child.children.length > 1,
      };
    }

    const result = findFolderForPage(
      { children: child.children } as typeof source.pageTree,
      targetUrl
    );
    if (result) {
      return result;
    }
  }
  return null;
}

export function getGitHubUrl(page: InferPageType<typeof source>): string {
  const folderInfo = findFolderForPage(source.pageTree, page.url);
  const isInRootFolder = folderInfo?.name === "Overview";

  if (isInRootFolder) {
    const filename = page.slugs.length === 0 ? "index" : page.slugs.at(-1);
    return `${`${appConfig.links.github}/blob/main/apps/www/src/content/docs`}/(root)/${filename}.mdx`;
  }

  const path = page.slugs.join("/");
  const filename = folderInfo?.isIndex ? `${path}/index` : path;
  return `${`${appConfig.links.github}/blob/main/apps/www/src/content/docs`}/${filename}.mdx`;
}
