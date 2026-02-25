const { container } = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@jobmatch/shared'],
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.output.uniqueName = 'jobSeeker';
      config.output.chunkLoadingGlobal = 'webpackChunk_jobSeeker';
      config.output.publicPath = 'auto';
      config.output.globalObject = 'self';
      config.optimization.runtimeChunk = false;

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
