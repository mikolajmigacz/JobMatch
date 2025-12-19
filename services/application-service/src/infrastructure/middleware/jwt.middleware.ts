import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'job_seeker' | 'employer';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function createJwtMiddleware(secret: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.slice(7);

    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      req.user = decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
    }

    next();
  };
}
