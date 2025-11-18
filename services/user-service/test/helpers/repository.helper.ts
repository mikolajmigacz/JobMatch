import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { UserRepository } from '../../src/domain/repositories/user.repository';

export const createMockDynamoDBClient = (responses: Record<string, unknown> = {}) => {
  return {
    send: jest.fn((command) => {
      const commandName = command.constructor.name;

      if (responses[commandName]) {
        return Promise.resolve(responses[commandName]);
      }

      return Promise.resolve({});
    }),
  } as unknown as DynamoDBDocumentClient;
};

export const createUserRepositoryWithMocks = (mockClient: DynamoDBDocumentClient) => {
  return new UserRepository(mockClient);
};
