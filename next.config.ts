import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep development and production output isolated so a production build
  // cannot replace chunks underneath a running development server.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default nextConfig;
