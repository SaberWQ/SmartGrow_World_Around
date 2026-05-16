/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // SmartGrow SecureAI - Next.js Configuration
  // ============================================
  
  // Standalone output для Docker
  output: 'standalone',
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Images
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'SmartGrow SecureAI',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Rewrites для проксі до Django API
  async rewrites() {
    const apiUrl = process.env.DJANGO_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ]
  },
  
  // Headers для безпеки
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
}

export default nextConfig
