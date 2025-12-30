import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '@infrastructure/clients/s3.client';
import { PDFService } from '@infrastructure/services/pdf.service';
import { GeminiClient } from '@infrastructure/clients/gemini.client';
import { CVAnalysisRepository } from '@infrastructure/dynamodb/cv-analysis.repository';
import { CVAnalysis } from '@shared/schemas';

export class UploadAndAnalyzeCVUseCase {
  constructor(
    private s3Service: S3Service,
    private pdfService: PDFService,
    private geminiClient: GeminiClient,
    private repository: CVAnalysisRepository
  ) {}

  async execute(
    userId: string,
    fileBuffer: Buffer
  ): Promise<CVAnalysis & { analysisId: string; cvS3Key: string }> {
    const analysisId = uuidv4();
    const cvS3Key = `cv/${userId}/${analysisId}.pdf`;

    await this.s3Service.uploadCV(cvS3Key, fileBuffer, 'application/pdf');

    const cvText = await this.pdfService.extractText(fileBuffer);

    const analysis = await this.geminiClient.analyzeCV(cvText);

    await this.repository.save(analysisId, userId, cvS3Key, analysis);

    const savedAnalysis = await this.repository.findById(analysisId);
    if (!savedAnalysis) {
      throw new Error('Failed to retrieve saved analysis');
    }

    return savedAnalysis;
  }
}
