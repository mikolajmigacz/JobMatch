export const JOB_TABLE_NAME = 'Jobs';
export const JOB_PARTITION_KEY = 'jobId';

export const jobTableConfig = {
  name: JOB_TABLE_NAME,
  partitionKey: JOB_PARTITION_KEY,
  indexes: {
    'employerId-index': {
      partitionKey: 'employerId',
      type: 'GSI' as const,
    },
    'status-index': {
      partitionKey: 'status',
      type: 'GSI' as const,
    },
  },
};
