import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    registry: ["./src/registry/**/*"],
  }
};

export default nextConfig;
