import { CVAnalysis } from '@shared/schemas';

export interface CVAnalysisEntityItem {
  analysisId: string;
  userId: string;
  cvS3Key: string;
  overallScore: number;
  skills: Array<{
    name: string;
    level: string;
    yearsOfExperience?: number;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    year?: string;
  }>;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  createdAt: string;
  updatedAt: string;
}

export function toCVAnalysis(item: CVAnalysisEntityItem): CVAnalysis & {
  analysisId: string;
  userId: string;
  cvS3Key: string;
  createdAt: string;
  updatedAt: string;
} {
  return {
    analysisId: item.analysisId,
    userId: item.userId,
    cvS3Key: item.cvS3Key,
    overallScore: item.overallScore,
    skills: item.skills,
    experience: item.experience,
    education: item.education,
    summary: item.summary,
    strengths: item.strengths,
    weaknesses: item.weaknesses,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
