'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import Navigation from '../Navigation/Navigation';
import UserMenu from '../UserMenu/UserMenu';
import { HeaderWrapper, Container, Logo, RightSection } from './Header.styles';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <HeaderWrapper>
      <Container>
        <Link href="/" passHref legacyBehavior>
          <Logo>
            <img src="/logo/logo.svg" alt="JobMatch" style={{ height: '56px', width: 'auto' }} />
          </Logo>
        </Link>

        <RightSection>
          <Navigation />
          {isAuthenticated && <UserMenu />}
        </RightSection>
      </Container>
    </HeaderWrapper>
  );
}
