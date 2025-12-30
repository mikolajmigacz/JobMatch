import { Router, type Router as RouterType, Request, Response } from 'express';
import { loadEnvConfig } from '@config/env.config';
import {
  UploadAndAnalyzeCVUseCase,
  GetAnalysisHistoryUseCase,
  GetSingleAnalysisUseCase,
} from '@application/use-cases';
import { S3Service } from '@infrastructure/clients/s3.client';
import { PDFService } from '@infrastructure/services/pdf.service';
import { GeminiClient } from '@infrastructure/clients/gemini.client';
import { CVAnalysisRepository } from '@infrastructure/dynamodb/cv-analysis.repository';
import { createDynamoDBClient } from '@infrastructure/dynamodb/client';
import {
  authenticateToken,
  requireJobSeeker,
  AuthenticatedRequest,
} from '@ui/middleware/auth.middleware';
import { uploadMiddleware, handleMulterError } from '@ui/middleware/upload.middleware';

export const createAnalysisRouter = async (): Promise<RouterType> => {
  const router = Router();
  const config = await loadEnvConfig();

  const s3Service = new S3Service(config);
  const pdfService = new PDFService();
  const geminiClient = new GeminiClient(config);
  const dynamoClient = createDynamoDBClient(config);
  const repository = new CVAnalysisRepository(dynamoClient);

  const uploadAndAnalyzeUseCase = new UploadAndAnalyzeCVUseCase(
    s3Service,
    pdfService,
    geminiClient,
    repository
  );
  const getAnalysisHistoryUseCase = new GetAnalysisHistoryUseCase(repository);
  const getSingleAnalysisUseCase = new GetSingleAnalysisUseCase(repository, s3Service);

  router.post(
    '/cv-analysis',
    authenticateToken,
    requireJobSeeker,
    uploadMiddleware.single('cv'),
    handleMulterError,
    async (req: Request, res: Response) => {
      try {
        const user = (req as AuthenticatedRequest).user;
        const file = req.file;

        if (!user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }

        if (!file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        const result = await uploadAndAnalyzeUseCase.execute(user.userId, file.buffer);

        res.status(201).json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
      }
    }
  );

  router.get(
    '/cv-analysis/history',
    authenticateToken,
    requireJobSeeker,
    async (req: Request, res: Response) => {
      try {
        const user = (req as AuthenticatedRequest).user;

        if (!user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }

        const history = await getAnalysisHistoryUseCase.execute(user.userId);

        res.json(history);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
      }
    }
  );

  router.get(
    '/cv-analysis/:analysisId',
    authenticateToken,
    requireJobSeeker,
    async (req: Request, res: Response) => {
      try {
        const user = (req as AuthenticatedRequest).user;
        const { analysisId } = req.params;

        if (!user) {
          res.status(401).json({ error: 'User not authenticated' });
          return;
        }

        const analysis = await getSingleAnalysisUseCase.execute(analysisId, user.userId);

        if (!analysis) {
          res.status(404).json({ error: 'Analysis not found' });
          return;
        }

        res.json(analysis);
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('Forbidden')) {
          res.status(403).json({ error: error.message });
          return;
        }

        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
      }
    }
  );

  return router;
};
