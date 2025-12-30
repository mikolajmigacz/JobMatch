import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { CVAnalysis } from '@shared/schemas';
import { ICVAnalysisRepository } from '@domain/repositories/cv-analysis.repository';
import { CV_ANALYSIS_TABLE, CV_ANALYSIS_USER_ID_INDEX } from './tables';
import { CVAnalysisEntityItem, toCVAnalysis } from './cv-analysis.entity';

export class CVAnalysisRepository implements ICVAnalysisRepository {
  private docClient: DynamoDBDocumentClient;

  constructor(dynamoClient: DynamoDBClient) {
    this.docClient = DynamoDBDocumentClient.from(dynamoClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  async save(
    analysisId: string,
    userId: string,
    cvS3Key: string,
    analysis: CVAnalysis
  ): Promise<void> {
    try {
      const now = new Date().toISOString();
      const item: CVAnalysisEntityItem = {
        analysisId,
        userId,
        cvS3Key,
        overallScore: analysis.overallScore,
        skills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        createdAt: now,
        updatedAt: now,
      };

      await this.docClient.send(
        new PutCommand({
          TableName: CV_ANALYSIS_TABLE,
          Item: item,
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to save CV analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(analysisId: string): Promise<
    | (CVAnalysis & {
        analysisId: string;
        userId: string;
        cvS3Key: string;
        createdAt: string;
        updatedAt: string;
      })
    | null
  > {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: CV_ANALYSIS_TABLE,
          Key: { analysisId },
        })
      );

      if (!result.Item) {
        return null;
      }

      return toCVAnalysis(result.Item as CVAnalysisEntityItem);
    } catch (error) {
      throw new Error(
        `Failed to find CV analysis by ID: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByUserId(
    userId: string,
    limit = 50
  ): Promise<
    Array<
      CVAnalysis & {
        analysisId: string;
        userId: string;
        cvS3Key: string;
        createdAt: string;
        updatedAt: string;
      }
    >
  > {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: CV_ANALYSIS_TABLE,
          IndexName: CV_ANALYSIS_USER_ID_INDEX,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
          Limit: limit,
          ScanIndexForward: false,
        })
      );

      return (result.Items || []).map((item) => toCVAnalysis(item as CVAnalysisEntityItem));
    } catch (error) {
      throw new Error(
        `Failed to find CV analyses by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async update(analysisId: string, analysis: Partial<CVAnalysis>): Promise<void> {
    try {
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      if (analysis.overallScore !== undefined) {
        updateExpressions.push('#overallScore = :overallScore');
        expressionAttributeNames['#overallScore'] = 'overallScore';
        expressionAttributeValues[':overallScore'] = analysis.overallScore;
      }

      if (analysis.skills !== undefined) {
        updateExpressions.push('#skills = :skills');
        expressionAttributeNames['#skills'] = 'skills';
        expressionAttributeValues[':skills'] = analysis.skills;
      }

      if (analysis.experience !== undefined) {
        updateExpressions.push('#experience = :experience');
        expressionAttributeNames['#experience'] = 'experience';
        expressionAttributeValues[':experience'] = analysis.experience;
      }

      if (analysis.education !== undefined) {
        updateExpressions.push('#education = :education');
        expressionAttributeNames['#education'] = 'education';
        expressionAttributeValues[':education'] = analysis.education;
      }

      if (analysis.summary !== undefined) {
        updateExpressions.push('#summary = :summary');
        expressionAttributeNames['#summary'] = 'summary';
        expressionAttributeValues[':summary'] = analysis.summary;
      }

      if (analysis.strengths !== undefined) {
        updateExpressions.push('#strengths = :strengths');
        expressionAttributeNames['#strengths'] = 'strengths';
        expressionAttributeValues[':strengths'] = analysis.strengths;
      }

      if (analysis.weaknesses !== undefined) {
        updateExpressions.push('#weaknesses = :weaknesses');
        expressionAttributeNames['#weaknesses'] = 'weaknesses';
        expressionAttributeValues[':weaknesses'] = analysis.weaknesses;
      }

      updateExpressions.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      if (updateExpressions.length === 1) {
        return;
      }

      await this.docClient.send(
        new UpdateCommand({
          TableName: CV_ANALYSIS_TABLE,
          Key: { analysisId },
          UpdateExpression: `SET ${updateExpressions.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to update CV analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async delete(analysisId: string): Promise<void> {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: CV_ANALYSIS_TABLE,
          Key: { analysisId },
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to delete CV analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
