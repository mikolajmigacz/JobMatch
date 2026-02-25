'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteApplicationsPage = remote('jobSeeker/ApplicationsPage');

export default function ApplicationsPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load applications">
      <RemoteApplicationsPage />
    </RemoteLoader>
  );
}
