import { Router, type Router as RouterType } from 'express';

const healthRouter: RouterType = Router();

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email Service is healthy',
    service: 'email-service',
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/ready', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email Service is ready',
    service: 'email-service',
  });
});

export default healthRouter;
