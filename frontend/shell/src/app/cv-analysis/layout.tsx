'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CVAnalysisLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['job_seeker']}>{children}</ProtectedRoute>;
}
