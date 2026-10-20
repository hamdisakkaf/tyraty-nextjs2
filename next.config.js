/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, 
   eslint: {
    ignoreDuringBuilds: true,  // تعطيل ESLint أثناء البناء   تعطيل فحص المتغيرات غير المستخدمة 
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
     unoptimized: true,
    remotePatterns: [
       {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.cash.com.ye',
        pathname: '/assets/**',
      
      },
      {
        protocol: 'https',
        hostname: 'cdn.wheel-size.com',
        pathname: '/automobile/body/**',
      },
      {
        protocol: 'https',
        hostname: 'tyraty-server.onrender.com',
      },
      {
        protocol: 'https',
        hostname: '**.tyraty-github-io.onrender.com', // wildcard لجميع نطاقات tyraty.com
      },
    ],
  },
    // ⬅️ تقليل الحجم
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
   // ⬅️ ضغط أكثر
  compress: true,
   // ⬅️ إزالة source maps في الإنتاج
  productionBrowserSourceMaps: false,
}
module.exports = nextConfig