import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as StyledComponents from 'styled-components';
import { init, loadRemote } from '@module-federation/runtime';

const REMOTE_ENTRY_PATH = '/_next/static/chunks/remoteEntry.js';

const jobSeekerUrl = process.env.NEXT_PUBLIC_JOB_SEEKER_URL;
const employerUrl = process.env.NEXT_PUBLIC_EMPLOYER_URL;

if (!jobSeekerUrl)
  throw new Error('Missing required environment variable: NEXT_PUBLIC_JOB_SEEKER_URL');
if (!employerUrl)
  throw new Error('Missing required environment variable: NEXT_PUBLIC_EMPLOYER_URL');

init({
  name: 'shell',
  remotes: [
    { name: 'jobSeeker', entry: `${jobSeekerUrl}${REMOTE_ENTRY_PATH}` },
    { name: 'employer', entry: `${employerUrl}${REMOTE_ENTRY_PATH}` },
  ],
  shared: {
    react: {
      version: React.version,
      lib: () => React,
    },
    'react-dom': {
      version: (ReactDOM as { version?: string }).version ?? React.version,
      lib: () => ReactDOM,
    },
    'styled-components': {
      version: (StyledComponents as { version?: string }).version ?? '6.0.0',
      lib: () => StyledComponents,
    },
  },
});

export function remote<P extends object = Record<string, unknown>>(path: string) {
  return dynamic<P>(() => loadRemote<{ default: ComponentType<P> }>(path).then((m) => m!), {
    ssr: false,
  });
}
