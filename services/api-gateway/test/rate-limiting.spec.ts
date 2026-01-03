import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@/guards/throttler.guard';
import { RATE_LIMIT_CONFIG } from '@config/rate-limit.config';

describe('Rate Limiting', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Configuration', () => {
    it('should have global rate limit configured', () => {
      expect(RATE_LIMIT_CONFIG.global.ttl).toBe(15 * 60 * 1000);
      expect(RATE_LIMIT_CONFIG.global.limit).toBe(100);
    });

    it('should have auth rate limit configured', () => {
      expect(RATE_LIMIT_CONFIG.auth.ttl).toBe(15 * 60 * 1000);
      expect(RATE_LIMIT_CONFIG.auth.limit).toBe(5);
    });

    it('should have cv-analysis rate limit configured', () => {
      expect(RATE_LIMIT_CONFIG.cvAnalysis.ttl).toBe(60 * 60 * 1000);
      expect(RATE_LIMIT_CONFIG.cvAnalysis.limit).toBe(3);
    });
  });

  describe('ThrottlerGuard', () => {
    it('should be defined', () => {
      const guard = new ThrottlerGuard({} as any, {} as any, {} as any);
      expect(guard).toBeDefined();
    });
  });
});
