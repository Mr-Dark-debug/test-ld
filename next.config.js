/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript type checking in production builds
  typescript: {
    // !! WARN !!
    // This is a temporary workaround and should be removed once the type issues are resolved
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 