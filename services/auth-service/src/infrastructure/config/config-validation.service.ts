import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigValidationService {
  constructor(private configService: ConfigService) {
    this.validateRequiredEnvVars();
  }

  private validateRequiredEnvVars(): void {
    const requiredVars = [
      'AUTH_SERVICE_PORT',
      'CORS_ORIGIN',
      'DYNAMODB_ENDPOINT',
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'JWT_SECRET',
      'JWT_EXPIRES_IN',
    ];

    for (const varName of requiredVars) {
      const value = this.configService.get(varName);
      if (!value) {
        throw new Error(`Environment variable ${varName} is not defined`);
      }
    }
  }
}
