import 'tsconfig-paths/register';
import { SQSClient } from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import app from './app';
import logger from '@jobmatch/shared/logger';
import { config } from '@config/bootstrap';
import { SQSConsumer } from '@infrastructure/sqs';
import { EmailRepository, EmailLogRepository } from '@infrastructure/dynamodb';
import { TemplateService } from '@domain/services/template.service';
import { NodemailerClient } from '@infrastructure/clients/nodemailer.client';
import { EmailService } from '@application/services/email.service';
import { EmailMessageHandler } from '@application/handlers/email-message.handler';

const PORT = config.EMAIL_SERVICE_PORT;

const server = app.listen(PORT, async () => {
  logger.info(`Email Service running on port ${PORT}`);

  try {
    const sqsClient = new SQSClient({
      endpoint: config.SQS_ENDPOINT,
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });

    const dynamoClient = new DynamoDBClient({
      endpoint: config.DYNAMODB_ENDPOINT,
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });

    const templateService = new TemplateService();
    const nodemailerClient = new NodemailerClient();
    const emailRepository = new EmailRepository(dynamoClient, config.DYNAMODB_TABLE_EMAILS);
    const emailLogRepository = new EmailLogRepository(dynamoClient);

    await nodemailerClient.verify();

    const emailService = new EmailService(
      nodemailerClient,
      templateService,
      emailRepository,
      emailLogRepository
    );

    const messageHandler = new EmailMessageHandler(emailService);

    const consumer = new SQSConsumer(sqsClient, {
      queueUrl: config.SQS_QUEUE_URL,
      maxMessages: 10,
      waitTimeSeconds: 5,
    });

    await consumer.start((message) => messageHandler.handle(message), 5000);

    logger.info('SQS consumer started successfully');
  } catch (error) {
    logger.error(`Failed to initialize SQS consumer: ${error}`);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  logger.info('Gracefully shutting down...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
