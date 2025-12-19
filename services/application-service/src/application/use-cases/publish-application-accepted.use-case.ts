import { SQSService } from '@infrastructure/services/sqs.service';
import { ApplicationEventType } from '@domain/entities';

export interface PublishApplicationAcceptedInput {
  applicationId: string;
  jobSeekerEmail: string;
  jobSeekerName: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  employerEmail?: string;
}

export async function publishApplicationAcceptedUseCase(
  sqsService: SQSService,
  input: PublishApplicationAcceptedInput
): Promise<void> {
  await sqsService.publishEvent(ApplicationEventType.ACCEPTED, {
    type: 'APPLICATION_ACCEPTED' as const,
    applicationId: input.applicationId,
    jobSeekerEmail: input.jobSeekerEmail,
    jobSeekerName: input.jobSeekerName,
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    companyLogoUrl: input.companyLogoUrl,
    employerEmail: input.employerEmail,
  });
}
