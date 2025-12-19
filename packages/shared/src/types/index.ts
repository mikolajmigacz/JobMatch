import { z } from 'zod';
import * as schemas from '../schemas';

// User types - only public types exported to frontend
export type UserRole = z.infer<typeof schemas.UserRoleSchema>;
export type Email = z.infer<typeof schemas.EmailSchema>;
export type PublicUser = z.infer<typeof schemas.PublicUserSchema>;
export type RegisterRequest = z.infer<typeof schemas.RegisterDtoSchema>;
export type LoginRequest = z.infer<typeof schemas.LoginDtoSchema>;
export type UpdateUserRequest = z.infer<typeof schemas.UpdateUserDtoSchema>;
export type GetProfileRequest = z.infer<typeof schemas.GetProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof schemas.UpdateProfileRequestSchema>;
export type UploadLogoRequest = z.infer<typeof schemas.UploadLogoRequestSchema>;
export type DeleteUserRequest = z.infer<typeof schemas.DeleteUserRequestSchema>;
export type GetProfileResponse = PublicUser | null;
export type UpdateProfileResponse = PublicUser | null;
export type UploadLogoResponse = PublicUser | null;
export type DeleteUserResponse = void;

// Inter-service User DTO (for service-to-service communication)
export interface UserDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Job types
export type EmploymentType = z.infer<typeof schemas.EmploymentTypeSchema>;
export type JobStatus = z.infer<typeof schemas.JobStatusSchema>;
export type Job = z.infer<typeof schemas.JobSchema>;
export type CreateJobRequest = z.infer<typeof schemas.CreateJobDtoSchema>;
export type UpdateJobRequest = z.infer<typeof schemas.UpdateJobRequestSchema>;
export type DeleteJobRequest = z.infer<typeof schemas.DeleteJobRequestSchema>;
export type JobFilterRequest = z.infer<typeof schemas.JobFilterSchema>;
export type GetMyJobsRequest = z.infer<typeof schemas.GetMyJobsFilterSchema>;

export interface GetAllJobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetMyJobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type GetJobResponse = Job | null;
export type CreateJobResponse = Job;
export type UpdateJobResponse = Job;
export interface DeleteJobResponse {
  success: boolean;
  jobId: string;
}

// Inter-service Job DTO (for service-to-service communication)
export interface JobDetails {
  jobId: string;
  title: string;
  status: JobStatus;
  employerId: string;
  companyName: string;
}

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

// Register request variants - role-specific
export type JobSeekerRegister = z.infer<typeof schemas.JobSeekerRegisterSchema>;
export type EmployerRegister = z.infer<typeof schemas.EmployerRegisterSchema>;

// Type guards with proper narrowing
export const isEmployerRegister = (request: RegisterRequest): request is EmployerRegister => {
  return request.role === 'employer';
};

export const isJobSeekerRegister = (request: RegisterRequest): request is JobSeekerRegister => {
  return request.role === 'job_seeker';
};

// Re-export main schemas - only public ones
export {
  UserRoleSchema,
  EmailSchema,
  PublicUserSchema,
  JobSeekerRegisterSchema,
  EmployerRegisterSchema,
  RegisterDtoSchema,
  LoginDtoSchema,
  UpdateUserDtoSchema,
  GetProfileRequestSchema,
  UpdateProfileRequestSchema,
  UploadLogoRequestSchema,
  DeleteUserRequestSchema,
  EmploymentTypeSchema,
  JobStatusSchema,
  JobSchema,
  CreateJobDtoSchema,
  UpdateJobDtoSchema,
  JobFilterSchema,
  GetMyJobsFilterSchema,
  UpdateJobRequestSchema,
  DeleteJobRequestSchema,
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
