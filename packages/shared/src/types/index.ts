import { z } from 'zod';
import * as schemas from '../schemas';

// User types
export type UserRole = z.infer<typeof schemas.UserRoleSchema>;
export type User = z.infer<typeof schemas.UserSchema>;
export type PublicUser = z.infer<typeof schemas.PublicUserSchema>;
export type RegisterDto = z.infer<typeof schemas.RegisterDtoSchema>;
export type LoginDto = z.infer<typeof schemas.LoginDtoSchema>;
export type UpdateUserDto = z.infer<typeof schemas.UpdateUserDtoSchema>;

// Job types
export type EmploymentType = z.infer<typeof schemas.EmploymentTypeSchema>;
export type JobStatus = z.infer<typeof schemas.JobStatusSchema>;
export type Job = z.infer<typeof schemas.JobSchema>;
export type CreateJobDto = z.infer<typeof schemas.CreateJobDtoSchema>;
export type UpdateJobDto = z.infer<typeof schemas.UpdateJobDtoSchema>;
export type JobFilter = z.infer<typeof schemas.JobFilterSchema>;

// Application types
export type ApplicationStatus = z.infer<typeof schemas.ApplicationStatusSchema>;
export type Application = z.infer<typeof schemas.ApplicationSchema>;
export type ApplyToJobDto = z.infer<typeof schemas.ApplyToJobDtoSchema>;
export type RespondToApplicationDto = z.infer<typeof schemas.RespondToApplicationDtoSchema>;
export type ApplicationFilter = z.infer<typeof schemas.ApplicationFilterSchema>;

// CV Analysis types
export type GeminiResponse = z.infer<typeof schemas.GeminiResponseSchema>;
export type CVAnalysis = z.infer<typeof schemas.CVAnalysisSchema>;
export type UploadCVDto = z.infer<typeof schemas.UploadCVDtoSchema>;
export type CVAnalysisHistoryFilter = z.infer<typeof schemas.CVAnalysisHistoryFilterSchema>;

// Response types
export type AuthResponse = z.infer<typeof schemas.AuthResponseSchema>;
export type ErrorResponse = z.infer<typeof schemas.ErrorResponseSchema>;
export type PaginatedResponse = z.infer<typeof schemas.PaginatedResponseSchema>;

// Email types
export type EmailType = z.infer<typeof schemas.EmailTypeSchema>;
export type EmailStatus = z.infer<typeof schemas.EmailStatusSchema>;
export type EmailEvent = z.infer<typeof schemas.EmailEventSchema>;
export type EmailLog = z.infer<typeof schemas.EmailLogSchema>;
export type SendEmailDto = z.infer<typeof schemas.SendEmailDtoSchema>;
export type EmailHistoryFilter = z.infer<typeof schemas.EmailHistoryFilterSchema>;

// Re-export main schemas
export {
  UserRoleSchema,
  PasswordSchema,
  EmailSchema,
  UserSchema,
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
