/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vedica/astrology-core',
    '@vedica/dasha-engine',
    '@vedica/numerology-engine',
    '@vedica/analysis-engine',
    '@vedica/rules-engine',
    '@vedica/timing-engine',
    '@vedica/interpretation-engine',
    '@vedica/location-engine',
    '@vedica/shared',
  ],
  serverExternalPackages: ['sweph', '@libsql/client'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'sweph'];
    }
    return config;
  },
};

export default nextConfig;
