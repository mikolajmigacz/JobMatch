import { CVAnalysisRepository } from '@infrastructure/dynamodb/cv-analysis.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { testInfra } from './setup/test-infrastructure';

describe('CVAnalysisRepository Integration Tests', () => {
  let repository: CVAnalysisRepository;
  let dynamoClient: DynamoDBClient;

  beforeAll(async () => {
    await testInfra.initialize();
    const config = testInfra.getConfig();
    dynamoClient = new DynamoDBClient({
      region: config.AWS_REGION,
      endpoint: config.DYNAMODB_ENDPOINT,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });
    repository = new CVAnalysisRepository(dynamoClient);
  }, 60000);

  afterAll(async () => {
    await testInfra.cleanup();
  }, 30000);

  const testAnalysisId = `test-analysis-${Date.now()}`;
  const testUserId = 'user-123';
  const testCvS3Key = 'cvs/test-cv.pdf';

  const sampleAnalysis = {
    overallScore: 85,
    skills: [
      { name: 'JavaScript', level: 'expert', yearsOfExperience: 6 },
      { name: 'Python', level: 'advanced', yearsOfExperience: 4 },
    ],
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Engineer',
        duration: '2020-2024',
        description: 'Led development team',
      },
    ],
    education: [
      {
        institution: 'MIT',
        degree: 'Bachelor',
        field: 'Computer Science',
        year: '2018',
      },
    ],
    summary: 'Experienced software engineer',
    strengths: ['Strong technical skills', 'Leadership'],
    weaknesses: ['Limited mobile experience'],
  };

  it('should save CV analysis', async () => {
    await expect(
      repository.save(testAnalysisId, testUserId, testCvS3Key, sampleAnalysis)
    ).resolves.not.toThrow();
  });

  it('should find CV analysis by ID', async () => {
    const result = await repository.findById(testAnalysisId);

    expect(result).toBeDefined();
    expect(result?.analysisId).toBe(testAnalysisId);
    expect(result?.userId).toBe(testUserId);
    expect(result?.cvS3Key).toBe(testCvS3Key);
    expect(result?.overallScore).toBe(85);
    expect(result?.skills).toHaveLength(2);
    expect(result?.createdAt).toBeDefined();
    expect(result?.updatedAt).toBeDefined();
  });

  it('should find CV analyses by user ID', async () => {
    const results = await repository.findByUserId(testUserId);

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].userId).toBe(testUserId);
  });

  it('should update CV analysis', async () => {
    await repository.update(testAnalysisId, {
      overallScore: 90,
      summary: 'Updated summary',
    });

    const result = await repository.findById(testAnalysisId);
    expect(result?.overallScore).toBe(90);
    expect(result?.summary).toBe('Updated summary');
  });

  it('should delete CV analysis', async () => {
    await expect(repository.delete(testAnalysisId)).resolves.not.toThrow();

    const result = await repository.findById(testAnalysisId);
    expect(result).toBeNull();
  });

  it('should return null for non-existent analysis', async () => {
    const result = await repository.findById('non-existent-id');
    expect(result).toBeNull();
  });

  it('should return empty array for user with no analyses', async () => {
    const results = await repository.findByUserId('non-existent-user');
    expect(results).toEqual([]);
  });
});
