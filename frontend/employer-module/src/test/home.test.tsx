import { render, screen } from '@testing-library/react';
import EmployerHomePage from '../app/page';

describe('EmployerHomePage', () => {
  it('renders the employer dashboard', () => {
    render(<EmployerHomePage />);
    expect(screen.getByText('Employer Dashboard')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<EmployerHomePage />);
    expect(screen.getByText('Browse Jobs')).toBeInTheDocument();
    expect(screen.getByText('My Jobs')).toBeInTheDocument();
    expect(screen.getByText('Post a Job')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
