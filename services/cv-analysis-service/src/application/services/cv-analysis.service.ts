import { GeminiClient } from '@infrastructure/clients/gemini.client';
import { S3Service } from '@infrastructure/clients/s3.client';
import { PDFService } from '@infrastructure/services/pdf.service';
import { EnvConfig } from '@config/env.config';
import { CVAnalysis } from '@shared/schemas';

export class CVAnalysisService {
  private geminiClient: GeminiClient;
  private s3Service: S3Service;
  private pdfService: PDFService;

  constructor(config: EnvConfig) {
    this.geminiClient = new GeminiClient(config);
    this.s3Service = new S3Service(config);
    this.pdfService = new PDFService();
  }

  async analyzeCVFromS3(s3Key: string): Promise<CVAnalysis> {
    const cvBuffer = await this.s3Service.downloadCV(s3Key);
    const cvText = await this.pdfService.extractText(cvBuffer);
    return this.geminiClient.analyzeCV(cvText);
  }

  async analyzeCVText(cvText: string): Promise<CVAnalysis> {
    return this.geminiClient.analyzeCV(cvText);
  }
}
