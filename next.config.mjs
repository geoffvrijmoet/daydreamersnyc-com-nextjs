/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/products',
        destination: '/menu',
        permanent: true, // 308 status code - tells search engines this is permanent
      },
      {
        source: '/products/:path*',
        destination: '/menu/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
