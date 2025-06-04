
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

let finalConfig = nextConfig;

// Only apply PWA configuration for production builds
if (process.env.NODE_ENV === 'production') {
  const withPWA = withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // disable: process.env.NODE_ENV === 'development', // This is implicitly handled by the conditional wrapping
    // You can add more PWA options here like runtimeCaching
  });
  finalConfig = withPWA(nextConfig);
}

export default finalConfig;
