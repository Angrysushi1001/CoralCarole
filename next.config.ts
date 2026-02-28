import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'your-id.supabase.co', // REPLACE WITH YOUR ACTUAL SUPABASE HOST
      },
    ],
  },
};