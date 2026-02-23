'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function JobsPage() {
  return (
    <RemoteLoader
      remoteKey="jobSeeker"
      moduleKey="JOBS_PAGE"
      fallbackMessage="Could not load jobs listing"
    />
  );
}
