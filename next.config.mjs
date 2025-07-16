/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize for production builds
  swcMinify: true,
  // Increase memory limit for webpack
  experimental: {
    // Disable React strict mode to avoid double-rendering issues
    strictMode: false,
  },
}

export default nextConfig
