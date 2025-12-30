import request from 'supertest';
import app from '@/app';

describe('Health Route', () => {
  describe('GET /health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('service', 'email-service');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /health/ready', () => {
    it('should return 200 with ready status', async () => {
      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('service', 'email-service');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown route', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Route not found');
    });
  });
});
