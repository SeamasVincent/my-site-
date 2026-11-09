import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/insights': ['./content/insights/**/*.json'],
    '/insights/*': ['./content/insights/**/*.json'],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
