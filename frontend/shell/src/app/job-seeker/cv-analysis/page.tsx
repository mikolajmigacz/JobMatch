'use client';

import { remote } from '@/utils/mf';
import { RemoteLoader } from '@/components/RemoteLoader';

const RemoteCVAnalysisPage = remote('jobSeeker/CVAnalysisPage');

export default function CVAnalysisPage() {
  return (
    <RemoteLoader fallbackMessage="Could not load CV analysis">
      <RemoteCVAnalysisPage />
    </RemoteLoader>
  );
}
