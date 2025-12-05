import { Request } from 'express';
import { TokenPayload } from './token';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
