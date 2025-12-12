import express, { Express, Request } from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createAppRouter } from '@routers/index';
import { createJwtMiddleware } from '@infrastructure/middleware/jwt.middleware';
import { TokenPayload } from '@shared/types';
import { EnvConfig } from '@config/env.config';
import { UserRepository } from '@domain/repositories/user.repository';

export function createApp(config: EnvConfig, userRepository: UserRepository): Express {
  const app = express();
  const appRouter = createAppRouter(userRepository, config);
  const jwtMiddleware = createJwtMiddleware(config.JWT_SECRET);

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

  app.use(jwtMiddleware);

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }: { req: Request }) => {
        const user = req.user as TokenPayload | undefined;
        return {
          userId: user?.userId,
          role: user?.role,
        };
      },
    })
  );

  return app;
}
