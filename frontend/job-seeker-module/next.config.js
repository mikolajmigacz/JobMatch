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
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './JobSeekerApp': './src/app/index.ts',
            './JobsPage': './src/exports/JobsPage.ts',
            './JobDetailPage': './src/exports/JobDetailPage.ts',
            './ApplicationsPage': './src/exports/ApplicationsPage.ts',
            './CVAnalysisPage': './src/exports/CVAnalysisPage.ts',
            './ProfilePage': './src/exports/ProfilePage.ts',
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
