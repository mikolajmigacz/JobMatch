const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@jobmatch/shared'],
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'shell',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            jobSeeker: 'jobSeeker@http://localhost:4001/remoteEntry.js',
            employer: 'employer@http://localhost:4002/remoteEntry.js',
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false },
            'styled-components': { singleton: true, requiredVersion: false },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
