'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function JobSeekerPage() {
  return (
    <RemoteLoader remoteKey="jobSeeker" fallbackMessage="Job Seeker module failed to load" />
  );
}
