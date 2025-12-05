import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@shared/types';

export function createJwtMiddleware(secret: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      req.user = decoded;
      next();
    } catch {
      return next();
    }
  };
}
