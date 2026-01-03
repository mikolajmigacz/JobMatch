import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

@Injectable()
export class ProxyErrorHandler {
  handle(error: AxiosError, serviceName: string): never {
    if (error.response) {
      throw new HttpException(
        {
          message: error.response.data || 'Service error',
          service: serviceName,
          statusCode: error.response.status,
        },
        error.response.status
      );
    }

    if (error.code === 'ECONNREFUSED') {
      throw new HttpException(
        {
          message: `${serviceName} is unavailable`,
          service: serviceName,
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
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
