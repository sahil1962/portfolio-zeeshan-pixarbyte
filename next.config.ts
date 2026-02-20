import type { NextConfig } from "next";
import { config } from 'dotenv';

// Load environment variables from .env file
// This is crucial for Hostinger deployment where Passenger doesn't auto-load .env
config();

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner'],
  // Empty turbopack config to silence the webpack warning
  turbopack: {},
};

export default nextConfig;
