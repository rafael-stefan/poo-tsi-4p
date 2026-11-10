import type { NextConfig } from "next";

const urlBackend = process.env.BACKEND_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${urlBackend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
