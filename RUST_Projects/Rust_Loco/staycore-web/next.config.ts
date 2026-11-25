import type { NextConfig } from "next";

/** Loco origin. Browser calls stay on `/api/*`; Next rewrites them here. */
function locoApiOrigin(): string {
  const raw = process.env.LOCO_API_URL ?? "http://localhost:5150";
  return raw.replace(/\/+$/, "");
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${locoApiOrigin()}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;