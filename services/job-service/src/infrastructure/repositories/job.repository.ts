import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Job } from '@domain/entities/job';
import { JobId } from '@domain/value-objects/job-id';
import { IJobRepository } from '@domain/repositories/job.repository';
import { JOB_TABLE_NAME } from '../dynamodb/tables/job.table';

export class DynamoDbJobRepository implements IJobRepository {
  constructor(private dynamoDb: DynamoDBDocumentClient) {}

  async save(job: Job): Promise<void> {
    const primitive = job.toPrimitive();
    await this.dynamoDb.send(
      new PutCommand({
        TableName: JOB_TABLE_NAME,
        Item: primitive,
      })
    );
  }

  async findById(jobId: JobId): Promise<Job | null> {
    try {
      const response = await this.dynamoDb.send(
        new GetCommand({
          TableName: JOB_TABLE_NAME,
          Key: { jobId: jobId.value },
        })
      );

      if (!response.Item) return null;

      const item = response.Item as Record<string, unknown>;
      return Job.restore(
        JobId.from(item.jobId as string),
        item.employerId as string,
        item.title as string,
        item.description as string,
        item.location as string,
        (item.salaryMin as number) || undefined,
        (item.salaryMax as number) || undefined,
        item.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
        (item.skills as string[]) || [],
        item.requirements as string,
        item.companyName as string,
        item.status as 'active' | 'closed',
        new Date(item.createdAt as string),
        new Date(item.updatedAt as string)
      );
    } catch (error: unknown) {
      if (error instanceof Error && 'name' in error && error.name === 'ResourceNotFoundException') {
        return null;
      }
      throw error;
    }
  }

  async findByEmployerId(employerId: string): Promise<Job[]> {
    try {
      const response = await this.dynamoDb.send(
        new QueryCommand({
          TableName: JOB_TABLE_NAME,
          IndexName: 'employerId-index',
          KeyConditionExpression: 'employerId = :employerId',
          ExpressionAttributeValues: {
            ':employerId': employerId,
          },
        })
      );

      return ((response.Items || []) as Record<string, unknown>[]).map((item) =>
        Job.restore(
          JobId.from(item.jobId as string),
          item.employerId as string,
          item.title as string,
          item.description as string,
          item.location as string,
          (item.salaryMin as number) || undefined,
          (item.salaryMax as number) || undefined,
          item.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
          (item.skills as string[]) || [],
          item.requirements as string,
          item.companyName as string,
          item.status as 'active' | 'closed',
          new Date(item.createdAt as string),
          new Date(item.updatedAt as string)
        )
      );
    } catch (error) {
      console.error('Error querying jobs by employerId:', error);
      return [];
    }
  }

  async findByStatus(status: 'active' | 'closed'): Promise<Job[]> {
    try {
      const response = await this.dynamoDb.send(
        new QueryCommand({
          TableName: JOB_TABLE_NAME,
          IndexName: 'status-index',
          KeyConditionExpression: '#status = :status',
          ExpressionAttributeNames: {
            '#status': 'status',
          },
          ExpressionAttributeValues: {
            ':status': status,
          },
        })
      );

      return ((response.Items || []) as Record<string, unknown>[]).map((item) =>
        Job.restore(
          JobId.from(item.jobId as string),
          item.employerId as string,
          item.title as string,
          item.description as string,
          item.location as string,
          (item.salaryMin as number) || undefined,
          (item.salaryMax as number) || undefined,
          item.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
          (item.skills as string[]) || [],
          item.requirements as string,
          item.companyName as string,
          item.status as 'active' | 'closed',
          new Date(item.createdAt as string),
          new Date(item.updatedAt as string)
        )
      );
    } catch (error) {
      console.error('Error querying jobs by status:', error);
      return [];
    }
  }

  async findAll(): Promise<Job[]> {
    try {
      const response = await this.dynamoDb.send(
        new ScanCommand({
          TableName: JOB_TABLE_NAME,
        })
      );

      return ((response.Items || []) as Record<string, unknown>[]).map((item) =>
        Job.restore(
          JobId.from(item.jobId as string),
          item.employerId as string,
          item.title as string,
          item.description as string,
          item.location as string,
          (item.salaryMin as number) || undefined,
          (item.salaryMax as number) || undefined,
          item.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
          (item.skills as string[]) || [],
          item.requirements as string,
          item.companyName as string,
          item.status as 'active' | 'closed',
          new Date(item.createdAt as string),
          new Date(item.updatedAt as string)
        )
      );
    } catch (error) {
      console.error('Error scanning jobs:', error);
      return [];
    }
  }

  async delete(jobId: JobId): Promise<void> {
    await this.dynamoDb.send(
      new DeleteCommand({
        TableName: JOB_TABLE_NAME,
        Key: { jobId: jobId.value },
      })
    );
  }

  async update(job: Job): Promise<void> {
    const primitive = job.toPrimitive();
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    const keysToSkip = ['jobId', 'createdAt'];
    let index = 0;

    for (const [key, value] of Object.entries(primitive)) {
      if (!keysToSkip.includes(key) && value !== undefined) {
        const placeholder = `:val${index}`;
        updateExpressions.push(`#${key} = ${placeholder}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[placeholder] = value;
        index++;
      }
    }

    if (updateExpressions.length === 0) {
      return;
    }

    await this.dynamoDb.send(
      new UpdateCommand({
        TableName: JOB_TABLE_NAME,
        Key: { jobId: primitive.jobId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  }
}
