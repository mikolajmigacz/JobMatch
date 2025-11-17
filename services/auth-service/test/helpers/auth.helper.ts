import type supertest from 'supertest';

export interface EmployerRegisterPayload {
  email: string;
  password: string;
  role: 'employer';
  name: string;
  companyName: string;
}

export interface JobSeekerRegisterPayload {
  email: string;
  password: string;
  role: 'job_seeker';
  name: string;
}

export type RegisterPayload = EmployerRegisterPayload | JobSeekerRegisterPayload;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  body: {
    token: string;
    user: {
      userId: string;
      email: string;
      role: string;
      name: string;
      companyName?: string;
      companyLogoUrl?: string;
    };
  };
}

/**
 * Test data factories for auth tests
 */
export const authTestData = {
  /**
   * Create valid employer registration payload
   */
  createEmployerRegisterPayload: (
    overrides?: Partial<EmployerRegisterPayload>
  ): EmployerRegisterPayload => ({
    email: `employer-${Date.now()}@test.com`,
    password: 'SecurePass123!@',
    role: 'employer',
    name: 'Test Employer',
    companyName: 'Test Company Inc',
    ...overrides,
  }),

  /**
   * Create valid job seeker registration payload
   */
  createJobSeekerRegisterPayload: (
    overrides?: Partial<JobSeekerRegisterPayload>
  ): JobSeekerRegisterPayload => ({
    email: `seeker-${Date.now()}@test.com`,
    password: 'SecurePass123!@',
    role: 'job_seeker',
    name: 'Test Job Seeker',
    ...overrides,
  }),

  /**
   * Create valid login payload
   */
  createLoginPayload: (email: string, password?: string): LoginPayload => ({
    email,
    password: password ?? 'SecurePass123!@',
  }),

  /**
   * Create minimal valid register payload (missing required fields for validation tests)
   */
  createInvalidRegisterPayload: (overrides?: Partial<RegisterPayload>): RegisterPayload => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      email: 'invalid-email',
      password: 'weak',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      role: 'invalid_role' as any,
      name: 'Test',
      ...overrides,
    } as RegisterPayload;
  },
};

/**
 * Auth API request helpers
 */
export class AuthApiHelper {
  constructor(private agent: ReturnType<typeof supertest>) {}

  async registerEmployer(overrides?: Partial<RegisterPayload>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = authTestData.createEmployerRegisterPayload(overrides as any);
    const logoPath = '../../test-logo.png';

    let request = this.agent.post('/auth/register');

    if (payload.email !== undefined) {
      request = request.field('email', payload.email);
    }
    if (payload.password !== undefined) {
      request = request.field('password', payload.password);
    }
    if (payload.role !== undefined) {
      request = request.field('role', payload.role);
    }
    if (payload.name !== undefined) {
      request = request.field('name', payload.name);
    }
    if (payload.companyName !== undefined) {
      request = request.field('companyName', payload.companyName);
    }

    return request.attach('companyLogo', logoPath);
  }

  async registerJobSeeker(overrides?: Partial<RegisterPayload>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = authTestData.createJobSeekerRegisterPayload(overrides as any);

    return this.agent
      .post('/auth/register')
      .field('email', payload.email)
      .field('password', payload.password)
      .field('role', payload.role)
      .field('name', payload.name);
  }

  /**
   * Register with file upload (logo for employer)
   */
  async registerWithLogo(logoPath: string, overrides?: Partial<RegisterPayload>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = authTestData.createEmployerRegisterPayload(overrides as any);
    const request = this.agent.post('/auth/register');
    if (payload.companyName) {
      request.field('companyName', payload.companyName);
    }
    return request
      .field('email', payload.email)
      .field('password', payload.password)
      .field('role', payload.role)
      .field('name', payload.name)
      .attach('companyLogo', logoPath);
  }

  /**
   * Login with email and password
   */
  async login(email: string, password?: string) {
    const payload = authTestData.createLoginPayload(email, password);
    return this.agent.post('/auth/login').set('Content-Type', 'application/json').send(payload);
  }

  /**
   * Get current user (requires JWT token)
   */
  async getCurrentUser(token: string) {
    return this.agent.get('/auth/me').set('Authorization', `Bearer ${token}`);
  }

  /**
   * Validate token
   */
  async validateToken(token: string) {
    return this.agent.post('/auth/validate-token').set('Authorization', `Bearer ${token}`);
  }

  /**
   * Register and return token + user (helper for other tests)
   */
  async registerAndGetToken(
    role: 'job_seeker' | 'employer' = 'job_seeker',
    overrides?: Partial<RegisterPayload>
  ) {
    const registerRes =
      role === 'employer'
        ? await this.registerEmployer(overrides)
        : await this.registerJobSeeker(overrides);

    if (registerRes.status !== 201) {
      throw new Error(
        `Registration failed: ${registerRes.status} - ${JSON.stringify(registerRes.body)}`
      );
    }

    const { token, user } = registerRes.body;
    return { token, user, email: user.email };
  }
}

/**
 * Test assertions helper
 */
export class AuthAssertions {
  /**
   * Assert successful registration response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertSuccessfulRegistration(response: any) {
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('role');
    expect(response.body.user).toHaveProperty('name');
  }

  /**
   * Assert successful login response
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertSuccessfulLogin(response: any) {
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body.user).toHaveProperty('email');
  }

  /**
   * Assert employer has logo
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertEmployerHasLogo(user: any) {
    expect(user).toHaveProperty('companyLogoUrl');
    expect(user.companyLogoUrl).toBeTruthy();
    expect(user.companyLogoUrl).toMatch(/^s3:\/\//);
  }

  /**
   * Assert job seeker has no logo
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertJobSeekerNoLogo(user: any) {
    expect(user).not.toHaveProperty('companyLogoUrl');
  }

  /**
   * Assert validation error for missing field
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertValidationError(response: any, fieldName?: string) {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(String(response.body.message)).toContain('Validation failed');
    if (fieldName) {
      expect(JSON.stringify(response.body)).toContain(fieldName);
    }
  }

  /**
   * Assert bad request error
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertBadRequest(response: any, messageContains?: string) {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    if (messageContains) {
      expect(String(response.body.message)).toContain(messageContains);
    }
  }

  /**
   * Assert unauthorized error
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertUnauthorized(response: any) {
    expect(response.status).toBe(401);
  }

  /**
   * Assert conflict error (user already exists)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static assertConflict(response: any, messageContains?: string) {
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    if (messageContains) {
      expect(String(response.body.message)).toContain(messageContains);
    }
  }
}
