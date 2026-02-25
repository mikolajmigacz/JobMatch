'use client';

import { useParams } from 'next/navigation';
import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteJobDetailPage = remote<{ jobId?: string }>('jobSeeker/JobDetailPage');

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  return (
    <RemoteLoader fallbackMessage="Could not load job details">
      <RemoteJobDetailPage jobId={jobId} />
    </RemoteLoader>
  );
}
