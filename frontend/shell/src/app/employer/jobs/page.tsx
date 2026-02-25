'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteJobsPage = remote('employer/JobsPage');

export default function EmployerJobsPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load jobs listing">
      <RemoteJobsPage />
    </RemoteLoader>
  );
}
