'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const NavCard = styled(Link)`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
  min-width: 200px;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #007bff;
`;

const CardDescription = styled.p`
  color: #666;
  font-size: 14px;
`;

export default function Page() {
  return (
    <Container>
      <Title>Job Seeker Portal</Title>
      <Description>
        Find your dream job, track applications, and analyze your CV - all in one place.
      </Description>

      <Navigation>
        <NavCard href="/jobs">
          <CardTitle>Browse Jobs</CardTitle>
          <CardDescription>
            Explore thousands of job opportunities with advanced search and filters
          </CardDescription>
        </NavCard>

        <NavCard href="/applications">
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track your job applications and interview progress</CardDescription>
        </NavCard>

        <NavCard href="/cv-analysis">
          <CardTitle>CV Analysis</CardTitle>
          <CardDescription>Get AI-powered insights to improve your resume</CardDescription>
        </NavCard>

        <NavCard href="/profile">
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Manage your account, edit info and change password</CardDescription>
        </NavCard>
      </Navigation>
    </Container>
  );
}
