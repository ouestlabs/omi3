import { docs } from "@source/server";
import { type InferPageType, loader } from "fumadocs-core/source";
export const source = loader({
  baseUrl: "/docs",
  source:  docs.toFumadocsSource(),
});

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
