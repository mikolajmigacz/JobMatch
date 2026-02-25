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
            <Link href="/job-seeker/jobs" passHref legacyBehavior>
              <NavLink>Browse Jobs</NavLink>
            </Link>

            {isJobSeeker && (
              <>
                <Link href="/job-seeker/applications" passHref legacyBehavior>
                  <NavLink>My Applications</NavLink>
                </Link>
                <Link href="/job-seeker/cv-analysis" passHref legacyBehavior>
                  <NavLink>CV Analysis</NavLink>
                </Link>
              </>
            )}

            {isEmployer && (
              <>
                <Link href="/employer/my-jobs" passHref legacyBehavior>
                  <NavLink>My Jobs</NavLink>
                </Link>
                <Link href="/employer/my-jobs/new" passHref legacyBehavior>
                  <NavLink>Post a Job</NavLink>
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link href="/job-seeker/jobs" passHref legacyBehavior>
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
