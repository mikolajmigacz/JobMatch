import '@testing-library/jest-dom';

// Provide synchronous React.use() for testing
// Pages that use `use(params)` receive a tagged promise created by taggedParams()
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    use: (value: any): any => {
      if (value && typeof value.then === 'function') {
        if ('_testValue' in value) return value._testValue;
        if (typeof actual.use === 'function') return actual.use(value);
        throw value;
      }
      if (typeof actual.use === 'function') return actual.use(value);
      return value;
    },
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({}),
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
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
