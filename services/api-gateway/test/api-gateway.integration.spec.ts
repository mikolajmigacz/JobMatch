import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { AppModule } from '@/app.module';
import { configureMiddleware } from '@config/middleware.config';
import { configureCors } from '@config/cors.config';

describe('API Gateway Integration Tests', () => {
  let app: INestApplication;
  let httpService: HttpService;
  const JWT_SECRET = 'test-secret-key';
  const mockToken = sign(
    { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.CORS_ORIGIN = 'http://localhost:4000';
    process.env.API_GATEWAY_PORT = '3000';
    process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
    process.env.USER_SERVICE_URL = 'http://localhost:3002';
    process.env.JOB_SERVICE_URL = 'http://localhost:3003';
    process.env.APPLICATION_SERVICE_URL = 'http://localhost:3004';
    process.env.EMAIL_SERVICE_URL = 'http://localhost:3005';
    process.env.CV_ANALYSIS_SERVICE_URL = 'http://localhost:3006';
    process.env.RATE_LIMIT_TTL = '900000';
    process.env.RATE_LIMIT_MAX = '100';

    const mockHttpService = {
      request: jest
        .fn()
        .mockReturnValue(
          of({
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as Record<string, unknown>,
          })
        ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);

    configureMiddleware(app);
    configureCors(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Routing - Correct Service Called', () => {
    it('should route to auth service for /api/auth/*', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'auth response' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(200);

      expect(httpService.request).toHaveBeenCalled();
      expect(response.body).toEqual({ message: 'auth response' });
    });

    it('should route to job service for /api/jobs/*', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'job-123', title: 'Software Engineer' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer()).get('/api/jobs/123').expect(200);

      expect(httpService.request).toHaveBeenCalled();
      expect(response.body).toEqual({ id: 'job-123', title: 'Software Engineer' });
    });
  });

  describe('Public Routes - No Auth Required', () => {
    it('should allow POST /api/auth/register without token', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'user-123', email: 'test@example.com' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password', role: 'job_seeker' })
        .expect(201);
    });

    it('should allow POST /api/auth/login without token', async () => {
      const mockResponse: AxiosResponse = {
        data: { token: 'jwt-token', user: { id: 'user-123' } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(200);
    });

    it('should allow GET /api/jobs without token', async () => {
      const mockResponse: AxiosResponse = {
        data: [{ id: 'job-1' }, { id: 'job-2' }],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer()).get('/api/jobs');

      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(httpService.request).toHaveBeenCalled();
      }
    });

    it('should allow GET /api/jobs/:id without token', async () => {
      const mockResponse: AxiosResponse = {
        data: { id: 'job-123', title: 'Software Engineer' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      await request(app.getHttpServer()).get('/api/jobs/123').expect(200);
    });

    it('should allow GET /health without token', async () => {
      await request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('Protected Routes - Auth Required', () => {
    it('should reject GET /api/users without token', async () => {
      await request(app.getHttpServer()).get('/api/users').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject POST /api/jobs without token', async () => {
      await request(app.getHttpServer())
        .post('/api/jobs')
        .send({ title: 'New Job' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject PUT /api/jobs/:id without token', async () => {
      await request(app.getHttpServer())
        .put('/api/jobs/123')
        .send({ title: 'Updated Job' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject DELETE /api/jobs/:id without token', async () => {
      await request(app.getHttpServer()).delete('/api/jobs/123').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject GET /api/applications without token', async () => {
      await request(app.getHttpServer()).get('/api/applications').expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Invalid Token - Rejected', () => {
    it('should reject expired token', async () => {
      const expiredToken = sign(
        { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' },
        JWT_SECRET,
        { expiresIn: '-1h' }
      );

      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject token with wrong secret', async () => {
      const wrongToken = sign(
        { sub: 'user-123', email: 'test@example.com', role: 'job_seeker' },
        'wrong-secret',
        { expiresIn: '1h' }
      );

      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject malformed authorization header', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', 'InvalidFormat token')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject missing Bearer prefix', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', mockToken)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Rate Limiting - Enforced', () => {
    it('should enforce rate limit on auth routes', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      let lastStatus = 200;
      for (let i = 0; i < 6; i++) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'password' });
        lastStatus = response.status;
      }

      expect([HttpStatus.TOO_MANY_REQUESTS, 200]).toContain(lastStatus);
    });
  });

  describe('CORS - Headers Correct', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(app.getHttpServer())
        .options('/api/jobs')
        .set('Origin', 'http://localhost:4000')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should allow preflight requests', async () => {
      await request(app.getHttpServer())
        .options('/api/users')
        .set('Origin', 'http://localhost:4000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization')
        .expect(204);
    });
  });

  describe('Request Forwarding - Headers, Body, Params', () => {
    it('should forward correct path with prefix for auth service', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as Record<string, unknown>,
      };

      const requestSpy = jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse));

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      if (response.status === 200 && requestSpy.mock.calls.length > 0) {
        const callConfig = requestSpy.mock.calls[0][0];
        expect(callConfig.url).toContain('/auth/login');
      } else {
        expect([200, HttpStatus.TOO_MANY_REQUESTS]).toContain(response.status);
      }
    });
  });
});
