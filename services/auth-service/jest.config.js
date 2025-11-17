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
          baseUrl: '.',
          rootDir: 'src',
          paths: {
            '@domain/*': ['src/domain/*'],
            '@application/*': ['src/application/*'],
            '@infrastructure/*': ['src/infrastructure/*'],
            '@ui/*': ['src/ui/*'],
            '@shared/*': ['src/shared/*'],
            '@config/*': ['src/config/*'],
            '@jobmatch/shared': ['../../packages/shared/dist'],
            '@jobmatch/shared/*': ['../../packages/shared/dist/*'],
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
    '^@jobmatch/shared$': '<rootDir>/../../../packages/shared/dist',
    '^@jobmatch/shared/(.*)$': '<rootDir>/../../../packages/shared/dist/$1',
  },

  collectCoverageFrom: ['**/*.(t|j)s'],
};
