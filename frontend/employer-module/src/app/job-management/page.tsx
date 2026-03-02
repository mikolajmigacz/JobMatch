'use client';

import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Button = styled(Link)`
  padding: 10px 20px;
  background: #0070f3;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    background: #0051a2;
  }
`;

export default function JobManagementPage() {
  return (
    <Container>
      <Header>
        <Title>Job Management</Title>
        <Button href="/my-jobs/new">Post a Job</Button>
      </Header>
      <p>Manage your job listings here.</p>
    </Container>
  );
}
