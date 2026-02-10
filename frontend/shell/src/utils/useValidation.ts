'use client';

import {
  LoginDtoSchema,
  JobSeekerRegisterSchema,
  EmployerRegisterSchema,
  type LoginRequest,
  type JobSeekerRegister,
  type EmployerRegister,
} from '@jobmatch/shared';

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function useValidation() {
  const validateLogin = (data: unknown): ValidationResult<LoginRequest> => {
    try {
      const validated = LoginDtoSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error instanceof Error) {
        errors.general = error.message;
      }
      return { success: false, errors };
    }
  };

  const validateJobSeekerRegister = (data: unknown): ValidationResult<JobSeekerRegister> => {
    try {
      const validated = JobSeekerRegisterSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error instanceof Error) {
        errors.general = error.message;
      }
      return { success: false, errors };
    }
  };

  const validateEmployerRegister = (data: unknown): ValidationResult<EmployerRegister> => {
    try {
      const validated = EmployerRegisterSchema.parse(data);
      return { success: true, data: validated };
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error instanceof Error) {
        errors.general = error.message;
      }
      return { success: false, errors };
    }
  };

  return {
    validateLogin,
    validateJobSeekerRegister,
    validateEmployerRegister,
  };
}
