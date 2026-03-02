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
`;

const Nav = styled.nav`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  padding: 12px 24px;
  background: #0070f3;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background: #0051a2;
  }
`;

export default function EmployerHomePage() {
  return (
    <Container>
      <Title>Employer Dashboard</Title>
      <Description>Manage your job listings and find the best candidates.</Description>
      <Nav>
        <NavLink href="/jobs">Browse Jobs</NavLink>
        <NavLink href="/my-jobs">My Jobs</NavLink>
        <NavLink href="/my-jobs/new">Post a Job</NavLink>
        <NavLink href="/profile">Profile</NavLink>
      </Nav>
    </Container>
  );
}
