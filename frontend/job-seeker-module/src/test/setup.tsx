import '@testing-library/jest-dom';
import type { ReactNode } from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ jobId: '1' }),
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
