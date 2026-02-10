import {
  MODULE_FEDERATION_CONFIG,
  type RemoteKey,
  type ModuleKey,
} from '@/config/module-federation';

const REMOTE_URLS: Record<RemoteKey, string> = {
  jobSeeker: process.env.NEXT_PUBLIC_JOB_SEEKER_REMOTE ?? 'http://localhost:4001/remoteEntry.js',
  employer: process.env.NEXT_PUBLIC_EMPLOYER_REMOTE ?? 'http://localhost:4002/remoteEntry.js',
};

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

interface Container {
  init(shareScope: unknown): Promise<void>;
  get(module: string): () => Promise<{ default: React.ComponentType }>;
}

const loadScript = (url: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
  });

export const loadRemote = async (remoteKey: RemoteKey, moduleKey: ModuleKey) => {
  const remote = MODULE_FEDERATION_CONFIG.REMOTES[remoteKey];
  const modulePath = MODULE_FEDERATION_CONFIG.MODULES[moduleKey];
  const url = REMOTE_URLS[remoteKey];

  await loadScript(url);
  await __webpack_init_sharing__('default');

  const container = (window as unknown as Record<string, Container>)[remote.scope];
  if (!container) {
    throw new Error(
      `Remote ${remoteKey} not found. Ensure ${url} is accessible.`
    );
  }

  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(modulePath);
  const mod = await factory();
  return mod.default ?? mod;
};
