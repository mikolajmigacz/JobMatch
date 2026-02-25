'use client';

import Link from 'next/link';
import {
  Container,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  CTAButtons,
  CTAButton,
  FeaturesSection,
  SectionTitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  StatisticsSection,
  StatisticsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  HowItWorksSection,
  HowItWorksGrid,
  HowItWorksColumn,
  StepNumber,
  StepTitle,
  StepsList,
  StepItem,
} from './Home.modern.styles';

export default function HomePage() {
  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Find Your Perfect Job or Hire the Best Talent</HeroTitle>
        <HeroSubtitle>
          JobMatch connects job seekers with employers using intelligent matching and AI-powered CV
          analysis
        </HeroSubtitle>
        <CTAButtons>
          <Link href="/register" passHref legacyBehavior>
            <CTAButton $variant="primary">Get Started</CTAButton>
          </Link>
          <Link href="/job-seeker/jobs" passHref legacyBehavior>
            <CTAButton $variant="secondary">Browse Jobs</CTAButton>
          </Link>
        </CTAButtons>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Key Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI CV Analysis</FeatureTitle>
            <FeatureDescription>
              Get intelligent feedback on your CV using advanced AI analysis. Improve your profile
              and stand out.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Smart Matching</FeatureTitle>
            <FeatureDescription>
              Find perfectly matched job opportunities based on your skills, experience, and
              preferences.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📧</FeatureIcon>
            <FeatureTitle>Smart Notifications</FeatureTitle>
            <FeatureDescription>
              Get notified about new job matches and application updates instantly.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔐</FeatureIcon>
            <FeatureTitle>Secure & Private</FeatureTitle>
            <FeatureDescription>
              Your data is encrypted and protected. We never share your information without consent.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Easy to Use</FeatureTitle>
            <FeatureDescription>
              Simple, intuitive interface that works on all devices. Get started in minutes.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>Global Reach</FeatureTitle>
            <FeatureDescription>
              Connect with opportunities worldwide. Break geographic boundaries.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Statistics Section */}
      <StatisticsSection>
        <SectionTitle>JobMatch by the Numbers</SectionTitle>
        <StatisticsGrid>
          <StatCard>
            <StatNumber>5,000+</StatNumber>
            <StatLabel>Active Jobs</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>1,200+</StatNumber>
            <StatLabel>Companies</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>25,000+</StatNumber>
            <StatLabel>Job Seekers</StatLabel>
          </StatCard>

          <StatCard>
            <StatNumber>92%</StatNumber>
            <StatLabel>Match Success Rate</StatLabel>
          </StatCard>
        </StatisticsGrid>
      </StatisticsSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <HowItWorksGrid>
          <HowItWorksColumn>
            <StepNumber>For Job Seekers</StepNumber>
            <StepTitle>4 Easy Steps</StepTitle>
            <StepsList>
              <StepItem>
                <strong>1. Create Profile</strong> - Sign up and upload your CV
              </StepItem>
              <StepItem>
                <strong>2. Get AI Feedback</strong> - Receive intelligent analysis of your CV
              </StepItem>
              <StepItem>
                <strong>3. Browse Jobs</strong> - Find perfectly matched opportunities
              </StepItem>
              <StepItem>
                <strong>4. Apply & Match</strong> - Apply to jobs and wait for employers to accept
              </StepItem>
            </StepsList>
          </HowItWorksColumn>

          <HowItWorksColumn>
            <StepNumber>For Employers</StepNumber>
            <StepTitle>4 Easy Steps</StepTitle>
            <StepsList>
              <StepItem>
                <strong>1. Create Account</strong> - Set up your company profile
              </StepItem>
              <StepItem>
                <strong>2. Post Job</strong> - Create job listings with detailed requirements
              </StepItem>
              <StepItem>
                <strong>3. Review Candidates</strong> - See applications from matched candidates
              </StepItem>
              <StepItem>
                <strong>4. Make Offer</strong> - Accept candidates and send offers
              </StepItem>
            </StepsList>
          </HowItWorksColumn>
        </HowItWorksGrid>
      </HowItWorksSection>

      {/* Final CTA Section */}
      <HeroSection $secondary>
        <HeroTitle>Ready to Find Your Next Opportunity?</HeroTitle>
        <HeroSubtitle>Join thousands of job seekers and employers on JobMatch</HeroSubtitle>
        <CTAButtons>
          <Link href="/register" passHref legacyBehavior>
            <CTAButton $variant="primary">Get Started Now</CTAButton>
          </Link>
        </CTAButtons>
      </HeroSection>
    </Container>
  );
}
