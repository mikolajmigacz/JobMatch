'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteProfilePage = remote('jobSeeker/ProfilePage');

export default function ProfilePage() {
  return (
    <RemoteLoader fallbackMessage="Could not load profile">
      <RemoteProfilePage />
    </RemoteLoader>
  );
}
