import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  experimental: {
    devtoolSegmentExplorer: false,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-navigation-menu"],
  },
  images: {
    // AVIF first (smallest), then WebP; browsers that support neither get the original format.
    formats: ["image/avif", "image/webp"],
    // Optimised images are cached for 30 days on the server.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lhinigeria.org",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // Photos, documents and magazine pages rarely change: let browsers and CDNs cache them.
    const longCache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }];
    return [
      { source: "/images/:path*", headers: longCache },
      { source: "/documents/:path*", headers: longCache },
      { source: "/magazines/:path*", headers: longCache },
      { source: "/fact-sheet/:path*", headers: longCache },
      { source: "/brochure/:path*", headers: longCache },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.output = config.output || {};
      config.output.chunkLoadTimeout = 300000;
    }
    return config;
  },
};

export default nextConfig;
