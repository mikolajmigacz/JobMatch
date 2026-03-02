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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Stat = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0070f3;
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 4px;
`;

export default function DashboardPage() {
  return (
    <Container>
      <Title>Dashboard</Title>
      <Grid>
        <Card>
          <Stat>0</Stat>
          <Label>Active Jobs</Label>
        </Card>
        <Card>
          <Stat>0</Stat>
          <Label>Total Applications</Label>
        </Card>
        <Card>
          <Stat>0</Stat>
          <Label>New Applications</Label>
        </Card>
        <Card>
          <Stat>0</Stat>
          <Label>Hired</Label>
        </Card>
      </Grid>
    </Container>
  );
}
