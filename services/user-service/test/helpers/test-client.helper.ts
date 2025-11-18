import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/app';
import type { EnvConfig } from '../../src/config/env.config';
import { UserRepository } from '../../src/domain/repositories/user.repository';

export class TestClientHelper {
  constructor(
    private app: Express,
    private userRepository: UserRepository
  ) {}

  static async create(
    config: EnvConfig,
    userRepository: UserRepository
  ): Promise<TestClientHelper> {
    const app = createApp(config, userRepository);
    return new TestClientHelper(app, userRepository);
  }

  request() {
    return request(this.app);
  }

  getRepository() {
    return this.userRepository;
  }
}
