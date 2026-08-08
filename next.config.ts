import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Local development uses .next-dev; production keeps Next.js' standard
  // .next output so deployment adapters such as Vercel can discover it.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default nextConfig;
