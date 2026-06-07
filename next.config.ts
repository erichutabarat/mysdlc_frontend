import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const backendUrl = isDev ? 'http://localhost:8080' : 'http://backend:8080';

const nextConfig: NextConfig = {
  trailingSlash: false,
  allowedDevOrigins: ['192.168.1.31', '127.0.0.1'],
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
