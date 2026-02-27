import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Changed from via.placeholder.com
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;