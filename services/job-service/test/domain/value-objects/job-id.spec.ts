import { JobId } from '../../../src/domain';

describe('JobId Value Object', () => {
  it('should generate a valid UUID', () => {
    const jobId = JobId.generate();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(jobId.value).toMatch(uuidRegex);
  });

  it('should wrap an existing UUID', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const jobId = JobId.from(uuid);

    expect(jobId.value).toBe(uuid);
  });

  it('should be equal when values are the same', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const jobId1 = JobId.from(uuid);
    const jobId2 = JobId.from(uuid);

    expect(jobId1.equals(jobId2)).toBe(true);
  });
});
