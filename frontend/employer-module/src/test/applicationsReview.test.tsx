import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JobApplicationsPage from '../app/my-jobs/[jobId]/applications/page';

/** Creates a tagged promise that our setup.tsx React.use mock resolves synchronously */
const taggedParams = (jobId: string) => {
  const p = Promise.resolve({ jobId }) as Promise<{ jobId: string }> & {
    _testValue: { jobId: string };
  };
  p._testValue = { jobId };
  return p;
};

const renderPage = (jobId: string) => render(<JobApplicationsPage params={taggedParams(jobId)} />);

describe('JobApplicationsPage', () => {
  it('renders the job title as header', async () => {
    renderPage('1');
    await waitFor(() => expect(screen.getByText('Frontend Developer')).toBeInTheDocument());
  });

  it('renders job meta (company, location)', async () => {
    renderPage('1');
    await waitFor(() => expect(screen.getByText(/Acme Corp/)).toBeInTheDocument());
  });

  it('renders filter buttons', async () => {
    renderPage('1');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /accepted/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rejected/i })).toBeInTheDocument();
    });
  });

  it('renders applicant cards', async () => {
    renderPage('1');
    await waitFor(() => expect(screen.getByText('Anna Kowalska')).toBeInTheDocument());
    expect(screen.getByText('Piotr Nowak')).toBeInTheDocument();
  });

  it('renders applicant emails', async () => {
    renderPage('1');
    await waitFor(() => expect(screen.getByText('anna.kowalska@email.com')).toBeInTheDocument());
  });

  it('renders CV download buttons', async () => {
    renderPage('1');
    await waitFor(() => {
      const cvBtns = screen.getAllByText(/Download CV/i);
      expect(cvBtns.length).toBeGreaterThan(0);
    });
  });

  it('renders Accept/Reject buttons for pending applications', async () => {
    renderPage('1');
    await waitFor(() => {
      const acceptBtns = screen.getAllByText(/✓ Accept/i);
      const rejectBtns = screen.getAllByText(/✕ Reject/i);
      expect(acceptBtns.length).toBeGreaterThan(0);
      expect(rejectBtns.length).toBeGreaterThan(0);
    });
  });

  it('filter by pending shows only pending apps', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Anna Kowalska'));

    const pendingBtn = screen.getByRole('button', { name: /^Pending/i });
    fireEvent.click(pendingBtn);

    expect(screen.getByText('Anna Kowalska')).toBeInTheDocument();
    expect(screen.getByText('Piotr Nowak')).toBeInTheDocument();
    expect(screen.queryByText('Marta Wiśniewska')).not.toBeInTheDocument();
  });

  it('filter by accepted shows only accepted apps', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Marta Wiśniewska'));

    const acceptedBtn = screen.getByRole('button', { name: /^Accepted/i });
    fireEvent.click(acceptedBtn);

    expect(screen.getByText('Marta Wiśniewska')).toBeInTheDocument();
    expect(screen.queryByText('Anna Kowalska')).not.toBeInTheDocument();
  });

  it('filter by rejected shows only rejected apps', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Tomasz Zając'));

    const rejectedBtn = screen.getByRole('button', { name: /^Rejected/i });
    fireEvent.click(rejectedBtn);

    expect(screen.getByText('Tomasz Zając')).toBeInTheDocument();
    expect(screen.queryByText('Anna Kowalska')).not.toBeInTheDocument();
  });

  it('clicking Accept shows the match modal', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Anna Kowalska'));

    const acceptBtns = screen.getAllByText(/✓ Accept/i);
    fireEvent.click(acceptBtns[0]);

    await waitFor(() => expect(screen.getByText("It's a Match!")).toBeInTheDocument());
  });

  it('match modal shows applicant name and job title', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Anna Kowalska'));

    fireEvent.click(screen.getAllByText(/✓ Accept/i)[0]);

    await waitFor(() => {
      // Name appears in both the card and the modal
      expect(screen.getAllByText('Anna Kowalska').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText('Frontend Developer').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('clicking Reject changes the application status', async () => {
    renderPage('1');
    await waitFor(() => screen.getByText('Piotr Nowak'));

    const rejectBtns = screen.getAllByText(/✕ Reject/i);
    fireEvent.click(rejectBtns[0]);

    // After reject, the pending count should decrease (no more reject button for that card)
    await waitFor(() => {
      const acceptBtns = screen.queryAllByText(/✓ Accept/i);
      expect(acceptBtns.length).toBeLessThan(2);
    });
  });

  it('renders not found for unknown job', async () => {
    renderPage('999');
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument());
  });

  it('shows empty state when filtering with no results', async () => {
    renderPage('3');
    await waitFor(() => screen.getByText('DevOps Engineer'));

    const pendingBtn = screen.getByRole('button', { name: /^Pending/i });
    fireEvent.click(pendingBtn);

    expect(screen.getByText(/No pending applications/i)).toBeInTheDocument();
  });
});
