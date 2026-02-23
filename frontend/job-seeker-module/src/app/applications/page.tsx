'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Application, ApplicationStatus } from '../../types/job';
import { getApplications, updateApplicationStatus } from '../../utils/applications';
import MatchPopup from '../../components/MatchPopup';

// Status badge colors
const STATUS_COLOR: Record<ApplicationStatus, { bg: string; text: string }> = {
  pending: { bg: '#fff8e1', text: '#f57f17' },
  accepted: { bg: '#e8f5e9', text: '#2e7d32' },
  rejected: { bg: '#ffebee', text: '#c62828' },
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: '⏳ Pending',
  accepted: '✅ Accepted',
  rejected: '❌ Rejected',
};

// Styles
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  padding: 7px 18px;
  border-radius: 20px;
  border: 1px solid ${(p) => (p.active ? '#007bff' : '#ddd')};
  background: ${(p) => (p.active ? '#007bff' : 'white')};
  color: ${(p) => (p.active ? 'white' : '#555')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: #007bff;
    color: #007bff;
    background: ${(p) => (p.active ? '#007bff' : '#f0f7ff')};
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CardLeft = styled.div`
  flex: 1;
`;

const JobTitle = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  &:hover {
    color: #007bff;
  }
`;

const CompanyName = styled.div`
  color: #666;
  font-size: 14px;
  margin: 4px 0 10px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #888;
`;

const Badge = styled.span<{ status: ApplicationStatus }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background: ${(p) => STATUS_COLOR[p.status].bg};
  color: ${(p) => STATUS_COLOR[p.status].text};
  white-space: nowrap;
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;

const SimulateButton = styled.button`
  background: none;
  border: 1px dashed #ccc;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 11px;
  color: #aaa;
  cursor: pointer;
  &:hover {
    border-color: #007bff;
    color: #007bff;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const BackLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

type Filter = 'all' | ApplicationStatus;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [matchPopup, setMatchPopup] = useState<Application | null>(null);

  const load = useCallback(() => setApplications(getApplications()), []);

  useEffect(() => {
    load();

    // Poll for status changes every 5s (simulates server push)
    const interval = setInterval(() => {
      const current = getApplications();
      setApplications((prev) => {
        const prevAccepted = new Set(prev.filter((a) => a.status === 'accepted').map((a) => a.id));
        const newlyAccepted = current.find(
          (a) => a.status === 'accepted' && !prevAccepted.has(a.id)
        );
        if (newlyAccepted) setMatchPopup(newlyAccepted);
        return current;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [load]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (!min) return `Up to ${max?.toLocaleString()} PLN`;
    if (!max) return `From ${min?.toLocaleString()} PLN`;
    return `${min.toLocaleString()} – ${max.toLocaleString()} PLN`;
  };

  const filtered =
    filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const simulateAccept = (app: Application) => {
    updateApplicationStatus(app.id, 'accepted');
    load();
    setMatchPopup({ ...app, status: 'accepted' });
  };

  return (
    <Container>
      {matchPopup && (
        <MatchPopup
          jobTitle={matchPopup.jobTitle}
          company={matchPopup.company}
          onClose={() => setMatchPopup(null)}
        />
      )}

      <Header>
        <div>
          <BackLink href="/">← Home</BackLink>
          <Title style={{ marginTop: 8 }}>My Applications</Title>
        </div>
        <Link href="/jobs" style={{ color: '#007bff', fontSize: 14 }}>
          Browse More Jobs →
        </Link>
      </Header>

      <FilterBar>
        {(['all', 'pending', 'accepted', 'rejected'] as Filter[]).map((f) => (
          <FilterBtn key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : STATUS_LABEL[f as ApplicationStatus]}{' '}
            <span style={{ opacity: 0.7 }}>({counts[f]})</span>
          </FilterBtn>
        ))}
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState>
          {applications.length === 0 ? (
            <>
              <h3>No applications yet</h3>
              <p>Start by browsing available jobs and submitting your first application.</p>
              <Link href="/jobs" style={{ color: '#007bff' }}>
                Browse Jobs
              </Link>
            </>
          ) : (
            <p>No applications with status &ldquo;{filter}&rdquo;.</p>
          )}
        </EmptyState>
      ) : (
        filtered.map((app) => {
          const salary = formatSalary(app.salaryMin, app.salaryMax);
          return (
            <Card key={app.id}>
              <CardLeft>
                <JobTitle href={`/jobs/${app.jobId}`}>{app.jobTitle}</JobTitle>
                <CompanyName>{app.company}</CompanyName>
                <MetaRow>
                  <span>📍 {app.location}</span>
                  <span>💼 {app.employmentType}</span>
                  {salary && <span>💰 {salary}</span>}
                  <span>📅 Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                </MetaRow>
              </CardLeft>
              <CardRight>
                <Badge status={app.status}>{STATUS_LABEL[app.status]}</Badge>
                {app.status === 'pending' && (
                  <SimulateButton
                    onClick={() => simulateAccept(app)}
                    title="Simulate server acceptance"
                  >
                    Demo: simulate accept
                  </SimulateButton>
                )}
              </CardRight>
            </Card>
          );
        })
      )}
    </Container>
  );
}
