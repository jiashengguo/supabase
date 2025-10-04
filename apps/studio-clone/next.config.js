/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  transpilePackages: ['ui', 'ui-patterns', 'common'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/editor',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
