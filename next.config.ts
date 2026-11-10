import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/work': ['./content/projects/**/*.json'],
    '/work/*': ['./content/projects/**/*.json'],
    '/insights': ['./content/insights/**/*.json'],
    '/insights/*': ['./content/insights/**/*.json'],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
