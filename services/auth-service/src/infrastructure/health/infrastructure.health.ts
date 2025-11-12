import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class InfrastructureHealthCheck implements OnModuleInit {
  private readonly logger = new Logger(InfrastructureHealthCheck.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.checkS3Connection();
    await this.checkDynamoDbConnection();
  }

  private async checkS3Connection(): Promise<void> {
    try {
      const s3Client = new S3Client({
        endpoint: this.configService.getOrThrow('S3_ENDPOINT'),
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        },
        forcePathStyle: true,
      });

      await s3Client.send(new ListBucketsCommand({}));
      this.logger.log('S3 connection successful');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`S3 connection failed: ${errorMsg}`);
      throw new Error(
        `Failed to connect to S3 at ${this.configService.get('S3_ENDPOINT')}. ` +
          'Make sure LocalStack is running with S3 service enabled. ' +
          `Error: ${errorMsg}`
      );
    }
  }

  private async checkDynamoDbConnection(): Promise<void> {
    try {
      const dynamoDbClient = new DynamoDBClient({
        endpoint: this.configService.getOrThrow('DYNAMODB_ENDPOINT'),
        region: this.configService.getOrThrow('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
        },
      });

      await dynamoDbClient.send(new ListTablesCommand({}));
      this.logger.log('DynamoDB connection successful');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`DynamoDB connection failed: ${errorMsg}`);
      throw new Error(
        `Failed to connect to DynamoDB at ${this.configService.get('DYNAMODB_ENDPOINT')}. ` +
          'Make sure LocalStack is running with DynamoDB service enabled. ' +
          `Error: ${errorMsg}`
      );
    }
  }
}
