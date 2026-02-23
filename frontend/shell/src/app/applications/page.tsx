'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function ApplicationsPage() {
  return (
    <RemoteLoader
      remoteKey="jobSeeker"
      moduleKey="APPLICATIONS_PAGE"
      fallbackMessage="Could not load applications"
    />
  );
}
