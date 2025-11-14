import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { testInfra } from '../../../test/setup/test-infrastructure';
import supertest from 'supertest';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let agent: ReturnType<typeof supertest>;

  beforeAll(async () => {
    await testInfra.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
    agent = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await testInfra.cleanup();
    await app.close();
  }, 60000);

  describe('POST /auth/login', () => {
    const loginPassword = 'TestPass123!';

    it('should reject login with non-existent email', async () => {
      const res = await agent.post('/auth/login').send({
        email: 'nonexistent@test.com',
        password: loginPassword,
      });

      expect(res.status).toBe(401);
    });

    it('should reject missing email field', async () => {
      const res = await agent.post('/auth/login').send({
        password: loginPassword,
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing password field', async () => {
      const res = await agent.post('/auth/login').send({
        email: 'test@example.com',
      });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email format', async () => {
      const res = await agent.post('/auth/login').send({
        email: 'invalid-email',
        password: loginPassword,
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /auth/me - Protected Route', () => {
    it('should reject without authorization token', async () => {
      const res = await agent.get('/auth/me');

      expect(res.status).toBe(401);
    });

    it('should reject with invalid token', async () => {
      const res = await agent.get('/auth/me').set('Authorization', 'Bearer invalid-token-xyz');

      expect(res.status).toBe(401);
    });

    it('should reject malformed Authorization header', async () => {
      const res = await agent.get('/auth/me').set('Authorization', 'InvalidFormat');

      expect(res.status).toBe(401);
    });

    it('should reject empty Bearer token', async () => {
      const res = await agent.get('/auth/me').set('Authorization', 'Bearer ');

      expect(res.status).toBe(401);
    });

    it('should reject token without Bearer prefix', async () => {
      const res = await agent.get('/auth/me').set('Authorization', 'invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/validate-token - Protected Route', () => {
    it('should reject validation without token', async () => {
      const res = await agent.post('/auth/validate-token');

      expect(res.status).toBe(401);
    });

    it('should reject validation with invalid token', async () => {
      const res = await agent.post('/auth/validate-token').set('Authorization', 'Bearer invalid');

      expect(res.status).toBe(401);
    });

    it('should reject validation without Bearer prefix', async () => {
      const res = await agent.post('/auth/validate-token').set('Authorization', 'invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
