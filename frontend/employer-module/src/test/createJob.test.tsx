import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CreateJobPage from '../app/my-jobs/new/page';

describe('CreateJobPage', () => {
  it('renders the page title', () => {
    render(<CreateJobPage />);
    expect(screen.getByText('Post a New Job')).toBeInTheDocument();
  });

  it('renders back link', () => {
    render(<CreateJobPage />);
    expect(screen.getByText('← My Jobs')).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<CreateJobPage />);
    expect(screen.getByRole('button', { name: /Post Job/i })).toBeInTheDocument();
  });

  it('renders required form fields', () => {
    render(<CreateJobPage />);
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<CreateJobPage />);
    fireEvent.click(screen.getByRole('button', { name: /Post Job/i }));
    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
    });
  });

  it('accepts valid title input', () => {
    render(<CreateJobPage />);
    const titleInput = screen.getByLabelText(/Job Title/i);
    fireEvent.change(titleInput, { target: { value: 'Senior React Developer' } });
    expect((titleInput as HTMLInputElement).value).toBe('Senior React Developer');
  });

  it('renders employment type select', () => {
    render(<CreateJobPage />);
    expect(screen.getByLabelText(/Employment Type/i)).toBeInTheDocument();
  });

  it('renders skills section', () => {
    render(<CreateJobPage />);
    expect(screen.getAllByText(/Skills/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders requirements textarea', () => {
    render(<CreateJobPage />);
    expect(screen.getByLabelText(/Requirements/i)).toBeInTheDocument();
  });
});
