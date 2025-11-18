/**
 * Shared Zod Schemas for JobMatch
 * Single source of truth for type validation
 */

import { z } from 'zod';

// ============= USER SCHEMAS =============

export const UserRoleSchema = z.enum(['job_seeker', 'employer']);

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const EmailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email must be at most 255 characters')
  .toLowerCase();

export const UserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRoleSchema,
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be at most 200 characters')
    .nullable()
    .optional(),
  companyLogoUrl: z.string().url('Invalid company logo URL').nullable().optional(),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

export const PublicUserSchema = UserSchema.omit({ password: true });

// Register schemas with role-specific variants
export const JobSeekerRegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: z.literal(UserRoleSchema.Enum.job_seeker),
  name: z.string().min(2).max(100),
});

export const EmployerRegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: z.literal(UserRoleSchema.Enum.employer),
  name: z.string().min(2).max(100),
  companyName: z.string().min(2).max(200),
});

export const RegisterDtoSchema = z.discriminatedUnion('role', [
  JobSeekerRegisterSchema,
  EmployerRegisterSchema,
]);

export const LoginDtoSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const UpdateUserDtoSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    companyName: z.string().min(2).max(200).optional(),
    companyLogoUrl: z.string().url().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  });

export const GetProfileRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const UpdateProfileRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z.string().min(2).max(100).optional(),
  companyName: z.string().min(2).max(200).optional(),
  companyLogoUrl: z.string().url().nullable().optional(),
});

// ============= JOB SCHEMAS =============

export const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship']);

export const JobStatusSchema = z.enum(['active', 'closed']);

