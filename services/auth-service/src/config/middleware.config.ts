import express from 'express';
import type { INestApplication } from '@nestjs/common';

export function configureMiddleware(app: INestApplication): void {
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(express.json({ limit: '10mb' }));
}
