import express, { Express } from 'express';
import cors from 'cors';
import { healthRouter } from '@ui/routes/health.route';
import { createAnalysisRouter } from '@ui/routes/analysis.route';
import { EnvConfig } from '@config/env.config';

export async function createApp(config: EnvConfig): Promise<Express> {
  const app: Express = express();

  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/health', healthRouter);
  app.use('/api', await createAnalysisRouter());

  return app;
}
