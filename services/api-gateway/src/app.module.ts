import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from '@/shared/health/health.controller';
import { envValidationSchema } from '@config/env.validation';
import { ProxyModule } from '@proxy/proxy.module';
import { JwtValidationMiddleware } from '@/middleware/jwt-validation.middleware';
import { ThrottlerGuard } from '@/guards/throttler.guard';
import { RATE_LIMIT_CONFIG } from '@config/rate-limit.config';
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor';
import { JwtValidator } from '@/shared/domain/jwt';
import { PublicRouteDetector } from '@/proxy/infrastructure/route-detection';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: RATE_LIMIT_CONFIG.global.ttl,
        limit: RATE_LIMIT_CONFIG.global.limit,
      },
      {
        name: 'auth',
        ttl: RATE_LIMIT_CONFIG.auth.ttl,
        limit: RATE_LIMIT_CONFIG.auth.limit,
      },
      {
        name: 'cv-analysis',
        ttl: RATE_LIMIT_CONFIG.cvAnalysis.ttl,
        limit: RATE_LIMIT_CONFIG.cvAnalysis.limit,
      },
    ]),
    ProxyModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    JwtValidator,
    PublicRouteDetector,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtValidationMiddleware).forRoutes('*');
  }
}
