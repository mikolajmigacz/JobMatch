import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { AuthServiceClient } from '@proxy/clients/auth-service.client';

describe('Proxy Routing (Integration)', () => {
  let app: INestApplication;
  let authClient: AuthServiceClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authClient = moduleFixture.get<AuthServiceClient>(AuthServiceClient);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should forward GET request to auth service', async () => {
    const mockResponse = { data: { status: 'ok' }, status: 200 };
    jest.spyOn(authClient, 'request').mockResolvedValue(mockResponse as any);

    const response = await fetch('http://localhost:3000/api/auth/health');
    expect(response.status).toBe(200);
  });

  it('should forward headers', async () => {
    let capturedConfig: any;
    jest.spyOn(authClient, 'request').mockImplementation((config) => {
      capturedConfig = config;
      return Promise.resolve({ data: {}, status: 200 } as any);
    });

    await fetch('http://localhost:3000/api/auth/test', {
      headers: { Authorization: 'Bearer token123' },
    });

    expect(capturedConfig?.headers?.authorization).toBe('Bearer token123');
  });
});
