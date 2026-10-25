/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async redirects() {
    return [
      ...require('./seo-redirects.json').map(item => ({ ...item, destination: 'https://www.caribbeanboggie.com' + item.destination })),
      { source: '/:path*', has: [{ type: 'host', value: 'caribbeanboggie.com' }], destination: 'https://www.caribbeanboggie.com/:path*', permanent: true },
    ];
  },
  experimental: { cpus: 2 },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
