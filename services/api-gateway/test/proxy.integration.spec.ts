import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { UserServiceClient } from '@proxy/clients/user-service.client';
import { ProxyErrorHandler } from '@proxy/interceptors/error-handler.interceptor';

describe('Proxy Integration Tests', () => {
  let userClient: UserServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UserServiceClient, ProxyErrorHandler],
    }).compile();

    userClient = module.get<UserServiceClient>(UserServiceClient);
  });

  it('should connect to user-service health endpoint', async () => {
    try {
      const response = await userClient.request({
        method: 'GET',
        url: '/health',
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'ok');
      expect(response.data).toHaveProperty('service', 'user-service');
    } catch (error: any) {
      if (error.response?.status === 503) {
        console.log('User service not running - skipping integration test');
      } else {
        throw error;
      }
    }
  }, 10000);
});
