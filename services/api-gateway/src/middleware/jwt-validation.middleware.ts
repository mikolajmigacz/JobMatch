import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '@/shared/interfaces/request-with-user.interface';
import { JwtValidator } from '@/shared/domain/jwt';
import { PublicRouteDetector } from '@/proxy/infrastructure/route-detection';
import { ERROR_MESSAGES, JWT_CONFIG } from '@/shared/constants/auth.constants';

@Injectable()
export class JwtValidationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtValidator: JwtValidator,
    private readonly publicRouteDetector: PublicRouteDetector
  ) {}

  use(req: RequestWithUser, res: Response, next: NextFunction): void {
    const path = this.extractPath(req);

    if (this.publicRouteDetector.isPublicRoute(path)) {
      return next();
    }

    const token = this.extractToken(req);
    const payload = this.jwtValidator.validate(token);
    req.user = payload;
    next();
  }

  private extractPath(req: any): string {
    const originalUrl = req.originalUrl || req.url || '';
    return originalUrl.split('?')[0];
  }

  private extractToken(req: RequestWithUser): string {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith(JWT_CONFIG.BEARER_PREFIX)) {
      throw new UnauthorizedException(ERROR_MESSAGES.MISSING_AUTH_HEADER);
    }

    return authHeader.substring(JWT_CONFIG.BEARER_PREFIX.length);
  }
}
