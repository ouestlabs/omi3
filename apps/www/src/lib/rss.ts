import { Feed } from "feed";
import { appConfig } from "@/lib/config";
import { source } from "@/lib/source";

export function getRSS() {
  const feed = new Feed({
    title: appConfig.name,
    description: appConfig.description,
    id: `${appConfig.url}/docs`,
    link: `${appConfig.url}/docs`,
    language: "en",
    image: appConfig.ogImage ?? `${appConfig.url}/opengraph-image.png`,
    favicon: `${appConfig.url}/icon`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${appConfig.name}`,
    generator: appConfig.name,
    feedLinks: {
      rss: `${appConfig.url}/rss.xml`,
    },
  });

  for (const page of source.getPages()) {
    const href = `${appConfig.url}${page.url}`;
    const date = page.data.lastModified
      ? new Date(page.data.lastModified)
      : new Date();

    feed.addItem({
      id: href,
      title: page.data.title,
      description: page.data.description,
      link: href,
      date,
      author: [
        {
          name: appConfig.name,
          link: appConfig.links.twitter,
        },
      ],
    });
  }

  return feed.rss2();
}
