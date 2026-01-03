import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { RequestWithUser } from '@/shared/interfaces/request-with-user.interface';

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  user?: string;
  ip: string;
}

interface ResponseLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  user?: string;
}

interface ErrorLog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  user?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    const requestLog: RequestLog = {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url,
      ip: request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown',
    };

    if (request.user) {
      requestLog.user = request.user.sub;
    }

    this.logger.log(JSON.stringify(requestLog));

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const responseLog: ResponseLog = {
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
            statusCode: response.statusCode,
            duration,
          };

          if (request.user) {
            responseLog.user = request.user.sub;
          }

          this.logger.log(JSON.stringify(responseLog));
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            method: request.method,
            path: request.url,
            statusCode: response.statusCode || 500,
            duration,
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            user: request.user?.sub,
          };

          this.logger.error(JSON.stringify(errorLog));
        },
      }),
    );
  }
}
