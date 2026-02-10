import { Metadata } from 'next';
import StyledComponentsRegistry from '@/components/registry';
import { AuthProvider } from '@/contexts/auth.context';
import { TRPCProvider } from '@/trpc';
import { Header, Footer } from '@/ui/components';

export const metadata: Metadata = {
  title: 'JobMatch',
  description: 'Platforma do zarządzania ofertami pracy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>
            <TRPCProvider>
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </TRPCProvider>
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
