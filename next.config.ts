import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  poweredByHeader: false,
  compress: true,
  // Rendered pages kept in memory (Next's default is 50 MB). Small servers set NEXT_CACHE_MAX_MEMORY
  // (bytes) lower; pages then come from the on-disk cache instead.
  cacheMaxMemorySize: Number(process.env.NEXT_CACHE_MAX_MEMORY ?? 50 * 1024 * 1024),
  experimental: {
    devtoolSegmentExplorer: false,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-navigation-menu"],
    // Lower peak memory while building (matters when Coolify builds on the same server).
    webpackMemoryOptimizations: true,
    ...(process.env.NEXT_BUILD_CPUS ? { cpus: Number(process.env.NEXT_BUILD_CPUS) } : {}),
  },
  images: {
    // WebP for every browser that takes it (others get the original). AVIF is a little smaller but
    // takes far more memory and CPU to encode, so it is only used where NEXT_IMAGE_AVIF=true.
    formats: process.env.NEXT_IMAGE_AVIF === "true" ? ["image/avif", "image/webp"] : ["image/webp"],
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
    // Baseline security headers on every response. The CSP only restricts framing, so the
    // site (and /admin) can't be embedded by other sites for clickjacking.
    const security = [
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/images/:path*", headers: longCache },
      { source: "/documents/:path*", headers: longCache },
      { source: "/magazines/:path*", headers: longCache },
      { source: "/fact-sheet/:path*", headers: longCache },
      { source: "/brochure/:path*", headers: longCache },
      { source: "/infographics/:path*", headers: longCache },
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
