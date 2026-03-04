/** @type {import('next').NextConfig} */
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_API_GATEWAY_URL',
  'NEXT_PUBLIC_JOB_SEEKER_URL',
  'NEXT_PUBLIC_EMPLOYER_URL',
];

/** @param {string} phase */
module.exports = (phase) => {
  if (phase !== PHASE_PRODUCTION_BUILD) {
    for (const key of REQUIRED_ENV_VARS) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
  }

  return {
    reactStrictMode: true,
    compiler: {
      styledComponents: true,
    },
    transpilePackages: ['@jobmatch/shared'],
  };
};
