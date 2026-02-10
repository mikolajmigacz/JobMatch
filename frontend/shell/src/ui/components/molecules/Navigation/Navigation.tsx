'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import { Nav, NavLink, Button, HamburgerButton, NavContainer } from './Navigation.styles';

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isJobSeeker = user?.role === 'job_seeker';
  const isEmployer = user?.role === 'employer';

  return (
    <NavContainer>
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)}>☰</HamburgerButton>

      <Nav $open={menuOpen}>
        <Link href="/" passHref legacyBehavior>
          <NavLink>Home</NavLink>
        </Link>

        {isAuthenticated ? (
          <>
            <Link href="/jobs" passHref legacyBehavior>
              <NavLink>Browse Jobs</NavLink>
            </Link>

            {isJobSeeker && (
              <>
                <Link href="/applications" passHref legacyBehavior>
                  <NavLink>My Applications</NavLink>
                </Link>
                <Link href="/cv-analysis" passHref legacyBehavior>
                  <NavLink>CV Analysis</NavLink>
                </Link>
              </>
            )}

            {isEmployer && (
              <>
                <Link href="/my-jobs" passHref legacyBehavior>
                  <NavLink>My Jobs</NavLink>
                </Link>
                <Link href="/create-job" passHref legacyBehavior>
                  <NavLink>Create Job</NavLink>
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link href="/jobs" passHref legacyBehavior>
              <NavLink>Browse Jobs</NavLink>
            </Link>
            <Link href="/login" passHref legacyBehavior>
              <Button $variant="secondary">Sign In</Button>
            </Link>
            <Link href="/register" passHref legacyBehavior>
              <Button $variant="primary">Sign Up</Button>
            </Link>
          </>
        )}
      </Nav>
    </NavContainer>
  );
}
