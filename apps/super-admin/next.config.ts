import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  transpilePackages: [
    "@meraresto/types",
    "@meraresto/utils",
    "@meraresto/database",
    "@meraresto/auth",
    "@meraresto/ui",
  ],
};

export default nextConfig;
