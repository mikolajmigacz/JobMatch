/** @type {import('next').NextConfig} */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_API_GATEWAY_URL',
  'NEXT_PUBLIC_JOB_SEEKER_URL',
  'NEXT_PUBLIC_EMPLOYER_URL',
];

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@jobmatch/shared'],
};

module.exports = nextConfig;
