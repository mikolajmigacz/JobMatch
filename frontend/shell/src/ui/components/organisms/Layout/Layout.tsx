'use client';

import { Header, Footer } from '@/ui/components';
import { LayoutWrapper, Main } from './Layout.styles';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutWrapper>
  );
}
