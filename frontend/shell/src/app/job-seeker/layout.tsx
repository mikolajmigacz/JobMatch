'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['job_seeker']}>{children}</ProtectedRoute>;
}
