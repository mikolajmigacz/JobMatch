import { Injectable } from '@nestjs/common';
import { PUBLIC_ROUTES } from '@/shared/constants/auth.constants';

@Injectable()
export class PublicRouteDetector {
  private readonly publicRoutes: string[] = [
    PUBLIC_ROUTES.HEALTH,
    PUBLIC_ROUTES.AUTH_REGISTER,
    PUBLIC_ROUTES.AUTH_LOGIN,
  ];
  private readonly healthCheckPatterns = ['/health.check', '/health'];

  isPublicRoute(path: string): boolean {
    if (!path) {
      return false;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const cleanPath = normalizedPath.split('?')[0];

    if (this.publicRoutes.includes(cleanPath)) {
      return true;
    }

    if (cleanPath.includes('/public/')) {
      return true;
    }

    if (cleanPath.startsWith('/api/auth/')) {
      return true;
    }

    return this.healthCheckPatterns.some((pattern) => cleanPath.includes(pattern));
  }
}
