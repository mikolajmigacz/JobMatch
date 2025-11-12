import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDbClientProvider {
  private readonly client: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {
    const dynamoDbClient = new DynamoDBClient({
      endpoint: this.configService.getOrThrow('DYNAMODB_ENDPOINT'),
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoDbClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  get dynamoDb(): DynamoDBDocumentClient {
    return this.client;
  }
}
