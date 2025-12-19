import { SQSService } from '@infrastructure/services/sqs.service';
import { ApplicationEventType } from '@domain/entities';

export interface PublishApplicationCreatedInput {
  applicationId: string;
  employerEmail: string;
  employerName: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter?: string;
}

export async function publishApplicationCreatedUseCase(
  sqsService: SQSService,
  input: PublishApplicationCreatedInput
): Promise<void> {
  await sqsService.publishEvent(ApplicationEventType.CREATED, {
    type: 'APPLICATION_CREATED' as const,
    applicationId: input.applicationId,
    employerEmail: input.employerEmail,
    employerName: input.employerName,
    jobTitle: input.jobTitle,
    applicantName: input.applicantName,
    applicantEmail: input.applicantEmail,
    coverLetter: input.coverLetter,
  });
}
