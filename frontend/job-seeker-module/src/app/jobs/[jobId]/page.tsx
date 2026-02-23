'use client';

import { useParams } from 'next/navigation';
import JobDetailView from '../../../components/JobDetailView';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.jobId as string;
  return <JobDetailView jobId={jobId} />;
}
