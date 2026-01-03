import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockResponse: AxiosResponse = {
      data: { status: 'ok' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any,
    };
    jest.spyOn(authClient, 'request').mockResolvedValue(mockResponse);

    const response = await fetch('http://localhost:3000/api/auth/health');
    expect(response.status).toBe(200);
  });

  it('should forward headers', async () => {
    let capturedConfig: AxiosRequestConfig | undefined;
    jest.spyOn(authClient, 'request').mockImplementation((config) => {
      capturedConfig = config;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      } as AxiosResponse);
    });

    await fetch('http://localhost:3000/api/auth/test', {
      headers: { Authorization: 'Bearer token123' },
    });

    expect((capturedConfig?.headers as Record<string, string>)?.authorization).toBe(
      'Bearer token123'
    );
  });
});
