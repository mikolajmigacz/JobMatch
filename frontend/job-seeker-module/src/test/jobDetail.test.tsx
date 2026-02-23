import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import JobDetailPage from '../app/jobs/[jobId]/page';

// setup.ts mocks useParams to return { jobId: '1' }
// Job with id '1' is "Frontend Developer" at "TechCorp"

beforeEach(() => localStorage.clear());

describe('JobDetailPage', () => {
  it('renders the job title for job id 1', async () => {
    render(<JobDetailPage />);
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());
  });

  it('renders company name', async () => {
    render(<JobDetailPage />);
    await waitFor(() => expect(screen.getByText('TechCorp')).toBeInTheDocument());
  });

  it('renders the apply section when not yet applied', async () => {
    render(<JobDetailPage />);
    await waitFor(() => expect(screen.getByText('Apply for this Position')).toBeInTheDocument());
  });

  it('renders the submit button', async () => {
    render(<JobDetailPage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument()
    );
  });

  it('shows already-applied banner when application exists', async () => {
    const { getApplications, saveApplication } = await import('../utils/applications');
    saveApplication({
      jobId: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Warsaw, Poland',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });

    render(<JobDetailPage />);
    await waitFor(() => expect(screen.getByText(/already applied/i)).toBeInTheDocument());
  });

  it('renders cover letter textarea', async () => {
    render(<JobDetailPage />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Tell us why you're a great fit/i)).toBeInTheDocument()
    );
  });

  it('cover letter field accepts text input', async () => {
    render(<JobDetailPage />);
    await waitFor(() => screen.getByPlaceholderText(/Tell us why you're a great fit/i));

    const textarea = screen.getByPlaceholderText(/Tell us why you're a great fit/i);
    fireEvent.change(textarea, { target: { value: 'I am very interested.' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('I am very interested.');
  });
});
