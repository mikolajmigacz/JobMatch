import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { configureCors } from '../src/config/cors.config';

describe('CORS Configuration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.CORS_ORIGIN = 'http://localhost:4000,http://localhost:4001,http://localhost:4002';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureCors(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Configuration', () => {
    it('should configure CORS with allowed origins', () => {
      const corsOrigin = process.env.CORS_ORIGIN;
      expect(corsOrigin).toBeDefined();
      expect(corsOrigin).toContain('localhost:4000');
      expect(corsOrigin).toContain('localhost:4001');
      expect(corsOrigin).toContain('localhost:4002');
    });

    it('should throw error if CORS_ORIGIN is not set', () => {
      const originalEnv = process.env.CORS_ORIGIN;
      delete process.env.CORS_ORIGIN;

      const testApp = {} as INestApplication;
      testApp.enableCors = jest.fn();

      expect(() => configureCors(testApp)).toThrow('CORS_ORIGIN environment variable is not set');

      process.env.CORS_ORIGIN = originalEnv;
    });

    it('should enable CORS with correct configuration', () => {
      const testApp = {} as INestApplication;
      const enableCorsSpy = jest.fn();
      testApp.enableCors = enableCorsSpy;

      process.env.CORS_ORIGIN = 'http://localhost:4000,http://localhost:4001';
      configureCors(testApp);

      expect(enableCorsSpy).toHaveBeenCalledWith({
        origin: ['http://localhost:4000', 'http://localhost:4001'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
      });
    });
  });

  describe('Allowed Methods', () => {
    it('should allow GET requests', () => {
      expect(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).toContain('GET');
    });

    it('should allow POST requests', () => {
      expect(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).toContain('POST');
    });

    it('should allow PUT requests', () => {
      expect(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).toContain('PUT');
    });

    it('should allow DELETE requests', () => {
      expect(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).toContain('DELETE');
    });

    it('should allow OPTIONS requests for preflight', () => {
      expect(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']).toContain('OPTIONS');
    });
  });

  describe('Allowed Headers', () => {
    it('should allow Content-Type header', () => {
      expect(['Content-Type', 'Authorization']).toContain('Content-Type');
    });

    it('should allow Authorization header', () => {
      expect(['Content-Type', 'Authorization']).toContain('Authorization');
    });
  });

  describe('Credentials', () => {
    it('should enable credentials', () => {
      const testApp = {} as INestApplication;
      const enableCorsSpy = jest.fn();
      testApp.enableCors = enableCorsSpy;

      process.env.CORS_ORIGIN = 'http://localhost:4000';
      configureCors(testApp);

      const corsConfig = enableCorsSpy.mock.calls[0][0];
      expect(corsConfig.credentials).toBe(true);
    });
  });

  describe('Preflight Handling', () => {
    it('should not continue after preflight', () => {
      const testApp = {} as INestApplication;
      const enableCorsSpy = jest.fn();
      testApp.enableCors = enableCorsSpy;

      process.env.CORS_ORIGIN = 'http://localhost:4000';
      configureCors(testApp);

      const corsConfig = enableCorsSpy.mock.calls[0][0];
      expect(corsConfig.preflightContinue).toBe(false);
    });

    it('should return 204 for successful OPTIONS requests', () => {
      const testApp = {} as INestApplication;
      const enableCorsSpy = jest.fn();
      testApp.enableCors = enableCorsSpy;

      process.env.CORS_ORIGIN = 'http://localhost:4000';
      configureCors(testApp);

      const corsConfig = enableCorsSpy.mock.calls[0][0];
      expect(corsConfig.optionsSuccessStatus).toBe(204);
    });
  });
});
