module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/../test/setup/jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          paths: {
            '@domain/*': ['domain/*'],
            '@application/*': ['application/*'],
            '@infrastructure/*': ['infrastructure/*'],
            '@ui/*': ['ui/*'],
            '@shared/*': ['shared/*'],
            '@config/*': ['config/*'],
            '@jobmatch/shared': ['../../packages/shared/src'],
            '@jobmatch/shared/*': ['../../packages/shared/src/*'],
          },
        },
      },
    ],
  },

  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/domain/$1',
    '^@application/(.*)$': '<rootDir>/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^@ui/(.*)$': '<rootDir>/ui/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@jobmatch/shared$': '<rootDir>/../../../packages/shared/src/index.ts',
    '^@jobmatch/shared/(.*)$': '<rootDir>/../../../packages/shared/src/$1',
  },

  collectCoverageFrom: ['**/*.(t|j)s'],
};
