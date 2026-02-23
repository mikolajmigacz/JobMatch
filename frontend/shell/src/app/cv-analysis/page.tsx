'use client';

import { RemoteLoader } from '@/components/RemoteLoader';

export default function CVAnalysisPage() {
  return (
    <RemoteLoader
      remoteKey="jobSeeker"
      moduleKey="CV_ANALYSIS_PAGE"
      fallbackMessage="Could not load CV analysis"
    />
  );
}
