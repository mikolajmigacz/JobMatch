import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ApplicationsPage from '../app/applications/page';
import { saveApplication } from '../utils/applications';

beforeEach(() => localStorage.clear());

describe('ApplicationsPage', () => {
  it('renders the page heading', async () => {
    render(<ApplicationsPage />);
    await waitFor(() => expect(screen.getByText('My Applications')).toBeInTheDocument());
  });

  it('shows empty state when no applications', async () => {
    render(<ApplicationsPage />);
    await waitFor(() => expect(screen.getByText('No applications yet')).toBeInTheDocument());
  });

  it('renders filter buttons', async () => {
    render(<ApplicationsPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /accepted/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rejected/i })).toBeInTheDocument();
    });
  });

  it('shows application card when application exists', async () => {
    saveApplication({
      jobId: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Warsaw',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    render(<ApplicationsPage />);
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());
  });

  it('shows pending status badge', async () => {
    saveApplication({
      jobId: '2',
      jobTitle: 'Backend Dev',
      company: 'Co',
      location: 'Remote',
      employmentType: 'contract',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    render(<ApplicationsPage />);
    // Both the filter button and the card badge contain '⏳ Pending'
    await waitFor(() => expect(screen.getAllByText('⏳ Pending').length).toBeGreaterThanOrEqual(2));
  });

  it('shows accepted status badge', async () => {
    saveApplication({
      jobId: '3',
      jobTitle: 'Designer',
      company: 'Studio',
      location: 'Remote',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'accepted',
    });
    render(<ApplicationsPage />);
    // Both the filter button and the card badge contain '✅ Accepted'
    await waitFor(() =>
      expect(screen.getAllByText('✅ Accepted').length).toBeGreaterThanOrEqual(2)
    );
  });

  it('filters applications by status', async () => {
    saveApplication({
      jobId: '10',
      jobTitle: 'Pending Role',
      company: 'A',
      location: 'x',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    saveApplication({
      jobId: '11',
      jobTitle: 'Rejected Role',
      company: 'B',
      location: 'x',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'rejected',
    });

    render(<ApplicationsPage />);
    await waitFor(() => screen.getByText('Pending Role'));

    fireEvent.click(screen.getByRole('button', { name: /rejected/i }));

    await waitFor(() => {
      expect(screen.getByText('Rejected Role')).toBeInTheDocument();
      expect(screen.queryByText('Pending Role')).not.toBeInTheDocument();
    });
  });

  it('shows "Browse Jobs" link when no applications', async () => {
    render(<ApplicationsPage />);
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /Browse Jobs/i })).toBeInTheDocument()
    );
  });
});
