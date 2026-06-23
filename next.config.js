/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = [...(config.externals || []), 'pdf-parse', 'mammoth']
      }
      return config
    },
  }
  
  module.exports = nextConfig