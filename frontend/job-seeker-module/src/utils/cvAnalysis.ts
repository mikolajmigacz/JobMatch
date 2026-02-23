import { CVAnalysisResult } from '../types/cv';

const KEY = 'jobmatch_cv_analyses';

export const getCVAnalyses = (): CVAnalysisResult[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveCVAnalysis = (result: CVAnalysisResult): void => {
  const existing = getCVAnalyses();
  localStorage.setItem(KEY, JSON.stringify([result, ...existing].slice(0, 10)));
};

export const mockAnalyze = (fileName: string): CVAnalysisResult => ({
  id: `${Date.now()}`,
  fileName,
  analyzedAt: new Date().toISOString(),
  score: Math.floor(60 + Math.random() * 35),
  strengths: [
    'Clear and concise summary section',
    'Well-structured work experience with measurable outcomes',
    'Relevant technical skills highlighted',
  ],
  improvements: [
    'Add more quantifiable achievements (e.g., "increased sales by 20%")',
    'Include keywords from target job descriptions',
    'Expand education section with relevant coursework',
  ],
  suggestions: [
    'Consider adding a LinkedIn profile URL',
    'Tailor the summary to each specific role',
    'Add a dedicated achievements section',
    'Use stronger action verbs at the start of bullet points',
  ],
});
