'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteMyJobsPage = remote('employer/MyJobsPage');

export default function MyJobsPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load your job listings">
      <RemoteMyJobsPage />
    </RemoteLoader>
  );
}
