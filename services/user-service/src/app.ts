import express, { Express } from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createAppRouter } from '@routers/index';
import { EnvConfig } from '@config/env.config';
import { UserRepository } from '@domain/repositories/user.repository';

export function createApp(config: EnvConfig, userRepository: UserRepository): Express {
  const app = express();
  const appRouter = createAppRouter(userRepository);

  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_, res) => {
    res.json({
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    });
  });

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    })
  );

  return app;
}
