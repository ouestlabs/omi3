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
  const segments = page.slugs.length > 0 ? page.slugs : [];
  const path = segments.length > 0 ? `/${segments.join("/")}` : "";
  return {
    segments,
    url: `/og/docs${path}`,
  };
}

export function getMarkdownUrl(page: InferPageType<typeof source>): string {
  return absoluteUrl(`${page.url}.md`);
}

export function getGitHubUrl(page: InferPageType<typeof source>): string {
  const filePath = page.absolutePath ?? page.data.info.fullPath;
  return `${appConfig.links.github}/blob/main/apps/www/${filePath}`;
}
