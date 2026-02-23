'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['job_seeker', 'employer']}>{children}</ProtectedRoute>;
}
