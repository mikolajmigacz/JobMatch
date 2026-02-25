'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteEmployerProfilePage = remote('employer/EmployerProfilePage');

export default function EmployerProfilePage() {
  return (
    <RemoteLoader fallbackMessage="Could not load company profile">
      <RemoteEmployerProfilePage />
    </RemoteLoader>
  );
}
