import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  // Empty turbopack config to silence the webpack warning
  turbopack: {},
};

export default nextConfig;
