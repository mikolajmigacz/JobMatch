import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MatchModal from '../components/MatchModal';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('MatchModal', () => {
  it('renders the match title', () => {
    render(
      <MatchModal applicantName="Anna Kowalska" jobTitle="Frontend Developer" onClose={() => {}} />
    );
    expect(screen.getByText("It's a Match!")).toBeInTheDocument();
  });

  it('renders the applicant name', () => {
    render(
      <MatchModal applicantName="Anna Kowalska" jobTitle="Frontend Developer" onClose={() => {}} />
    );
    expect(screen.getByText('Anna Kowalska')).toBeInTheDocument();
  });

  it('renders the job title', () => {
    render(
      <MatchModal applicantName="Anna Kowalska" jobTitle="Frontend Developer" onClose={() => {}} />
    );
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('renders celebration message', () => {
    render(<MatchModal applicantName="Anna" jobTitle="Dev" onClose={() => {}} />);
    expect(screen.getByText(/You accepted this application/i)).toBeInTheDocument();
  });

  it('renders the close button', () => {
    render(<MatchModal applicantName="Anna" jobTitle="Dev" onClose={() => {}} />);
    expect(screen.getByRole('button', { name: /Awesome/i })).toBeInTheDocument();
  });

  it('calls onClose when "Awesome!" button is clicked', () => {
    const onClose = vi.fn();
    render(<MatchModal applicantName="Anna" jobTitle="Dev" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /Awesome/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay background is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MatchModal applicantName="Anna" jobTitle="Dev" onClose={onClose} />
    );
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after 3 seconds', () => {
    const onClose = vi.fn();
    render(<MatchModal applicantName="Anna" jobTitle="Dev" onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close before 3 seconds', () => {
    const onClose = vi.fn();
    render(<MatchModal applicantName="Anna" jobTitle="Dev" onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
