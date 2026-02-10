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
  SocialLinks,
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
            <Link href="/jobs" passHref legacyBehavior>
              <FooterLink>Browse Jobs</FooterLink>
            </Link>
            <Link href="/companies" passHref legacyBehavior>
              <FooterLink>Companies</FooterLink>
            </Link>
            <Link href="/advice" passHref legacyBehavior>
              <FooterLink>Career Advice</FooterLink>
            </Link>
          </Column>

          <Column>
            <Title>For Employers</Title>
            <Link href="/post-job" passHref legacyBehavior>
              <FooterLink>Post a Job</FooterLink>
            </Link>
            <Link href="/pricing" passHref legacyBehavior>
              <FooterLink>Pricing</FooterLink>
            </Link>
            <Link href="/resources" passHref legacyBehavior>
              <FooterLink>Resources</FooterLink>
            </Link>
          </Column>

          <Column>
            <Title>Company</Title>
            <Link href="/about" passHref legacyBehavior>
              <FooterLink>About Us</FooterLink>
            </Link>
            <Link href="/blog" passHref legacyBehavior>
              <FooterLink>Blog</FooterLink>
            </Link>
            <Link href="/contact" passHref legacyBehavior>
              <FooterLink>Contact</FooterLink>
            </Link>
          </Column>
        </Grid>

        <Divider />

        <Bottom>
          <div>© {currentYear} JobMatch. All rights reserved.</div>
          <SocialLinks>
            <Link href="/privacy" passHref legacyBehavior>
              <FooterLink>Privacy Policy</FooterLink>
            </Link>
            <span>•</span>
            <Link href="/terms" passHref legacyBehavior>
              <FooterLink>Terms of Service</FooterLink>
            </Link>
          </SocialLinks>
        </Bottom>
      </FooterContent>
    </FooterWrapper>
  );
}
