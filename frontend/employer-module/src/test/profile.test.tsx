import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import EmployerProfilePage from '../app/profile/page';

beforeEach(() => localStorage.clear());

describe('EmployerProfilePage', () => {
  it('renders Company Profile heading', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => expect(screen.getByText('Company Profile')).toBeInTheDocument());
  });

  it('renders Company Logo section', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => expect(screen.getByText('Company Logo')).toBeInTheDocument());
  });

  it('renders Company Information section', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => expect(screen.getByText('Company Information')).toBeInTheDocument());
  });

  it('renders Change Password section', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument()
    );
  });

  it('renders Account Actions section with delete button', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Delete Account/i })).toBeInTheDocument()
    );
  });

  it('shows default company name in info view', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());
  });

  it('shows Edit button in info view', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^Edit$/i })).toBeInTheDocument()
    );
  });

  it('clicking Edit shows the edit form', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /^Edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Edit$/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument()
    );
  });

  it('shows company name input when editing', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /^Edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Edit$/i }));
    await waitFor(() => {
      const input = screen.getByDisplayValue('Acme Corp');
      expect(input).toBeInTheDocument();
    });
  });

  it('Cancel button hides the edit form', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /^Edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Edit$/i }));
    await waitFor(() => screen.getByRole('button', { name: /Cancel/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^Edit$/i })).toBeInTheDocument()
    );
  });

  it('shows validation error for empty company name', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /^Edit$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Edit$/i }));
    await waitFor(() => screen.getByRole('button', { name: /Save Changes/i }));

    const nameInput = screen.getByDisplayValue('Acme Corp');
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() =>
      expect(screen.getByText(/Company name must be at least 2 characters/i)).toBeInTheDocument()
    );
  });

  it('renders password form fields', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => {
      expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText('New Password *', { exact: true })).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when passwords do not match', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByLabelText(/Current Password/i));

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: 'oldpass123' },
    });
    fireEvent.change(screen.getByLabelText('New Password *', { exact: true }), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { value: 'different456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await waitFor(() => expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument());
  });

  it('shows success banner after valid password change', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByLabelText(/Current Password/i));

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: 'oldpass123' },
    });
    fireEvent.change(screen.getByLabelText('New Password *', { exact: true }), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { value: 'newpass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await waitFor(() =>
      expect(screen.getByText(/Password changed successfully/i)).toBeInTheDocument()
    );
  });

  it('opens delete account confirmation modal', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /Delete Account/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));
    await waitFor(() =>
      expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeInTheDocument()
    );
  });

  it('closes delete modal on Cancel', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => screen.getByRole('button', { name: /Delete Account/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));
    await waitFor(() => screen.getByText(/Are you sure/i));
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }));
    await waitFor(() => expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument());
  });

  it('renders drag and drop zone', async () => {
    render(<EmployerProfilePage />);
    await waitFor(() => expect(screen.getByText(/Drag & drop an image/i)).toBeInTheDocument());
  });
});
