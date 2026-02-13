import { Metadata } from 'next';
import { GlobalStyle } from '@/utils/GlobalStyle';
import StyledComponentsRegistry from '@/utils/registry';
import { TRPCProvider } from '@/components/TRPCProvider';

export const metadata: Metadata = {
  title: 'JobMatch - Job Seeker',
  description: 'Find your next job',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <TRPCProvider>
            <GlobalStyle />
            {children}
          </TRPCProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
