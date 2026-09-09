import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  transpilePackages: ["three"],
  ...(githubPages
    ? {
        basePath: "/domus",
        assetPrefix: "/domus",
      }
    : {}),
};

export default nextConfig;
