export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@jobmatch/shared$': '<rootDir>/../../packages/shared/src',
    '^@jobmatch/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@proxy/(.*)$': '<rootDir>/src/proxy/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@guards/(.*)$': '<rootDir>/src/guards/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.test.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
