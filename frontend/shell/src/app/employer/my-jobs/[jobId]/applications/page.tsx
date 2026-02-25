'use client';

import { useParams } from 'next/navigation';
import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteJobApplicationsPage = remote<{ jobId?: string }>('employer/JobApplicationsPage');

export default function JobApplicationsPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  return (
    <RemoteLoader fallbackMessage="Could not load applications">
      <RemoteJobApplicationsPage jobId={jobId} />
    </RemoteLoader>
  );
}
