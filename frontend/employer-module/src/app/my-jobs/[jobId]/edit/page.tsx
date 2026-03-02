'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { JobForm, JobFormValues } from '@/components/JobForm';
import { findMockJob } from '@/data/mockJobs';

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

const NotFound = styled.p`
  color: #6b7280;
  padding: 40px 0;
`;

export default function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const job = findMockJob(jobId);

  const onSubmit = async (_data: JobFormValues) => {
    // TODO: replace with trpc.job.update.mutate({ jobId, ..._data })
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setTimeout(() => router.push('/employer/my-jobs'), 1500);
  };

  if (submitted) {
    return (
      <Container>
        <SuccessBanner>Job updated successfully! Redirecting…</SuccessBanner>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Back href="/employer/my-jobs">← My Jobs</Back>
        <NotFound>Job not found.</NotFound>
      </Container>
    );
  }

  const warning =
    job.applicationsByStatus.pending > 0
      ? `This job has ${job.applicationsByStatus.pending} pending application(s). Editing may affect applicants.`
      : undefined;

  const defaultValues: Partial<JobFormValues> = {
    title: job.title,
    companyName: job.companyName,
    location: job.location,
    employmentType: job.employmentType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    skills: job.skills,
    description: job.description,
    requirements: job.requirements,
  };

  return (
    <Container>
      <Back href="/employer/my-jobs">← My Jobs</Back>
      <Title>Edit Job</Title>
      <JobForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
        onCancel={() => router.push('/employer/my-jobs')}
        warning={warning}
      />
    </Container>
  );
}
