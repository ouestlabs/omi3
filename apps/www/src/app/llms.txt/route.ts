import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";

export const revalidate = false;

function organizePagesByGroup() {
  const pages = source.getPages();
  const groups: Record<string, Array<{ title: string; url: string }>> = {};

  for (const group of source.pageTree.children) {
    if (group.type === "folder" && group.children) {
      const groupName = typeof group.name === "string" ? group.name : "Other";
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      for (const item of group.children) {
        if (item.type === "page") {
          const page = pages.find((p) => p.url === item.url);
          if (page) {
            const itemName = typeof item.name === "string" ? item.name : "";
            groups[groupName].push({
              title: page.data.title || itemName,
              url: item.url,
            });
          }
        }
      }
    }
  }

  return groups;
}

function buildContent(groups: Record<string, Array<{ title: string; url: string }>>) {
  const baseUrl = appConfig.url;
  let content = "# audio/ui\n\n";
  content += "**audio/ui** is a collection of beautifully designed, accessible, and composable components for your React apps. Built on top of [shadcn/ui](https://ui.shadcn.com/) and styled with [Tailwind CSS](https://tailwindcss.com/), it's designed for you to copy, paste, and own.\n\n";

  for (const [groupName, groupPages] of Object.entries(groups)) {
    if (groupPages.length > 0) {
      content += `## ${groupName}\n\n`;
      
      for (const page of groupPages) {
        const fullUrl = `${baseUrl}${page.url}.md`;
        content += `- [${page.title}](${fullUrl})\n`;
      }
      
      content += "\n";
    }
  }

  return content;
}

export function GET() {
  const groups = organizePagesByGroup();
  const content = buildContent(groups);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
