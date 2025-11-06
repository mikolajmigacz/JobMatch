/**
 * Shared Zod Schemas for JobMatch
 * Single source of truth for type validation
 */

import { z } from 'zod';

// ============= USER SCHEMAS =============

export const UserRoleSchema = z.enum(['job_seeker', 'employer']);

export const UserSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8),
  role: UserRoleSchema,
  name: z.string().min(2).max(100),
  companyName: z.string().optional(),
  companyLogoUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PublicUserSchema = UserSchema.omit({ password: true });

export const RegisterDtoSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    role: UserRoleSchema,
    name: z.string().min(2).max(100),
    companyName: z.string().min(2).max(200).optional(),
  })
  .refine(
    (data: { role: string; companyName?: string }) =>
      data.role !== 'employer' || data.companyName !== undefined,
    { message: 'Company name is required for employers', path: ['companyName'] }
  );

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ============= JOB SCHEMAS =============

export const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship']);

export const JobStatusSchema = z.enum(['active', 'closed']);

export const JobSchema = z.object({
  jobId: z.string().uuid(),
  employerId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().min(50).max(5000),
  location: z.string().min(2).max(100),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  employmentType: EmploymentTypeSchema,
  skills: z.array(z.string()).min(1).max(20),
  requirements: z.string().min(20).max(3000),
  companyName: z.string().min(2).max(200),
  status: JobStatusSchema.default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateJobDtoSchema = JobSchema.omit({
  jobId: true,
  employerId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const UpdateJobDtoSchema = CreateJobDtoSchema.partial();

// ============= APPLICATION SCHEMAS =============

export const ApplicationStatusSchema = z.enum(['pending', 'accepted', 'rejected']);

export const ApplicationSchema = z.object({
  applicationId: z.string().uuid(),
  jobId: z.string().uuid(),
  jobSeekerId: z.string().uuid(),
  employerId: z.string().uuid(),
  coverLetter: z.string().optional(),
  cvUrl: z.string().url().optional(),
  status: ApplicationStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  respondedAt: z.string().datetime().optional(),
});

export const ApplyToJobDtoSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().max(1000).optional(),
});

export const RespondToApplicationDtoSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

// ============= CV ANALYSIS SCHEMAS =============

export const CVAnalysisSchema = z.object({
  analysisId: z.string().uuid(),
  userId: z.string().uuid(),
  cvUrl: z.string().url(),
  extractedText: z.string(),
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  geminiResponse: z.record(z.any()),
  createdAt: z.string().datetime(),
});

export const UploadCVDtoSchema = z.object({
  // File type is validated at the HTTP layer
  // This schema is for JSON payloads
});

// ============= EMAIL SCHEMAS =============

export const EmailEventSchema = z.union([
  z.object({
    type: z.literal('APPLICATION_CREATED'),
    applicationId: z.string().uuid(),
    employerEmail: z.string().email(),
    jobTitle: z.string(),
    applicantName: z.string(),
    applicantEmail: z.string().email(),
  }),
  z.object({
    type: z.literal('APPLICATION_ACCEPTED'),
    applicationId: z.string().uuid(),
    jobSeekerEmail: z.string().email(),
    jobTitle: z.string(),
    companyName: z.string(),
    companyLogoUrl: z.string().url().optional(),
  }),
  z.object({
    type: z.literal('APPLICATION_REJECTED'),
    applicationId: z.string().uuid(),
    jobSeekerEmail: z.string().email(),
    jobTitle: z.string(),
    companyName: z.string(),
  }),
]);

// ============= RESPONSE SCHEMAS =============

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: PublicUserSchema,
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string().datetime(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});
