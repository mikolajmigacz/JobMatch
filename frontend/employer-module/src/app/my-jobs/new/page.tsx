'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { JobForm, JobFormValues } from '@/components/JobForm';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const Back = styled(Link)`
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  &:hover {
    color: #111;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #111;
  margin: 16px 0 28px;
`;

const SuccessBanner = styled.div`
  padding: 16px 20px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 8px;
  color: #15803d;
  font-weight: 600;
  margin-bottom: 24px;
`;

export default function CreateJobPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (_data: JobFormValues) => {
    // TODO: replace with trpc.job.create.mutate(_data)
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setTimeout(() => router.push('/employer/my-jobs'), 1500);
  };

  if (submitted) {
    return (
      <Container>
        <SuccessBanner>Job posted successfully! Redirecting…</SuccessBanner>
      </Container>
    );
  }

  return (
    <Container>
      <Back href="/employer/my-jobs">← My Jobs</Back>
      <Title>Post a New Job</Title>
      <JobForm onSubmit={onSubmit} submitLabel="Post Job" />
    </Container>
  );
}
