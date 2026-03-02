'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { EmployerJob, JobFilters, JobStatus } from '@/types/job';
import { MOCK_JOBS as INITIAL_JOBS } from '@/data/mockJobs';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #111;
`;

const CreateButton = styled(Link)`
  padding: 10px 22px;
  background: #0070f3;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 0.15s;
  &:hover {
    background: #0051a2;
  }
`;

// --- Stats ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div<{ accent?: string }>`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-top: 3px solid ${({ accent }) => accent ?? '#0070f3'};
  border-radius: 8px;
  padding: 20px 16px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #111;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// --- Filters ---
const FiltersRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  &:focus {
    outline: 2px solid #0070f3;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
  cursor: pointer;
`;

// --- Table ---
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 0.78rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #374151;
`;

const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  &:hover td {
    background: #f9fafb;
  }
`;

const JobTitle = styled.div`
  font-weight: 600;
  color: #111;
  margin-bottom: 2px;
`;

const JobMeta = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
`;

const StatusBadge = styled.span<{ status: JobStatus }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'active' ? '#dcfce7' : status === 'draft' ? '#fef9c3' : '#f3f4f6'};
  color: ${({ status }) =>
    status === 'active' ? '#15803d' : status === 'draft' ? '#a16207' : '#6b7280'};
`;

const AppStats = styled.div`
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
`;

const AppDot = styled.span<{ color: string }>`
  &::before {
    content: '● ';
    color: ${({ color }) => color};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionLink = styled(Link)`
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  background: #f3f4f6;
  color: #374151;
  &:hover {
    background: #e5e7eb;
  }
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: #fee2e2;
  color: #b91c1c;
  &:hover {
    background: #fecaca;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MyJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>(INITIAL_JOBS);
  const [filters, setFilters] = useState<JobFilters>({ search: '', status: 'all', sort: 'newest' });

  const stats = useMemo(() => {
    const active = jobs.filter((j) => j.status === 'active').length;
    const closed = jobs.filter((j) => j.status === 'closed').length;
    const totalApps = jobs.reduce((s, j) => s + j.applicationCount, 0);
    const pending = jobs.reduce((s, j) => s + j.applicationsByStatus.pending, 0);
    const accepted = jobs.reduce((s, j) => s + j.applicationsByStatus.accepted, 0);
    const rejected = jobs.reduce((s, j) => s + j.applicationsByStatus.rejected, 0);
    return { total: jobs.length, active, closed, totalApps, pending, accepted, rejected };
  }, [jobs]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (j) => j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)
      );
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter((j) => j.status === filters.status);
    }
    if (filters.sort === 'newest') list.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    if (filters.sort === 'oldest') list.sort((a, b) => a.postedAt.getTime() - b.postedAt.getTime());
    if (filters.sort === 'applications')
      list.sort((a, b) => b.applicationCount - a.applicationCount);
    return list;
  }, [jobs, filters]);

  const handleClose = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: 'closed' as JobStatus, closedAt: new Date() } : j
      )
    );
  };

  return (
    <Container>
      <PageHeader>
        <Title>My Jobs</Title>
        <CreateButton href="/employer/my-jobs/new">+ Post a Job</CreateButton>
      </PageHeader>

      <StatsGrid>
        <StatCard accent="#0070f3">
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Jobs</StatLabel>
        </StatCard>
        <StatCard accent="#10b981">
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active</StatLabel>
        </StatCard>
        <StatCard accent="#6b7280">
          <StatValue>{stats.closed}</StatValue>
          <StatLabel>Closed</StatLabel>
        </StatCard>
        <StatCard accent="#8b5cf6">
          <StatValue>{stats.totalApps}</StatValue>
          <StatLabel>Total Applications</StatLabel>
        </StatCard>
        <StatCard accent="#f59e0b">
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard accent="#10b981">
          <StatValue>{stats.accepted}</StatValue>
          <StatLabel>Accepted</StatLabel>
        </StatCard>
        <StatCard accent="#ef4444">
          <StatValue>{stats.rejected}</StatValue>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
      </StatsGrid>

      <FiltersRow>
        <SearchInput
          placeholder="Search by title or location…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <Select
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value as JobFilters['status'] }))
          }
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </Select>
        <Select
          value={filters.sort}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sort: e.target.value as JobFilters['sort'] }))
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="applications">Most applications</option>
        </Select>
      </FiltersRow>

      {filtered.length === 0 ? (
        <EmptyState>
          No jobs found. <Link href="/employer/my-jobs/new">Post your first job →</Link>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Job</Th>
              <Th>Status</Th>
              <Th>Applications</Th>
              <Th>Posted</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <JobTitle>{job.title}</JobTitle>
                  <JobMeta>
                    {job.location} · {job.employmentType}
                    {job.salaryMin
                      ? ` · ${job.salaryMin.toLocaleString()}–${job.salaryMax?.toLocaleString()} PLN`
                      : ''}
                  </JobMeta>
                </Td>
                <Td>
                  <StatusBadge status={job.status}>{job.status}</StatusBadge>
                </Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{job.applicationCount}</div>
                  <AppStats>
                    <AppDot color="#f59e0b">{job.applicationsByStatus.pending} pending</AppDot>
                    <AppDot color="#10b981">{job.applicationsByStatus.accepted} accepted</AppDot>
                    <AppDot color="#ef4444">{job.applicationsByStatus.rejected} rejected</AppDot>
                  </AppStats>
                </Td>
                <Td>{job.postedAt.toLocaleDateString()}</Td>
                <Td>
                  <Actions>
                    <ActionLink href={`/employer/my-jobs/${job.id}/applications`}>
                      Applications
                    </ActionLink>
                    <ActionLink href={`/employer/my-jobs/${job.id}/edit`}>Edit</ActionLink>
                    {job.status === 'active' && (
                      <ActionButton onClick={() => handleClose(job.id)}>Close</ActionButton>
                    )}
                  </Actions>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
