'use client';

import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 24px;
`;

export default function EmployerJobsPage() {
  return (
    <Container>
      <Title>Browse Jobs</Title>
      <p>Job listings will appear here.</p>
    </Container>
  );
}
