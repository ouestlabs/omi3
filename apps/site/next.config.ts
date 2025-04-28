import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },

  transpilePackages: ['@omi3/ui', '@omi3/utils', '@omi3/audio'],
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

