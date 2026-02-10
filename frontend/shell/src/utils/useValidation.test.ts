import { renderHook } from '@testing-library/react';
import { useValidation } from './useValidation';

describe('useValidation', () => {
  it('validates login successfully', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateLogin({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid email on login', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateLogin({
      email: 'invalid',
      password: 'password',
    });
    expect(valid.success).toBe(false);
  });

  it('validates job seeker registration', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateJobSeekerRegister({
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
      role: 'job_seeker',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects job seeker with short name', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateJobSeekerRegister({
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'A',
      role: 'job_seeker',
    });
    expect(valid.success).toBe(false);
  });

  it('validates employer registration', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateEmployerRegister({
      email: 'employer@example.com',
      password: 'TestPassword123!',
      name: 'Employer',
      role: 'employer',
      companyName: 'Acme Corp',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects employer without company name', () => {
    const { result } = renderHook(() => useValidation());
    const valid = result.current.validateEmployerRegister({
      email: 'employer@example.com',
      password: 'TestPassword123!',
      name: 'Employer',
      role: 'employer',
    } as never);
    expect(valid.success).toBe(false);
  });
});
