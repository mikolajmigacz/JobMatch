import '../../../src/shared/types/express.d';
import { createJwtMiddleware } from '../../../src/infrastructure/middleware/jwt.middleware';
import { TokenPayload } from '../../../src/shared/types';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Middleware', () => {
  let middleware: (req: Request, res: Response, next: NextFunction) => void;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  const secret = 'test-secret';

  beforeEach(() => {
    middleware = createJwtMiddleware(secret);
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Token validation', () => {
    it('should decode valid token and attach user to request', () => {
      const payload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'job_seeker',
      };
      const token = 'valid.jwt.token';

      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
      expect(mockReq.user).toEqual(payload);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing Authorization header', () => {
      mockReq.headers = {};

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle invalid Bearer format', () => {
      mockReq.headers = { authorization: 'InvalidFormat token' };

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle invalid token gracefully', () => {
      const token = 'invalid.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle expired token gracefully', () => {
      const token = 'expired.jwt.token';
      mockReq.headers = { authorization: `Bearer ${token}` };
      const error = new Error('Token expired');
      Object.defineProperty(error, 'name', { value: 'TokenExpiredError' });
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('User data extraction', () => {
    it('should extract userId from token payload', () => {
      const payload: TokenPayload = {
        userId: 'employer-456',
        email: 'employer@example.com',
        role: 'employer',
      };
      const token = 'valid.jwt.token';

      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user?.userId).toBe('employer-456');
    });

    it('should extract role from token payload', () => {
      const payload: TokenPayload = {
        userId: 'user-789',
        email: 'user@example.com',
        role: 'employer',
      };
      const token = 'valid.jwt.token';

      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user?.role).toBe('employer');
    });

    it('should extract email from token payload', () => {
      const payload: TokenPayload = {
        userId: 'user-abc',
        email: 'test.email@domain.com',
        role: 'job_seeker',
      };
      const token = 'valid.jwt.token';

      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockReturnValue(payload);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user?.email).toBe('test.email@domain.com');
    });
  });

  describe('Middleware behavior', () => {
    it('should always call next() function', () => {
      mockReq.headers = {};

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not throw error on invalid token', () => {
      const token = 'invalid.token';
      mockReq.headers = { authorization: `Bearer ${token}` };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => {
        middleware(mockReq as Request, mockRes as Response, mockNext);
      }).not.toThrow();
    });
  });
});
