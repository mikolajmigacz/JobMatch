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

export default function ApplicationsPage() {
  return (
    <Container>
      <Title>Applications</Title>
      <p>Review candidate applications here.</p>
    </Container>
  );
}
