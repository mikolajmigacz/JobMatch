import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyJobsPage from '../app/my-jobs/page';

describe('MyJobsPage', () => {
  it('renders the page title', () => {
    render(<MyJobsPage />);
    expect(screen.getByText('My Jobs')).toBeInTheDocument();
  });

  it('renders the post a job button', () => {
    render(<MyJobsPage />);
    expect(screen.getByText('+ Post a Job')).toBeInTheDocument();
  });

  it('renders stat labels', () => {
    render(<MyJobsPage />);
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('Total Applications')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Closed').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);
  });

  it('shows correct total jobs stat (3 mock jobs)', () => {
    render(<MyJobsPage />);
    // 3 mock jobs → stat value "3"
    const statValues = screen.getAllByText('3');
    expect(statValues.length).toBeGreaterThanOrEqual(1);
  });

  it('renders job titles from mock data', () => {
    render(<MyJobsPage />);
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('DevOps Engineer')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<MyJobsPage />);
    expect(screen.getByPlaceholderText('Search by title or location…')).toBeInTheDocument();
  });

  it('filters jobs by search query', () => {
    render(<MyJobsPage />);
    const input = screen.getByPlaceholderText('Search by title or location…');
    fireEvent.change(input, { target: { value: 'Frontend' } });
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.queryByText('Backend Engineer')).not.toBeInTheDocument();
  });

  it('shows empty state when no results match search', () => {
    render(<MyJobsPage />);
    const input = screen.getByPlaceholderText('Search by title or location…');
    fireEvent.change(input, { target: { value: 'zzznomatch' } });
    expect(screen.getByText(/No jobs found/i)).toBeInTheDocument();
  });

  it('renders status filter select', () => {
    render(<MyJobsPage />);
    expect(screen.getByDisplayValue('All statuses')).toBeInTheDocument();
  });

  it('filters by status active', () => {
    render(<MyJobsPage />);
    const select = screen.getByDisplayValue('All statuses');
    fireEvent.change(select, { target: { value: 'active' } });
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.queryByText('DevOps Engineer')).not.toBeInTheDocument();
  });

  it('filters by status closed', () => {
    render(<MyJobsPage />);
    const select = screen.getByDisplayValue('All statuses');
    fireEvent.change(select, { target: { value: 'closed' } });
    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument();
    expect(screen.getByText('DevOps Engineer')).toBeInTheDocument();
  });

  it('renders applications count links', () => {
    render(<MyJobsPage />);
    const appLinks = screen.getAllByText(/applications/i);
    expect(appLinks.length).toBeGreaterThan(0);
  });
});