const JobSchemaBase = z.object({
  jobId: z.string().uuid('Invalid job ID format'),
  employerId: z.string().uuid('Invalid employer ID format'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be at most 5000 characters'),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be at most 100 characters'),
  salaryMin: z
    .number()
    .int('Salary must be an integer')
    .positive('Salary must be positive')
    .optional(),
  salaryMax: z
    .number()
    .int('Salary must be an integer')
    .positive('Salary must be positive')
    .optional(),
  employmentType: EmploymentTypeSchema,
  skills: z
    .array(z.string().min(1).max(50))
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills allowed')
    .default([]),
  requirements: z
    .string()
    .min(20, 'Requirements must be at least 20 characters')
    .max(3000, 'Requirements must be at most 3000 characters'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be at most 200 characters'),
  status: JobStatusSchema.default('active'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

export const JobSchema = JobSchemaBase.refine(
  (data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
  {
    message: 'Minimum salary must be less than or equal to maximum salary',
    path: ['salaryMax'],
  }
);

export const CreateJobDtoSchema = JobSchemaBase.omit({
  jobId: true,
  employerId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
}).refine((data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax, {
  message: 'Minimum salary must be less than or equal to maximum salary',
  path: ['salaryMax'],
});

const UpdateJobSchemaBase = JobSchemaBase.omit({
  jobId: true,
  employerId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
}).partial();

export const UpdateJobDtoSchema = UpdateJobSchemaBase.refine(
  (data: Record<string, unknown>) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided for update' }
);

export const JobFilterSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.array(EmploymentTypeSchema).optional(),
  skills: z.array(z.string()).optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['createdAt', 'title', 'salaryMax']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============= APPLICATION SCHEMAS =============

export const ApplicationStatusSchema = z.enum(['pending', 'accepted', 'rejected']);

export const ApplicationSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID format'),
  jobId: z.string().uuid('Invalid job ID format'),
  jobSeekerId: z.string().uuid('Invalid job seeker ID format'),
  employerId: z.string().uuid('Invalid employer ID format'),
  coverLetter: z
    .string()
    .max(1000, 'Cover letter must be at most 1000 characters')
    .nullable()
    .optional(),
  cvUrl: z.string().url('Invalid CV URL').nullable().optional(),
  status: ApplicationStatusSchema,
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  respondedAt: z.string().datetime('Invalid response date').nullable().optional(),
});

export const ApplyToJobDtoSchema = z.object({
  jobId: z.string().uuid('Invalid job ID format'),
  coverLetter: z.string().max(1000, 'Cover letter must be at most 1000 characters').optional(),
});

export const RespondToApplicationDtoSchema = z.object({
  status: z.enum(['accepted', 'rejected'], {
    errorMap: () => ({ message: 'Status must be either accepted or rejected' }),
  }),
});

export const ApplicationFilterSchema = z.object({
  jobId: z.string().uuid().optional(),
  jobSeekerId: z.string().uuid().optional(),
  employerId: z.string().uuid().optional(),
  status: z.array(ApplicationStatusSchema).optional().default(['pending', 'accepted', 'rejected']),
  sortBy: z.enum(['createdAt', 'respondedAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// ============= CV ANALYSIS SCHEMAS =============

export const GeminiResponseSchema = z.object({
  score: z.number().int().min(0).max(100, 'Score must be between 0 and 100'),
  strengths: z
    .array(z.string().min(5).max(200))
    .min(1, 'At least one strength required')
    .max(10, 'Maximum 10 strengths allowed'),
  improvements: z
    .array(z.string().min(5).max(200))
    .min(1, 'At least one improvement required')
    .max(10, 'Maximum 10 improvements allowed'),
  suggestions: z.array(z.string().min(5).max(300)).default([]),
});

export const CVAnalysisSchema = z.object({
  analysisId: z.string().uuid('Invalid analysis ID format'),
  userId: z.string().uuid('Invalid user ID format'),
  cvUrl: z.string().url('Invalid CV URL'),
  extractedText: z
    .string()
    .min(50, 'Extracted text must be at least 50 characters')
    .max(10000, 'Extracted text must be at most 10000 characters'),
  score: z
    .number()
    .int('Score must be an integer')
    .min(0, 'Score must be at least 0')
    .max(100, 'Score must be at most 100'),
  strengths: z
    .array(z.string().min(5).max(200))
    .min(1, 'At least one strength required')
    .max(10, 'Maximum 10 strengths allowed'),
  improvements: z
    .array(z.string().min(5).max(200))
    .min(1, 'At least one improvement required')
    .max(10, 'Maximum 10 improvements allowed'),
  suggestions: z.array(z.string().min(5).max(300)).default([]),
  geminiResponse: GeminiResponseSchema,
  createdAt: z.string().datetime('Invalid creation date'),
});

export const UploadCVDtoSchema = z.object({
  fileSize: z
    .number()
    .int()
    .positive('File size must be positive')
    .max(5242880, 'File must be max 5MB')
    .optional(),
  fileName: z.string().min(1).max(255).optional(),
});

export const CVAnalysisHistoryFilterSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  sortBy: z.enum(['createdAt', 'score']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
});

// ============= EMAIL SCHEMAS =============

export const EmailTypeSchema = z.enum([
  'APPLICATION_CREATED',
  'APPLICATION_ACCEPTED',
  'APPLICATION_REJECTED',
]);

export const EmailStatusSchema = z.enum(['sent', 'failed']);

export const EmailEventSchema = z.union([
  z.object({
    type: z.literal('APPLICATION_CREATED'),
    applicationId: z.string().uuid('Invalid application ID'),
    employerEmail: z.string().email('Invalid employer email'),
    employerName: z.string().min(1).max(200),
    jobTitle: z.string().min(1).max(200),
    applicantName: z.string().min(1).max(200),
    applicantEmail: z.string().email('Invalid applicant email'),
    coverLetter: z.string().max(1000).optional(),
  }),
  z.object({
    type: z.literal('APPLICATION_ACCEPTED'),
    applicationId: z.string().uuid('Invalid application ID'),
    jobSeekerEmail: z.string().email('Invalid job seeker email'),
    jobSeekerName: z.string().min(1).max(200),
    jobTitle: z.string().min(1).max(200),
    companyName: z.string().min(1).max(200),
    companyLogoUrl: z.string().url('Invalid logo URL').optional(),
    employerEmail: z.string().email('Invalid employer email').optional(),
  }),
  z.object({
    type: z.literal('APPLICATION_REJECTED'),
    applicationId: z.string().uuid('Invalid application ID'),
    jobSeekerEmail: z.string().email('Invalid job seeker email'),
    jobSeekerName: z.string().min(1).max(200),
    jobTitle: z.string().min(1).max(200),
    companyName: z.string().min(1).max(200),
  }),
]);

export const EmailLogSchema = z.object({
  emailId: z.string().uuid('Invalid email ID format'),
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientUserId: z.string().uuid('Invalid recipient user ID'),
  subject: z.string().min(1).max(255, 'Subject must be at most 255 characters'),
  htmlContent: z
    .string()
    .min(10, 'HTML content must be at least 10 characters')
    .max(50000, 'HTML content must be at most 50000 characters'),
  plainTextContent: z
    .string()
    .min(10, 'Plain text must be at least 10 characters')
    .max(10000, 'Plain text must be at most 10000 characters'),
  type: EmailTypeSchema,
  status: EmailStatusSchema,
  sentAt: z.string().datetime('Invalid sent date'),
  failureReason: z
    .string()
    .max(500, 'Failure reason must be at most 500 characters')
    .nullable()
    .optional(),
});

export const SendEmailDtoSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z.string().min(1).max(255),
  htmlContent: z.string().min(10).max(50000),
  plainTextContent: z.string().min(10).max(10000),
  type: EmailTypeSchema,
});

export const EmailHistoryFilterSchema = z.object({
  recipientUserId: z.string().uuid('Invalid user ID'),
  status: z.array(EmailStatusSchema).optional(),
  type: z.array(EmailTypeSchema).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

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
