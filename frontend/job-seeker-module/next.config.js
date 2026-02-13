const { container } = require('webpack');

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
        new container.ModuleFederationPlugin({
          name: 'jobSeeker',
          filename: 'remoteEntry.js',
          exposes: {
            './JobSeekerApp': './src/app/index.ts',
            './JobList': './src/components/JobList/index.ts',
            './MyApplications': './src/components/MyApplications/index.ts',
            './CVAnalysis': './src/components/CVAnalysis/index.ts',
          },
          shared: {
            react: { singleton: true, strictVersion: false },
            'react-dom': { singleton: true, strictVersion: false },
            'styled-components': { singleton: true, strictVersion: false },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
