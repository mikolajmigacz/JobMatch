'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { findMockJob, findApplicationsByJobId } from '@/data/mockJobs';
import { Application, ApplicationStatus } from '@/types/job';
import MatchModal from '@/components/MatchModal';

// ─── Layout ───────────────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const Back = styled(Link)`
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  &:hover {
    color: #111;
  }
`;

// ─── Job Header ───────────────────────────────────────────────────────────────
const JobHeader = styled.div`
  margin: 16px 0 28px;
  padding: 20px 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const JobTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 6px;
`;

const JobMeta = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 12px;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Stat = styled.span<{ $color?: string }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.$color ?? '#374151'};
  background: ${(p) => (p.$color ? p.$color + '18' : '#f3f4f6')};
  padding: 4px 10px;
  border-radius: 20px;
`;

// ─── Filters ──────────────────────────────────────────────────────────────────
const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 7px 18px;
  border-radius: 20px;
  border: 1.5px solid ${(p) => (p.$active ? '#111' : '#e5e7eb')};
  background: ${(p) => (p.$active ? '#111' : 'white')};
  color: ${(p) => (p.$active ? 'white' : '#374151')};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
`;

const Empty = styled.p`
  color: #9ca3af;
  padding: 40px 0;
  text-align: center;
`;

// ─── Application Card ─────────────────────────────────────────────────────────
const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 12px;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ApplicantName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111;
`;

const ApplicantEmail = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 2px;
`;

const CardRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const AppliedDate = styled.span`
  font-size: 0.8125rem;
  color: #9ca3af;
`;

const Badge = styled.span<{ $status: ApplicationStatus }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${(p) =>
    p.$status === 'accepted' ? '#dcfce7' : p.$status === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${(p) =>
    p.$status === 'accepted' ? '#15803d' : p.$status === 'rejected' ? '#b91c1c' : '#a16207'};
`;

const CoverLetter = styled.div`
  margin: 14px 0 12px;
`;

const CoverLetterLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const CoverLetterText = styled.p<{ $expanded: boolean }>`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: ${(p) => (p.$expanded ? 'unset' : '2')};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ExpandBtn = styled.button`
  font-size: 0.8125rem;
  color: #6366f1;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 14px;
`;

const CvButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 6px 14px;
  border-radius: 7px;
  text-decoration: none;
  transition: background 0.15s;
  &:hover {
    background: #e5e7eb;
  }
`;

const ActionBtn = styled.button<{ $variant: 'accept' | 'reject' }>`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.85;
  }
  background: ${(p) => (p.$variant === 'accept' ? '#10b981' : '#ef4444')};
  color: white;
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type Filter = ApplicationStatus | 'all';

interface MatchState {
  applicantName: string;
  jobTitle: string;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JobApplicationsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);

  const job = findMockJob(jobId);
  const [applications, setApplications] = useState<Application[]>(() =>
    findApplicationsByJobId(jobId)
  );
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [match, setMatch] = useState<MatchState | null>(null);

  const filtered =
    filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const handleAccept = useCallback(
    (app: Application) => {
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: 'accepted' } : a))
      );
      setMatch({ applicantName: app.applicantName, jobTitle: job?.title ?? '' });
    },
    [job?.title]
  );

  const handleReject = useCallback((id: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const closeMatch = useCallback(() => setMatch(null), []);

  if (!job) {
    return (
      <Container>
        <Back href="/employer/my-jobs">← My Jobs</Back>
        <Empty>Job not found.</Empty>
      </Container>
    );
  }

  return (
    <Container>
      <Back href="/employer/my-jobs">← My Jobs</Back>

      <JobHeader>
        <JobTitle>{job.title}</JobTitle>
        <JobMeta>
          {job.companyName} · {job.location} · {job.employmentType}
        </JobMeta>
        <Stats>
          <Stat>{counts.all} applications</Stat>
          <Stat $color="#ca8a04">{counts.pending} pending</Stat>
          <Stat $color="#15803d">{counts.accepted} accepted</Stat>
          <Stat $color="#b91c1c">{counts.rejected} rejected</Stat>
        </Stats>
      </JobHeader>

      <Filters>
        {(['all', 'pending', 'accepted', 'rejected'] as Filter[]).map((f) => (
          <FilterBtn key={f} $active={filter === f} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </FilterBtn>
        ))}
      </Filters>

      {filtered.length === 0 ? (
        <Empty>No {filter !== 'all' ? filter : ''} applications.</Empty>
      ) : (
        filtered.map((app) => {
          const expanded = expandedIds.has(app.id);
          const isPending = app.status === 'pending';
          return (
            <Card key={app.id}>
              <CardTop>
                <div>
                  <ApplicantName>{app.applicantName}</ApplicantName>
                  <ApplicantEmail>{app.applicantEmail}</ApplicantEmail>
                </div>
                <CardRight>
                  <AppliedDate>{formatDate(app.appliedAt)}</AppliedDate>
                  <Badge $status={app.status}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </CardRight>
              </CardTop>

              <CoverLetter>
                <CoverLetterLabel>Cover Letter</CoverLetterLabel>
                <CoverLetterText $expanded={expanded}>{app.coverLetter}</CoverLetterText>
                <ExpandBtn onClick={() => toggleExpand(app.id)}>
                  {expanded ? 'Show less' : 'Read more'}
                </ExpandBtn>
              </CoverLetter>

              <CardActions>
                <CvButton href={app.cvUrl} download>
                  ⬇ Download CV
                </CvButton>
                {isPending && (
                  <>
                    <ActionBtn $variant="accept" onClick={() => handleAccept(app)}>
                      ✓ Accept
                    </ActionBtn>
                    <ActionBtn $variant="reject" onClick={() => handleReject(app.id)}>
                      ✕ Reject
                    </ActionBtn>
                  </>
                )}
              </CardActions>
            </Card>
          );
        })
      )}

      {match && (
        <MatchModal
          applicantName={match.applicantName}
          jobTitle={match.jobTitle}
          onClose={closeMatch}
        />
      )}
    </Container>
  );
}
