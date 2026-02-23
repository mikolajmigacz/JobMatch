'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function ProfilePage() {
  return (
    <RemoteLoader
      remoteKey="jobSeeker"
      moduleKey="PROFILE_PAGE"
      fallbackMessage="Could not load profile"
    />
  );
}
