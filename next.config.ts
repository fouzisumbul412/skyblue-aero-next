import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  },
  serverExternalPackages: ['prisma', '@prisma/client'],
  outputFileTracingExcludes: {
    '*': [
      './public/**/*', 
      './node_modules/@prisma/engines/**/*',
      './node_modules/.prisma/client/libquery_engine-*'
    ],
  },
};

export default nextConfig;
