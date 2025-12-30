import { S3Service } from '@infrastructure/clients/s3.client';
import { CVAnalysisRepository } from '@infrastructure/dynamodb/cv-analysis.repository';
import { CVAnalysis } from '@shared/schemas';

export class GetSingleAnalysisUseCase {
  constructor(
    private repository: CVAnalysisRepository,
    private s3Service: S3Service
  ) {}

  async execute(
    analysisId: string,
    userId: string
  ): Promise<
    | (CVAnalysis & {
        analysisId: string;
        userId: string;
        cvS3Key: string;
        cvDownloadUrl: string;
      })
    | null
  > {
    const analysis = await this.repository.findById(analysisId);

    if (!analysis) {
      return null;
    }

    if (analysis.userId !== userId) {
      throw new Error('Forbidden: You do not own this analysis');
    }

    const cvDownloadUrl = await this.s3Service.generatePresignedUrl(analysis.cvS3Key, 3600);

    return {
      ...analysis,
      cvDownloadUrl,
    };
  }
}
