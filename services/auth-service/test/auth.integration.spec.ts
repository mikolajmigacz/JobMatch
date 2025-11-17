import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthApiHelper, AuthAssertions, authTestData } from './helpers/auth.helper';
import { testInfra } from './setup/test-infrastructure';
import { getDatabaseHelper } from './helpers/database.helper';
import { IFileStorageService } from '../src/domain/services/file-storage.service';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let agent: ReturnType<typeof supertest>;
  let authHelper: AuthApiHelper;
  const databaseHelper = getDatabaseHelper();

  // Mock FileStorageService for tests
  class MockFileStorageService implements IFileStorageService {
    async uploadFile(
      bucket: string,
      key: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      body: Buffer,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      contentType: string
    ): Promise<string> {
      // Return a mock URL instead of uploading to S3
      return `s3://${bucket}/${key}`;
    }
  }

  beforeAll(async () => {
    // Initialize test infrastructure (docker-compose, database)
    await testInfra.initialize();

    // Create NestJS testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IFileStorageService)
      .useClass(MockFileStorageService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    agent = supertest(app.getHttpServer());
    authHelper = new AuthApiHelper(agent);
  }, 60000);

  afterAll(async () => {
    // Cleanup test infrastructure
    if (app) {
      await app.close();
    }
    await testInfra.cleanup();
  }, 30000);

  beforeEach(async () => {
    // Clean up database before each test
    await databaseHelper.cleanupUsersTable();
  });

  afterEach(async () => {
    // Clean up database after each test
    await databaseHelper.cleanupUsersTable();
  });

  describe('Registration - Success Cases', () => {
    describe('Employer Registration', () => {
      it('should successfully register employer with all required fields', async () => {
        const payload = authTestData.createEmployerRegisterPayload();

        const response = await authHelper.registerEmployer({
          email: payload.email,
          password: payload.password,
          role: payload.role,
          name: payload.name,
          companyName: payload.companyName,
        });

        AuthAssertions.assertSuccessfulRegistration(response);
        expect(response.body.user).toMatchObject({
          email: payload.email,
          role: 'employer',
          name: payload.name,
          companyName: payload.companyName,
        });

        const userCount = await databaseHelper.getUserCount();
        expect(userCount).toBe(1);
      });

      it('should return token that can be used for authenticated requests', async () => {
        const response = await authHelper.registerEmployer();
        AuthAssertions.assertSuccessfulRegistration(response);

        const { token } = response.body;
        expect(token).toBeTruthy();

        const meResponse = await authHelper.getCurrentUser(token);
        expect(meResponse.status).toBe(200);
        expect(meResponse.body.email).toBe(response.body.user.email);
      });
    });

    describe('Job Seeker Registration', () => {
      it('should not have companyName or companyLogoUrl fields', async () => {
        const response = await authHelper.registerJobSeeker();

        AuthAssertions.assertSuccessfulRegistration(response);

        const user = response.body.user;
        expect(user).not.toHaveProperty('companyName');
        AuthAssertions.assertJobSeekerNoLogo(user);
      });

      it('should generate unique token for each registration', async () => {
        const response1 = await authHelper.registerJobSeeker();
        const response2 = await authHelper.registerJobSeeker();

        expect(response1.body.token).not.toBe(response2.body.token);
      });
    });
  });

  describe('Registration - Edge Cases & Validation', () => {
    describe('Invalid Email', () => {
      it('should reject invalid email format', async () => {
        const response = await authHelper.registerEmployer({
          email: 'not-an-email',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
      });

      it('should reject empty email', async () => {
        const response = await authHelper.registerEmployer({
          email: '',
        });

        expect(response.status).toBe(400);
      });

      it('should reject undefined email', async () => {
        const response = await authHelper.registerEmployer({
          email: undefined as unknown as string,
        });

        expect(response.status).toBe(400);
      });
    });

    describe('Invalid Password', () => {
      it('should reject weak password', async () => {
        const response = await authHelper.registerEmployer({
          password: 'weak',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
      });

      it('should reject empty password', async () => {
        const response = await authHelper.registerEmployer({
          password: '',
        });

        expect(response.status).toBe(400);
      });
    });

    describe('Invalid Role', () => {
      it('should reject invalid role', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await authHelper.registerEmployer({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role: 'invalid_role' as any,
        });

        expect(response.status).toBe(400);
      });
    });

    describe('Missing Required Fields', () => {
      it('should reject missing email', async () => {
        const response = await agent
          .post('/auth/register')
          .set('Content-Type', 'application/json')
          .send({
            password: 'SecurePass123!@',
            role: 'employer',
            name: 'Test',
          });

        expect(response.status).toBe(400);
      });

      it('should reject missing password', async () => {
        const response = await agent
          .post('/auth/register')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@example.com',
            role: 'employer',
            name: 'Test',
          });

        expect(response.status).toBe(400);
      });

      it('should reject missing name', async () => {
        const response = await agent
          .post('/auth/register')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@example.com',
            password: 'SecurePass123!@',
            role: 'employer',
          });

        expect(response.status).toBe(400);
      });
    });

    describe('Duplicate Registration', () => {
      it('should reject duplicate email for same role', async () => {
        const email = `duplicate-${Date.now()}@test.com`;

        const firstResponse = await authHelper.registerEmployer({ email });
        expect(firstResponse.status).toBe(201);

        const secondResponse = await authHelper.registerEmployer({ email });
        expect(secondResponse.status).toBe(400);
        AuthAssertions.assertConflict(secondResponse, 'already');
      });

      it('should not allow same email for different roles', async () => {
        const email = `same-email-${Date.now()}@test.com`;

        const employerResponse = await authHelper.registerEmployer({ email });
        expect(employerResponse.status).toBe(201);

        const jobSeekerResponse = await authHelper.registerJobSeeker({ email });
        expect(jobSeekerResponse.status).toBe(400);
        AuthAssertions.assertConflict(jobSeekerResponse, 'already');

        const count = await databaseHelper.getUserCount();
        expect(count).toBe(1);
      });
    });
  });

  describe('Login - Success Cases', () => {
    it('should successfully login with valid credentials', async () => {
      const email = `login-test-${Date.now()}@test.com`;
      const password = 'SecurePass123!@';

      const registerResponse = await authHelper.registerEmployer({
        email,
        password,
      });
      expect(registerResponse.status).toBe(201);

      const loginResponse = await authHelper.login(email, password);
      AuthAssertions.assertSuccessfulLogin(loginResponse);
      expect(loginResponse.body.user.email).toBe(email);
    });

    it('should return valid JWT token on successful login', async () => {
      const { email } = await authHelper.registerAndGetToken('job_seeker');

      const loginResponse = await authHelper.login(email);
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeTruthy();

      const meResponse = await authHelper.getCurrentUser(loginResponse.body.token);
      expect(meResponse.status).toBe(200);
    });
  });

  describe('Login - Edge Cases & Validation', () => {
    describe('Non-existent User', () => {
      it('should reject login for non-existent email', async () => {
        const response = await authHelper.login('nonexistent@test.com');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('Invalid Password', () => {
      it('should reject login with wrong password', async () => {
        const email = `wrong-pass-${Date.now()}@test.com`;
        await authHelper.registerEmployer({ email, password: 'CorrectPass123!@' });

        const response = await authHelper.login(email, 'WrongPass123!@');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
      });

      it('should reject empty password', async () => {
        const response = await authHelper.login('test@example.com', '');

        expect(response.status).toBe(400);
      });
    });

    describe('Missing Credentials', () => {
      it('should reject missing email', async () => {
        const response = await agent
          .post('/auth/login')
          .set('Content-Type', 'application/json')
          .send({
            password: 'SecurePass123!@',
          });

        expect(response.status).toBe(400);
      });

      it('should reject missing password', async () => {
        const response = await agent
          .post('/auth/login')
          .set('Content-Type', 'application/json')
          .send({
            email: 'test@example.com',
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('Protected Routes', () => {
    describe('GET /auth/me', () => {
      it('should return current user with valid token', async () => {
        const { token, email } = await authHelper.registerAndGetToken('employer');

        const response = await authHelper.getCurrentUser(token);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(email);
        expect(response.body.role).toBe('employer');
      });

      it('should reject request without token', async () => {
        const response = await agent.get('/auth/me');

        expect(response.status).toBe(401);
        AuthAssertions.assertUnauthorized(response);
      });

      it('should reject request with invalid token', async () => {
        const response = await authHelper.getCurrentUser('invalid.token.here');

        expect(response.status).toBe(401);
        AuthAssertions.assertUnauthorized(response);
      });

      it('should reject request with malformed Authorization header', async () => {
        const response = await agent.get('/auth/me').set('Authorization', 'InvalidFormat token');

        expect(response.status).toBe(401);
      });
    });

    describe('POST /auth/validate-token', () => {
      it('should validate correct token', async () => {
        const { token } = await authHelper.registerAndGetToken('job_seeker');

        const response = await authHelper.validateToken(token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('valid');
        expect(response.body.valid).toBe(true);
      });

      it('should reject invalid token', async () => {
        const response = await authHelper.validateToken('invalid.token');

        expect(response.status).toBeGreaterThanOrEqual(400);
      });

      it('should require token in Authorization header', async () => {
        const response = await agent.post('/auth/validate-token');

        expect(response.status).toBe(401);
        AuthAssertions.assertUnauthorized(response);
      });
    });
  });

  describe('Data Persistence', () => {
    it('should persist user data across multiple requests', async () => {
      const email = `persist-${Date.now()}@test.com`;

      const registerResponse = await authHelper.registerEmployer({
        email,
        name: 'Persistent User',
      });
      expect(registerResponse.status).toBe(201);

      const user = await databaseHelper.findUserByEmail(email);
      expect(user).toBeTruthy();
      expect(user?.email).toBe(email);

      const loginResponse = await authHelper.login(email);
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.user.name).toBe('Persistent User');
    });

    it('should maintain separate user profiles for different roles', async () => {
      const baseEmail = `separate-${Date.now()}`;

      const employerResponse = await authHelper.registerEmployer({
        email: `employer-${baseEmail}@test.com`,
      });
      const jobSeekerResponse = await authHelper.registerJobSeeker({
        email: `seeker-${baseEmail}@test.com`,
      });

      expect(employerResponse.status).toBe(201);
      expect(jobSeekerResponse.status).toBe(201);

      const count = await databaseHelper.getUserCount();
      expect(count).toBe(2);
    });
  });

  describe('Concurrency', () => {
    it('should handle concurrent registrations', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        authHelper.registerJobSeeker({
          email: `concurrent-${i}-${Date.now()}@test.com`,
        })
      );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      const count = await databaseHelper.getUserCount();
      expect(count).toBe(5);
    });
  });
});
