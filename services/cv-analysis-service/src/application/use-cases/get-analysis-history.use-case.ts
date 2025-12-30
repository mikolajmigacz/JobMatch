import { CVAnalysisRepository } from '@infrastructure/dynamodb/cv-analysis.repository';
import { CVAnalysis } from '@shared/schemas';

export class GetAnalysisHistoryUseCase {
  constructor(private repository: CVAnalysisRepository) {}

  async execute(
    userId: string
  ): Promise<Array<CVAnalysis & { analysisId: string; userId: string; cvS3Key: string }>> {
    return this.repository.findByUserId(userId);
  }
}
