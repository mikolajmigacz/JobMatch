'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function EmployerPage() {
  return (
    <RemoteLoader remoteKey="employer" fallbackMessage="Employer module failed to load" />
  );
}
