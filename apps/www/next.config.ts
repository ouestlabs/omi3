import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.md",
        destination: "/api/raw/docs/:path*",
      },
    ];
  },
};

export default withMDX(nextConfig);
