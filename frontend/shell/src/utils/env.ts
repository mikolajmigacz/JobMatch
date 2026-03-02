function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  API_GATEWAY_URL: requireEnv('NEXT_PUBLIC_API_GATEWAY_URL'),
  JOB_SEEKER_URL: requireEnv('NEXT_PUBLIC_JOB_SEEKER_URL'),
  EMPLOYER_URL: requireEnv('NEXT_PUBLIC_EMPLOYER_URL'),
} as const;
