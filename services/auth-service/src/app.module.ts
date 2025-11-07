import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@ui/auth/auth.module';
import { HealthController } from '@ui/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
