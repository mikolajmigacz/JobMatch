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
      {
        // remoteEntry.js must never be cached — its chunk references change on every build
        source: '/_next/static/chunks/remoteEntry.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.output.uniqueName = 'employer';
      config.output.chunkLoadingGlobal = 'webpackChunk_employer';
      config.output.publicPath = 'auto';
      config.output.globalObject = 'self';
      config.optimization.runtimeChunk = false;

      config.plugins.push(
        new container.ModuleFederationPlugin({
          name: 'employer',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './EmployerApp': './src/app/index.ts',
            './JobManagement': './src/exports/JobManagement.ts',
            './Applications': './src/exports/Applications.ts',
            './Dashboard': './src/exports/Dashboard.ts',
            './JobsPage': './src/exports/JobsPage.ts',
            './MyJobsPage': './src/exports/MyJobsPage.ts',
            './CreateJobPage': './src/exports/CreateJobPage.ts',
            './EmployerProfilePage': './src/exports/EmployerProfilePage.ts',
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            'react-dom': { singleton: true, requiredVersion: false },
            'styled-components': { singleton: true, requiredVersion: false },
            'next/navigation': { singleton: true, requiredVersion: false },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
