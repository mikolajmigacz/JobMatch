import Handlebars from 'handlebars';
import { HandlebarsHelper } from '@infrastructure/clients/handlebars.helper';

describe('HandlebarsHelper', () => {
  beforeAll(() => {
    HandlebarsHelper.register();
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const template = Handlebars.compile('{{formatDate date}}');
      const result = template({ date: new Date('2025-12-29') });
      expect(result).toContain('December');
      expect(result).toContain('29');
    });

    it('should handle missing date', () => {
      const template = Handlebars.compile('{{formatDate date}}');
      const result = template({ date: null });
      expect(result).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      const template = Handlebars.compile('{{formatCurrency amount}}');
      const result = template({ amount: 1000 });
      expect(result).toContain('1,000');
    });

    it('should handle missing amount', () => {
      const template = Handlebars.compile('{{formatCurrency amount}}');
      const result = template({ amount: null });
      expect(result).toBe('');
    });
  });

  describe('lowercase', () => {
    it('should convert to lowercase', () => {
      const template = Handlebars.compile('{{lowercase text}}');
      const result = template({ text: 'HELLO WORLD' });
      expect(result).toBe('hello world');
    });
  });

  describe('uppercase', () => {
    it('should convert to uppercase', () => {
      const template = Handlebars.compile('{{uppercase text}}');
      const result = template({ text: 'hello world' });
      expect(result).toBe('HELLO WORLD');
    });
  });

  describe('truncate', () => {
    it('should truncate string', () => {
      const template = Handlebars.compile('{{truncate text 10}}');
      const result = template({ text: 'This is a long text' });
      expect(result).toBe('This is a ...');
    });

    it('should not truncate short string', () => {
      const template = Handlebars.compile('{{truncate text 20}}');
      const result = template({ text: 'Short' });
      expect(result).toBe('Short');
    });
  });

  describe('eq', () => {
    it('should compare values correctly', () => {
      const template = Handlebars.compile('{{#if (eq status "accepted")}}Accepted{{/if}}');
      const result = template({ status: 'accepted' });
      expect(result).toBe('Accepted');
    });

    it('should handle non-equal values', () => {
      const template = Handlebars.compile('{{#if (eq status "accepted")}}Accepted{{else}}Not Accepted{{/if}}');
      const result = template({ status: 'rejected' });
      expect(result).toBe('Not Accepted');
    });
  });

  describe('default', () => {
    it('should return default value if empty', () => {
      const template = Handlebars.compile('{{default value "Default"}}');
      const result = template({ value: null });
      expect(result).toBe('Default');
    });

    it('should return actual value if present', () => {
      const template = Handlebars.compile('{{default value "Default"}}');
      const result = template({ value: 'Actual' });
      expect(result).toBe('Actual');
    });
  });
});
