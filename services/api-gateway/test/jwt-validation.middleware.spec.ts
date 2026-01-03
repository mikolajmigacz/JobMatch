import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtValidationMiddleware } from '@/middleware/jwt-validation.middleware';
import { RequestWithUser } from '@/shared/interfaces/request-with-user.interface';
import { JwtValidator } from '@/shared/domain/jwt';
import { PublicRouteDetector } from '@/proxy/infrastructure/route-detection';
import { sign, verify } from 'jsonwebtoken';

describe('JwtValidationMiddleware', () => {
  let middleware: JwtValidationMiddleware;
  const JWT_SECRET = 'test-secret-key-for-testing-only';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtValidationMiddleware,
        {
          provide: JwtValidator,
          useValue: {
            validate: jest.fn((token: string) => {
              try {
                return verify(token, JWT_SECRET) as any;
              } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                  throw new UnauthorizedException('Token has expired');
                }
                throw new UnauthorizedException('Invalid token');
              }
            }),
          },
        },
        {
          provide: PublicRouteDetector,
          useValue: {
            isPublicRoute: jest.fn((path: string) => {
              if (path === '/health') return true;
              if (path === '/api/auth/register') return true;
              if (path === '/api/auth/login') return true;
              return false;
            }),
          },
        },
      ],
    }).compile();

    middleware = module.get<JwtValidationMiddleware>(JwtValidationMiddleware);
  });

  const createMockRequest = (
    method: string,
    path: string,
    authHeader?: string
  ): RequestWithUser => {
    return {
      method,
      originalUrl: path,
      url: path,
      headers: authHeader ? { authorization: authHeader } : {},
    } as unknown as RequestWithUser;
  };

  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public Routes', () => {
    it('should allow GET /health without token', () => {
      const req = createMockRequest('GET', '/health');
      middleware.use(req, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should allow POST /api/auth/register without token', () => {
      const req = createMockRequest('POST', '/api/auth/register');
      middleware.use(req, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should allow POST /api/auth/login without token', () => {
      const req = createMockRequest('POST', '/api/auth/login');
      middleware.use(req, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });

  describe('Protected Routes', () => {
    it('should reject GET /api/users without token', () => {
      const req = createMockRequest('GET', '/api/users');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject GET /api/jobs without token', () => {
      const req = createMockRequest('GET', '/api/jobs');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject GET /api/jobs/:jobId without token', () => {
      const req = createMockRequest('GET', '/api/jobs/123');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject POST /api/jobs without token', () => {
      const req = createMockRequest('POST', '/api/jobs');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject PUT /api/jobs/:jobId without token', () => {
      const req = createMockRequest('PUT', '/api/jobs/123');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject DELETE /api/jobs/:jobId without token', () => {
      const req = createMockRequest('DELETE', '/api/jobs/123');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject GET /api/applications without token', () => {
      const req = createMockRequest('GET', '/api/applications');
      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(UnauthorizedException);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Token Validation', () => {
    it('should accept valid JWT token', () => {
      const payload = { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' };
      const token = sign(payload, JWT_SECRET, { expiresIn: '1h' });
      const req = createMockRequest('GET', '/api/users', `Bearer ${token}`);

      middleware.use(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.sub).toBe('user-123');
      expect(req.user?.email).toBe('test@example.com');
      expect(req.user?.role).toBe('job_seeker');
    });

    it('should reject expired JWT token', () => {
      const payload = { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' };
      const token = sign(payload, JWT_SECRET, { expiresIn: '-1h' });
      const req = createMockRequest('GET', '/api/users', `Bearer ${token}`);

      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
        new UnauthorizedException('Token has expired')
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid JWT token', () => {
      const req = createMockRequest('GET', '/api/users', 'Bearer invalid-token');

      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
        new UnauthorizedException('Invalid token')
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject JWT token with wrong secret', () => {
      const payload = { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' };
      const token = sign(payload, 'wrong-secret', { expiresIn: '1h' });
      const req = createMockRequest('GET', '/api/users', `Bearer ${token}`);

      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
        new UnauthorizedException('Invalid token')
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject malformed authorization header', () => {
      const req = createMockRequest('GET', '/api/users', 'InvalidFormat token');

      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
        new UnauthorizedException('Missing or invalid authorization header')
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject missing Bearer prefix', () => {
      const payload = { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' };
      const token = sign(payload, JWT_SECRET, { expiresIn: '1h' });
      const req = createMockRequest('GET', '/api/users', token);

      expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
        new UnauthorizedException('Missing or invalid authorization header')
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('User Data in Request', () => {
    it('should attach user data to request for protected routes', () => {
      const payload = { sub: 'user-456', email: 'employer@example.com', role: 'employer' };
      const token = sign(payload, JWT_SECRET, { expiresIn: '1h' });
      const req = createMockRequest('POST', '/api/applications', `Bearer ${token}`);

      middleware.use(req, mockResponse, mockNext);

      expect(req.user).toEqual(
        expect.objectContaining({
          sub: 'user-456',
          email: 'employer@example.com',
          role: 'employer',
        })
      );
    });

    it('should not attach user data for public routes', () => {
      const req = createMockRequest('POST', '/api/auth/login');

      middleware.use(req, mockResponse, mockNext);

      expect(req.user).toBeUndefined();
    });
  });
});
