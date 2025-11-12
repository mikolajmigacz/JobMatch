import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@ui/auth/auth.module';
import { HealthController } from '@ui/health/health.controller';
import { envValidationSchema } from '@config/env.validation';
import { InfrastructureHealthCheck } from '@infrastructure/health/infrastructure.health';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [InfrastructureHealthCheck],
})
export class AppModule {}
