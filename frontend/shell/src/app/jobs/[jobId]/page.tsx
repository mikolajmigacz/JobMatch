'use client';

import { useParams } from 'next/navigation';
import { RemoteLoader } from '@/components/RemoteLoader';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  return (
    <RemoteLoader
      remoteKey="jobSeeker"
      moduleKey="JOB_DETAIL_PAGE"
      remoteProps={{ jobId }}
      fallbackMessage="Could not load job details"
    />
  );
}
