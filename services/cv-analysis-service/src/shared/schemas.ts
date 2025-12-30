import { z } from 'zod';

export const AnalyzeJobRequestSchema = z.object({
  cvText: z.string().min(1, 'CV text is required'),
  s3Key: z.string().optional(),
});

export type AnalyzeJobRequest = z.infer<typeof AnalyzeJobRequestSchema>;

export const CVAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
      yearsOfExperience: z.number().optional(),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      duration: z.string(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      year: z.string().optional(),
    })
  ),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;
