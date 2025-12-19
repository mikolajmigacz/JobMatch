import { SQSService } from '@infrastructure/services/sqs.service';
import { ApplicationEventType } from '@domain/entities';

export interface PublishApplicationRejectedInput {
  applicationId: string;
  jobSeekerEmail: string;
  jobSeekerName: string;
  jobTitle: string;
  companyName: string;
}

export async function publishApplicationRejectedUseCase(
  sqsService: SQSService,
  input: PublishApplicationRejectedInput
): Promise<void> {
  await sqsService.publishEvent(ApplicationEventType.REJECTED, {
    type: 'APPLICATION_REJECTED' as const,
    applicationId: input.applicationId,
    jobSeekerEmail: input.jobSeekerEmail,
    jobSeekerName: input.jobSeekerName,
    jobTitle: input.jobTitle,
    companyName: input.companyName,
  });
}
