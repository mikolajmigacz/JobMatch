import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ProfilePage from '../app/profile/page';

beforeEach(() => localStorage.clear());

describe('ProfilePage', () => {
  it('renders the My Profile heading', async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('My Profile')).toBeInTheDocument());
  });

  it('displays default user name', async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  });

  it('displays default user email', async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText('john.doe@example.com')).toBeInTheDocument());
  });

  it('shows Edit Profile button', async () => {
    render(<ProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
    );
  });

  it('shows Save Changes button when editing', async () => {
    render(<ProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /Edit Profile/i }));

    fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
    );
  });

  it('shows Change Password button', async () => {
    render(<ProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument()
    );
  });

  it('shows Delete Account button', async () => {
    render(<ProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Delete Account/i })).toBeInTheDocument()
    );
  });

  it('shows delete confirmation modal when Delete Account is clicked', async () => {
    render(<ProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /Delete Account/i }));

    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));

    await waitFor(() => expect(screen.getByText('Delete Account?')).toBeInTheDocument());
  });

  it('closes delete modal when Cancel is clicked', async () => {
    render(<ProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /Delete Account/i }));

    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));
    await waitFor(() => screen.getByText('Delete Account?'));

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => expect(screen.queryByText('Delete Account?')).not.toBeInTheDocument());
  });

  it('renders Change Password section heading', async () => {
    render(<ProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /Change Password/i })).toBeInTheDocument()
    );
  });
});
