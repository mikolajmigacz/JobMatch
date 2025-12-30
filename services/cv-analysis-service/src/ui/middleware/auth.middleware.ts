import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'job-seeker' | 'employer';
    email: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  // TODO: Verify token with auth-service
  // For now, decode simple JWT (in production, call auth-service)
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    (req as AuthenticatedRequest).user = {
      userId: payload.userId || payload.sub,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireJobSeeker = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as AuthenticatedRequest).user;

  if (!user || user.role !== 'job-seeker') {
    res.status(403).json({ error: 'Only job seekers can access this endpoint' });
    return;
  }

  next();
};
