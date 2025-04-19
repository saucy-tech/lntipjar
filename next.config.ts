import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    APP_MODE: process.env.USE_REAL_LNBITS === 'true' ? 'real' : 'mock',
  },
};

export default nextConfig;