/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable instrumentation for startup environment validation
  experimental: {
    instrumentationHook: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Optimize bundle size by excluding unnecessary polyfills for modern browsers
  webpack: (config, { dev, isServer }) => {
    // Only apply optimizations in production client builds
    if (!dev && !isServer) {
      // Modern browsers don't need these polyfills
      config.resolve.alias = {
        ...config.resolve.alias,
      };

      // Optimize tree-shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Add resource hints for performance
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect; crossorigin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
