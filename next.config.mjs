/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'linkpeakk.localhost.com',
      },
      {
        protocol: 'https',
        hostname: 'upcdn.duckdns.org',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '43.205.71.207',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  // Compress pages for better performance
  compress: true,
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "framer-motion",
      "lodash",
      "recharts",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "date-fns"
    ],
  },
};

export default nextConfig;
