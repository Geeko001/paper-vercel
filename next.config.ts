import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Tree-shake icon imports so lucide-react ships only what's used.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
