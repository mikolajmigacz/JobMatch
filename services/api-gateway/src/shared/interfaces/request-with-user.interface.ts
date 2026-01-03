import { Request } from 'express';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user?: TokenPayload;
}
