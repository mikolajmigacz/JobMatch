import { Router, type Router as RouterType } from 'express';

export const healthRouter: RouterType = Router();

healthRouter.get('/', (_, res) => {
  res.json({
    status: 'ok',
    service: 'cv-analysis-service',
    timestamp: new Date().toISOString(),
  });
});
