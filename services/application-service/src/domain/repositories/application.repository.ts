import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { Application, ApplicationStatus } from '@domain/entities';

export interface ApplicationItem {
  applicationId: string;
  jobId: string;
  jobSeekerId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  cvUrl?: string;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
}

export class ApplicationRepository {
  constructor(
    private documentClient: DynamoDBDocumentClient,
    private tableName: string
  ) {}

  async create(application: Application): Promise<Application> {
    const item: Partial<ApplicationItem> = {
      applicationId: application.applicationId,
      jobId: application.jobId,
      jobSeekerId: application.jobSeekerId,
      status: application.status,
      createdAt: application.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: application.updatedAt?.toISOString() || new Date().toISOString(),
    };

    // Only add optional fields if they exist
    if (application.coverLetter) {
      item.coverLetter = application.coverLetter;
    }
    if (application.cvUrl) {
      item.cvUrl = application.cvUrl;
    }
    if (application.respondedAt) {
      item.respondedAt = application.respondedAt.toISOString();
    }

    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return application;
  }

  async getById(applicationId: string): Promise<Application | null> {
    const result = await this.documentClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { applicationId },
      })
    );

    if (!result.Item) return null;

    return this.mapToApplication(result.Item as ApplicationItem);
  }

  async getByJobSeekerId(jobSeekerId: string): Promise<Application[]> {
    const result = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'jobSeekerIdIndex',
        KeyConditionExpression: 'jobSeekerId = :jobSeekerId',
        ExpressionAttributeValues: {
          ':jobSeekerId': jobSeekerId,
        },
      })
    );

    return (result.Items || []).map((item) => this.mapToApplication(item as ApplicationItem));
  }

  async getByJobId(jobId: string): Promise<Application[]> {
    const result = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'jobIdIndex',
        KeyConditionExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobId': jobId,
        },
      })
    );

    return (result.Items || []).map((item) => this.mapToApplication(item as ApplicationItem));
  }

  async checkExisting(jobId: string, jobSeekerId: string): Promise<boolean> {
    const result = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'jobSeekerIdIndex',
        KeyConditionExpression: 'jobSeekerId = :jobSeekerId',
        FilterExpression: 'jobId = :jobId',
        ExpressionAttributeValues: {
          ':jobSeekerId': jobSeekerId,
          ':jobId': jobId,
        },
        Select: 'COUNT',
      })
    );

    return (result.Count || 0) > 0;
  }

  async update(applicationId: string, updates: Partial<Application>): Promise<Application | null> {
    const updateExpressions: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expressionAttributeValues: Record<string, any> = {};

    if (updates.status !== undefined) {
      updateExpressions.push('#status = :status');
      expressionAttributeValues[':status'] = updates.status;
    }

    if (updates.respondedAt !== undefined) {
      updateExpressions.push('respondedAt = :respondedAt');
      expressionAttributeValues[':respondedAt'] = updates.respondedAt.toISOString();
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpressions.length === 0) return this.getById(applicationId);

    const result = await this.documentClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { applicationId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!result.Attributes) return null;

    return this.mapToApplication(result.Attributes as ApplicationItem);
  }

  private mapToApplication(item: ApplicationItem): Application {
    return new Application(
      item.applicationId,
      item.jobId,
      item.jobSeekerId,
      item.status,
      item.coverLetter,
      item.cvUrl,
      new Date(item.createdAt),
      new Date(item.updatedAt),
      item.respondedAt ? new Date(item.respondedAt) : undefined
    );
  }
}
