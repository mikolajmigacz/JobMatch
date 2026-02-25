'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteJobsPage = remote('jobSeeker/JobsPage');

export default function JobsPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load jobs listing">
      <RemoteJobsPage />
    </RemoteLoader>
  );
}
