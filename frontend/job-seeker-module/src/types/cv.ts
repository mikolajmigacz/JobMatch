export interface CVAnalysisResult {
  id: string;
  fileName: string;
  analyzedAt: string;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}
