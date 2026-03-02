import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EditJobPage from '../app/my-jobs/[jobId]/edit/page';

/** Creates a tagged promise that our setup.tsx React.use mock resolves synchronously */
const taggedParams = (jobId: string) => {
  const p = Promise.resolve({ jobId }) as Promise<{ jobId: string }> & {
    _testValue: { jobId: string };
  };
  p._testValue = { jobId };
  return p;
};

const renderEdit = (jobId: string) => render(<EditJobPage params={taggedParams(jobId)} />);

describe('EditJobPage', () => {
  it('renders Edit Job heading for a valid job', async () => {
    renderEdit('1');
    await waitFor(() => expect(screen.getByText('Edit Job')).toBeInTheDocument());
  });

  it('renders back link', async () => {
    renderEdit('1');
    await waitFor(() => expect(screen.getByText('← My Jobs')).toBeInTheDocument());
  });

  it('renders Save Changes button', async () => {
    renderEdit('1');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
    );
  });

  it('renders Cancel button', async () => {
    renderEdit('1');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    );
  });

  it('pre-fills the title field with job data', async () => {
    renderEdit('1');
    await waitFor(() => {
      const input = screen.getByDisplayValue('Frontend Developer');
      expect(input).toBeInTheDocument();
    });
  });

  it('pre-fills company name', async () => {
    renderEdit('1');
    await waitFor(() => {
      expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    });
  });

  it('pre-fills location', async () => {
    renderEdit('1');
    await waitFor(() => {
      expect(screen.getByDisplayValue('Warsaw, Poland')).toBeInTheDocument();
    });
  });

  it('shows pending applications warning for job 1', async () => {
    renderEdit('1');
    await waitFor(() => {
      expect(screen.getByText(/8 pending application/i)).toBeInTheDocument();
    });
  });

  it('does not show warning for job with no pending applications', async () => {
    renderEdit('3');
    await waitFor(() => screen.getByText('Edit Job'));
    expect(screen.queryByText(/pending application/i)).not.toBeInTheDocument();
  });

  it('renders not found message for unknown job', async () => {
    renderEdit('999');
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument());
  });

  it('allows changing the title', async () => {
    renderEdit('2');
    await waitFor(() => screen.getByDisplayValue('Backend Engineer'));
    const input = screen.getByDisplayValue('Backend Engineer') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Senior Backend Engineer' } });
    expect(input.value).toBe('Senior Backend Engineer');
  });
});
