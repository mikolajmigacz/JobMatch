import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

export class TestDatabaseSetup {
  private dynamoClient: DynamoDBClient;
  private s3Client: S3Client;
  private bucketName = 'test-cv-bucket';

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    });

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
      forcePathStyle: true,
    });
  }

  async createTable(): Promise<void> {
    try {
      try {
        await this.dynamoClient.send(new DescribeTableCommand({ TableName: 'CVAnalysis' }));
        return;
      } catch (error) {
        // Table doesn't exist, will create it
      }

      const params: any = {
        TableName: 'CVAnalysis',
        KeySchema: [{ AttributeName: 'analysisId', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'analysisId', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
        GlobalSecondaryIndexes: [
          {
            IndexName: 'userId-index',
            KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      };

      await this.dynamoClient.send(new CreateTableCommand(params));
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw new Error(`Failed to create DynamoDB table: ${error}`);
    }
  }

  async createBucket(): Promise<void> {
    try {
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
        return;
      } catch (error) {
        // Bucket doesn't exist, will create it
      }

      await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      throw new Error(`Failed to create S3 bucket: ${error}`);
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.dynamoClient.send(new DeleteTableCommand({ TableName: 'CVAnalysis' }));
    } catch (error) {
      // Ignore cleanup errors
    }

    // Don't delete bucket in cleanup - leave it for next test
    try {
      const listResponse = await this.s3Client.send(
        new ListObjectsV2Command({ Bucket: this.bucketName })
      );

      if (listResponse.Contents && listResponse.Contents.length > 0) {
        await this.s3Client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: {
              Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key! })),
            },
          })
        );
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}
