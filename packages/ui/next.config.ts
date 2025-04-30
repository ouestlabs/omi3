import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    registry: ["./src/registry/**/*"],
  }
};

export default nextConfig;
