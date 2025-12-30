import { promisify } from 'util';
import * as path from 'path';
import { exec } from 'child_process';
import { TestDatabaseSetup } from './database.setup';
import type { EnvConfig } from '../../src/config/env.config';

const execAsync = promisify(exec);

const logger = { log: console.log, error: console.error, warn: console.warn };

class DockerComposeManager {
  private isRunning = false;
  private composeDir: string;
  private composeFile = 'docker-compose.dev.yml';

  constructor() {
    this.composeDir = path.resolve(__dirname, '../../../..');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.log('✓ Docker services already running');
      return;
    }

    logger.log('🚀 Starting docker compose services...');
    const composeFilePath = path.join(this.composeDir, this.composeFile);

    try {
      await execAsync(`docker compose -f "${composeFilePath}" up -d --remove-orphans`, {
        cwd: this.composeDir,
      });
      await this.waitForHealthyServices();
      await this.waitForLocalStackReady();
      this.isRunning = true;
      logger.log('✓ Docker services started and healthy');
    } catch (error) {
      logger.error('✗ Failed to start docker compose:', error);
      throw new Error(`Failed to start docker compose: ${error}`);
    }
  }

  private async waitForLocalStackReady(maxAttempts = 60, delayMs = 500): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await execAsync('curl -s http://localhost:4566/_localstack/health', {
          timeout: 3000,
        });
        if (response.stdout.includes('available') || response.stdout.includes('services')) {
          logger.log(`✓ LocalStack ready (${attempt}/${maxAttempts})`);
          return;
        }
      } catch (error) {
        // LocalStack not ready yet, will retry
      }

      if (attempt % 10 === 0) {
        logger.log(`⏳ Waiting for LocalStack (${attempt}/${maxAttempts})...`);
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(`LocalStack did not become ready after ${maxAttempts * delayMs}ms`);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.log('✓ Docker services already stopped');
      return;
    }

    logger.log('🛑 Stopping docker compose services...');
    const composeFilePath = path.join(this.composeDir, this.composeFile);

    try {
      await execAsync(`docker compose -f "${composeFilePath}" down`, {
        cwd: this.composeDir,
      });
      this.isRunning = false;
      logger.log('✓ Docker services stopped');
    } catch (error) {
      logger.error('✗ Failed to stop docker compose:', error);
      throw new Error(`Failed to stop docker compose: ${error}`);
    }
  }

  private async waitForHealthyServices(maxAttempts = 30, delayMs = 1000): Promise<void> {
    const composeFilePath = path.join(this.composeDir, this.composeFile);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { stdout } = await execAsync(
          `docker compose -f "${composeFilePath}" ps --services --filter "status=running"`,
          { cwd: this.composeDir }
        );
        const runningServices = stdout.trim().split('\n');
        if (runningServices.length > 0) {
          logger.log(`✓ Services running (${attempt}/${maxAttempts})`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return;
        }
      } catch (error) {
        // Services not ready yet, will retry
      }

      logger.log(`⏳ Waiting for services (${attempt}/${maxAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(
      `Services did not start after ${maxAttempts * delayMs}ms. Check docker-compose logs.`
    );
  }
}

export class TestInfrastructure {
  private readonly database: TestDatabaseSetup;
  private readonly docker: DockerComposeManager;

  constructor() {
    this.database = new TestDatabaseSetup();
    this.docker = new DockerComposeManager();
  }

  async initialize(): Promise<void> {
    try {
      await this.docker.start();
      await this.database.createTable();
      await this.database.createBucket();
    } catch (error) {
      throw new Error(
        `Failed to initialize test infrastructure: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.database.cleanup();
      await this.docker.stop();
    } catch (error) {
      logger.warn(`Cleanup error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getDatabase(): TestDatabaseSetup {
    return this.database;
  }

  getConfig(): EnvConfig {
    return {
      CV_ANALYSIS_SERVICE_PORT: 3006,
      CORS_ORIGIN: '*',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      AWS_REGION: 'us-east-1',
      AWS_ACCESS_KEY_ID: 'test',
      AWS_SECRET_ACCESS_KEY: 'test',
      S3_ENDPOINT: 'http://localhost:4566',
      S3_BUCKET: 'test-cv-bucket',
      DYNAMODB_ENDPOINT: 'http://localhost:4566',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
    };
  }
}

export const testInfra = new TestInfrastructure();
