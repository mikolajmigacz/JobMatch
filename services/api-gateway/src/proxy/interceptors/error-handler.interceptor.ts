import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpClientError } from '@proxy/types/http-client.types';

@Injectable()
export class ProxyErrorHandler {
  handle(error: HttpClientError, serviceName: string): never {
    const axiosError = error as AxiosError;

    if (axiosError?.response) {
      throw new HttpException(
        {
          message: axiosError.response.data || 'Service error',
          service: serviceName,
          statusCode: axiosError.response.status,
        },
        axiosError.response.status
      );
    }

    if (axiosError?.code === 'ECONNREFUSED') {
      throw new HttpException(
        {
          message: `${serviceName} is unavailable`,
          service: serviceName,
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    if (axiosError?.code === 'ETIMEDOUT' || axiosError?.code === 'ECONNABORTED') {
      throw new HttpException(
        {
          message: `${serviceName} request timeout`,
          service: serviceName,
        },
        HttpStatus.GATEWAY_TIMEOUT
      );
    }

    throw new HttpException(
      {
        message: 'Internal server error',
        service: serviceName,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
