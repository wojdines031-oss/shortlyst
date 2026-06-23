/** @type {import('next').NextConfig} */
const nextConfig = {
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