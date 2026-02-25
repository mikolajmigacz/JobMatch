'use client';

import { useParams } from 'next/navigation';
import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteEditJobPage = remote<{ jobId?: string }>('employer/EditJobPage');

export default function EditJobPage() {
  const params = useParams();
  const jobId = params?.jobId as string;

  return (
    <RemoteLoader fallbackMessage="Could not load job editor">
      <RemoteEditJobPage jobId={jobId} />
    </RemoteLoader>
  );
}
