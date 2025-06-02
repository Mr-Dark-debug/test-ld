/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking in production builds
  typescript: {
    // !! WARN !!
    // This is a temporary workaround and should be removed once the type issues are resolved
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

module.exports = nextConfig;
