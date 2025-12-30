import express, { Express } from 'express';
import corsConfig from '@config/cors.config';
import middlewareConfig from '@config/middleware.config';
import healthRouter from '@ui/routes/health.route';

const app: Express = express();

app.use(corsConfig);

middlewareConfig(app);

app.use('/health', healthRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  });
});

export default app;
