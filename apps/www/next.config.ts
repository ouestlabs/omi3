import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  transpilePackages: ["audio-ui"],
  async redirects() {
    return await [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return await [
      {
        source: "/docs/:path*.md",
        destination: "/api/raw/docs/:path*",
      },
    ];
  },
};

export default withMDX(nextConfig);
