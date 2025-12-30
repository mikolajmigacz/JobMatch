import { CVAnalysis } from '@shared/schemas';

export interface ICVAnalysisRepository {
  save(analysisId: string, userId: string, cvS3Key: string, analysis: CVAnalysis): Promise<void>;
  findById(analysisId: string): Promise<
    | (CVAnalysis & {
        analysisId: string;
        userId: string;
        cvS3Key: string;
        createdAt: string;
        updatedAt: string;
      })
    | null
  >;
  findByUserId(
    userId: string,
    limit?: number
  ): Promise<
    Array<
      CVAnalysis & {
        analysisId: string;
        userId: string;
        cvS3Key: string;
        createdAt: string;
        updatedAt: string;
      }
    >
  >;
  update(analysisId: string, analysis: Partial<CVAnalysis>): Promise<void>;
  delete(analysisId: string): Promise<void>;
}
