import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as StyledComponents from 'styled-components';
import * as NextNavigation from 'next/navigation';
import { init, loadRemote } from '@module-federation/runtime';

const REMOTE_ENTRY_PATH = '/_next/static/chunks/remoteEntry.js';

let initialized = false;

function ensureInit() {
  if (initialized) return;
  initialized = true;

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
      react: { version: React.version, lib: () => React },
      'react-dom': { version: React.version, lib: () => ReactDOM },
      'styled-components': { version: '6', lib: () => StyledComponents },
      'next/navigation': { version: '14', lib: () => NextNavigation },
    },
  });
}

export function remote<P extends object = Record<string, unknown>>(path: string) {
  return dynamic<P>(
    () => {
      ensureInit();
      return loadRemote<{ default: ComponentType<P> }>(path).then((m) => {
        if (!m) throw new Error(`Remote module not found: ${path}`);
        const Component = (m as { default?: ComponentType<P> }).default;
        if (!Component || typeof Component !== 'function')
          throw new Error(`Remote module "${path}" has no valid default export`);
        return { default: Component };
      });
    },
    { ssr: false }
  );
}
