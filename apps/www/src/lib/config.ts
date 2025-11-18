export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export const appConfig = Object.freeze({
  name: "audio/ui",
  url: baseUrl.origin,
  ogImage: `${baseUrl.origin}/opengraph-image`,
  description:
    "A set of composable Audio UI components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.",
  links: Object.freeze({
    twitter: "https://x.com/ouestlabs",
    github: "https://github.com/ouestlabs/audio-ui",
  }),
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/particles",
      label: "Particles",
    },
  ],
});

export function absoluteUrl(path: string) {
  return `${baseUrl.origin}${path}`;
}
