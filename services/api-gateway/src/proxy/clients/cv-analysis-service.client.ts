import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ProxyErrorHandler } from '@proxy/interceptors/error-handler.interceptor';
import { httpClientConfig } from '@proxy/config/http-client.config';
import { HttpClientError } from '@proxy/types/http-client.types';

@Injectable()
export class CvAnalysisServiceClient {
  private readonly serviceName = 'cv-analysis-service';
  private readonly config = httpClientConfig.cvAnalysis;

  constructor(
    private readonly httpService: HttpService,
    private readonly errorHandler: ProxyErrorHandler
  ) {}

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    };

    let lastError: HttpClientError | undefined;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await firstValueFrom(this.httpService.request<T>(requestConfig));
      } catch (error: HttpClientError) {
        lastError = error;
        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * (attempt + 1));
        }
      }
    }

    this.errorHandler.handle(lastError, this.serviceName);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
