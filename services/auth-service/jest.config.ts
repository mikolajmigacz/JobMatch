import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.build.json' }],
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@jobmatch/shared(.*)$': '<rootDir>/../../packages/shared$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ts'],
  testTimeout: 30000,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: false,
};

export default config;
