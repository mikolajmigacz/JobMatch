import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AuthServiceClient } from '@proxy/clients/auth-service.client';
import { ProxyErrorHandler } from '@proxy/interceptors/error-handler.interceptor';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthServiceClient', () => {
  let client: AuthServiceClient;
  let httpService: HttpService;
  let errorHandler: ProxyErrorHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthServiceClient, ProxyErrorHandler],
    }).compile();

    client = module.get<AuthServiceClient>(AuthServiceClient);
    httpService = module.get<HttpService>(HttpService);
    errorHandler = module.get<ProxyErrorHandler>(ProxyErrorHandler);
  });

  it('should make successful request', async () => {
    const mockResponse = { data: { message: 'success' }, status: 200 };
    jest.spyOn(httpService, 'request').mockReturnValue(of(mockResponse as any));

    const result = await client.request({ method: 'GET', url: '/test' });

    expect(result.data).toEqual({ message: 'success' });
  });

  it('should retry on failure and succeed', async () => {
    const mockResponse = { data: { message: 'success' }, status: 200 };
    jest
      .spyOn(httpService, 'request')
      .mockReturnValueOnce(throwError(() => new Error('Network error')))
      .mockReturnValueOnce(of(mockResponse as any));

    const result = await client.request({ method: 'GET', url: '/test' });

    expect(result.data).toEqual({ message: 'success' });
  });

  it('should handle errors after max retries', async () => {
    const axiosError: any = {
      code: 'ECONNREFUSED',
      response: undefined,
    };

    jest.spyOn(httpService, 'request').mockReturnValue(throwError(() => axiosError));
    jest.spyOn(errorHandler, 'handle').mockImplementation(() => {
      throw new HttpException('auth-service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    });

    await expect(client.request({ method: 'GET', url: '/test' })).rejects.toThrow(HttpException);
  }, 10000);
});
