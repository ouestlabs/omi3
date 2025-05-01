import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    registry: ["./src/registry/**/*"],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

export default withMDX(nextConfig);
