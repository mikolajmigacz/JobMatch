import { z } from 'zod';
import * as schemas from '../schemas';

// User types - only public types exported to frontend
export type UserRole = z.infer<typeof schemas.UserRoleSchema>;
export type Email = z.infer<typeof schemas.EmailSchema>;
export type PublicUser = z.infer<typeof schemas.PublicUserSchema>;
export type RegisterRequest = z.infer<typeof schemas.RegisterDtoSchema>;
export type LoginRequest = z.infer<typeof schemas.LoginDtoSchema>;
export type UpdateUserRequest = z.infer<typeof schemas.UpdateUserDtoSchema>;

// Job types
export type EmploymentType = z.infer<typeof schemas.EmploymentTypeSchema>;
export type JobStatus = z.infer<typeof schemas.JobStatusSchema>;
export type Job = z.infer<typeof schemas.JobSchema>;
export type CreateJobRequest = z.infer<typeof schemas.CreateJobDtoSchema>;
export type UpdateJobRequest = z.infer<typeof schemas.UpdateJobDtoSchema>;
export type JobFilter = z.infer<typeof schemas.JobFilterSchema>;

// Application types
export type ApplicationStatus = z.infer<typeof schemas.ApplicationStatusSchema>;
export type Application = z.infer<typeof schemas.ApplicationSchema>;
export type ApplyToJobRequest = z.infer<typeof schemas.ApplyToJobDtoSchema>;
export type RespondToApplicationRequest = z.infer<typeof schemas.RespondToApplicationDtoSchema>;
export type ApplicationFilter = z.infer<typeof schemas.ApplicationFilterSchema>;

// CV Analysis types
export type GeminiResponse = z.infer<typeof schemas.GeminiResponseSchema>;
export type CVAnalysis = z.infer<typeof schemas.CVAnalysisSchema>;
export type UploadCVRequest = z.infer<typeof schemas.UploadCVDtoSchema>;
export type CVAnalysisHistoryFilter = z.infer<typeof schemas.CVAnalysisHistoryFilterSchema>;

// Email types
export type EmailType = z.infer<typeof schemas.EmailTypeSchema>;
export type EmailStatus = z.infer<typeof schemas.EmailStatusSchema>;
export type EmailEvent = z.infer<typeof schemas.EmailEventSchema>;
export type EmailLog = z.infer<typeof schemas.EmailLogSchema>;
export type SendEmailRequest = z.infer<typeof schemas.SendEmailDtoSchema>;
export type EmailHistoryFilter = z.infer<typeof schemas.EmailHistoryFilterSchema>;

// Response types
export type AuthResponse = z.infer<typeof schemas.AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof schemas.ErrorResponseSchema>;
export type Pagination = z.infer<typeof schemas.PaginationSchema>;
export type PaginatedResponse<T extends Record<string, unknown> = Record<string, unknown>> =
  z.infer<typeof schemas.PaginatedResponseSchema> & { data: T[] };

// Re-export main schemas - only public ones
export {
  UserRoleSchema,
  EmailSchema,
  PublicUserSchema,
  RegisterDtoSchema,
  LoginDtoSchema,
  UpdateUserDtoSchema,
  EmploymentTypeSchema,
  JobStatusSchema,
  JobSchema,
  CreateJobDtoSchema,
  UpdateJobDtoSchema,
  JobFilterSchema,
  ApplicationStatusSchema,
  ApplicationSchema,
  ApplyToJobDtoSchema,
  RespondToApplicationDtoSchema,
  ApplicationFilterSchema,
  GeminiResponseSchema,
  CVAnalysisSchema,
  UploadCVDtoSchema,
  CVAnalysisHistoryFilterSchema,
  EmailTypeSchema,
  EmailStatusSchema,
  EmailEventSchema,
  EmailLogSchema,
  SendEmailDtoSchema,
  EmailHistoryFilterSchema,
  AuthResponseSchema,
  ErrorResponseSchema,
  PaginationSchema,
  PaginatedResponseSchema,
} from '../schemas';
