export enum ApplicationEventType {
  CREATED = 'APPLICATION_CREATED',
  ACCEPTED = 'APPLICATION_ACCEPTED',
  REJECTED = 'APPLICATION_REJECTED',
}

export interface ApplicationEvent {
  type: ApplicationEventType;
  applicationId: string;
  timestamp: Date;
}
