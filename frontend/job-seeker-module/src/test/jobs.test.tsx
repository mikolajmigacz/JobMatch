import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import JobsPage from '../app/jobs/page';

beforeEach(() => localStorage.clear());

describe('JobsPage', () => {
  it('renders the page heading', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Job Opportunities')).toBeInTheDocument());
  });

  it('renders all three mock jobs by default', async () => {
    render(<JobsPage />);
    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Full Stack Engineer')).toBeInTheDocument();
      expect(screen.getByText('UI/UX Designer')).toBeInTheDocument();
    });
  });

  it('shows a result count', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText(/3 jobs found/i)).toBeInTheDocument());
  });

  it('filters jobs by search query', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search jobs, companies...');
    fireEvent.change(searchInput, { target: { value: 'Frontend' } });

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.queryByText('Full Stack Engineer')).not.toBeInTheDocument();
    });
  });

  it('filters jobs by employment type', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('UI/UX Designer')).toBeInTheDocument());

    const select = screen.getAllByRole('combobox')[0];
    fireEvent.change(select, { target: { value: 'contract' } });

    await waitFor(() => {
      expect(screen.getByText('UI/UX Designer')).toBeInTheDocument();
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
    });
  });

  it('shows "No jobs found" when search yields no results', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search jobs, companies...');
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    await waitFor(() => expect(screen.getByText('No jobs found')).toBeInTheDocument());
  });

  it('renders Apply links pointing to /jobs/:id', async () => {
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());

    const applyLinks = screen.getAllByText('View & Apply');
    expect(applyLinks.length).toBeGreaterThan(0);
    const firstLink = applyLinks[0].closest('a');
    expect(firstLink).toHaveAttribute('href', expect.stringContaining('/jobs/'));
  });
});
