'use client';

import Link from 'next/link';
import {
  FooterWrapper,
  FooterContent,
  Grid,
  Column,
  Title,
  FooterLink,
  Divider,
  Bottom,
} from './Footer.styles';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContent>
        <Grid>
          <Column>
            <Title>JobMatch</Title>
            <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
              Platforma łącząca pracodawców z pracownikami
            </p>
          </Column>

          <Column>
            <Title>For Job Seekers</Title>
            <Link href="/job-seeker/jobs" passHref legacyBehavior>
              <FooterLink>Browse Jobs</FooterLink>
            </Link>
            <Link href="/job-seeker/applications" passHref legacyBehavior>
              <FooterLink>My Applications</FooterLink>
            </Link>
            <Link href="/job-seeker/cv-analysis" passHref legacyBehavior>
              <FooterLink>CV Analysis</FooterLink>
            </Link>
          </Column>

          <Column>
            <Title>For Employers</Title>
            <Link href="/employer/my-jobs" passHref legacyBehavior>
              <FooterLink>My Jobs</FooterLink>
            </Link>
            <Link href="/employer/my-jobs/new" passHref legacyBehavior>
              <FooterLink>Post a Job</FooterLink>
            </Link>
            <Link href="/employer/profile" passHref legacyBehavior>
              <FooterLink>Company Profile</FooterLink>
            </Link>
          </Column>

          <Column>
            <Title>Account</Title>
            <Link href="/login" passHref legacyBehavior>
              <FooterLink>Sign In</FooterLink>
            </Link>
            <Link href="/register" passHref legacyBehavior>
              <FooterLink>Sign Up</FooterLink>
            </Link>
          </Column>
        </Grid>

        <Divider />

        <Bottom>
          <div>© {currentYear} JobMatch. All rights reserved.</div>
        </Bottom>
      </FooterContent>
    </FooterWrapper>
  );
}
