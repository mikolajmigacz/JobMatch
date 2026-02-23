import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MatchPopup from '../components/MatchPopup';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('MatchPopup', () => {
  it('renders the match title', () => {
    render(<MatchPopup jobTitle="Frontend Dev" company="TechCorp" onClose={() => {}} />);
    expect(screen.getByText("It's a Match!")).toBeInTheDocument();
  });

  it('renders the job title and company', () => {
    render(<MatchPopup jobTitle="Frontend Dev" company="TechCorp" onClose={() => {}} />);
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });

  it('calls onClose when "Awesome!" button is clicked', () => {
    const onClose = vi.fn();
    render(<MatchPopup jobTitle="Dev" company="Co" onClose={onClose} />);
    fireEvent.click(screen.getByText('Awesome!'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay background is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<MatchPopup jobTitle="Dev" company="Co" onClose={onClose} />);
    // The overlay is the outermost div
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-closes after 3 seconds', () => {
    const onClose = vi.fn();
    render(<MatchPopup jobTitle="Dev" company="Co" onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close before 3 seconds', () => {
    const onClose = vi.fn();
    render(<MatchPopup jobTitle="Dev" company="Co" onClose={onClose} />);
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
