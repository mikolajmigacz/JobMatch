'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteCreateJobPage = remote('employer/CreateJobPage');

export default function NewJobPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load job creation form">
      <RemoteCreateJobPage />
    </RemoteLoader>
  );
}
