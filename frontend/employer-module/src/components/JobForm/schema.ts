import { z } from 'zod';
import { EmploymentTypeSchema } from '@jobmatch/shared';

export const JobFormSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
    location: z.string().min(2, 'Location must be at least 2 characters').max(100),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    employmentType: EmploymentTypeSchema,
    skills: z.array(z.string().min(1).max(50)).min(1, 'At least one skill is required').max(20),
    requirements: z.string().min(20, 'Requirements must be at least 20 characters').max(3000),
    companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  })
  .refine((data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax, {
    message: 'Minimum salary must be less than or equal to maximum salary',
    path: ['salaryMax'],
  });

export type JobFormValues = z.infer<typeof JobFormSchema>;
