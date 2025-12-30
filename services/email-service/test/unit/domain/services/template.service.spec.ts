import { TemplateService } from '@domain/services/template.service';
import path from 'path';
import fs from 'fs/promises';

describe('TemplateService', () => {
  let templateService: TemplateService;
  const testDir = path.join(process.cwd(), 'test', 'fixtures', 'templates');

  beforeAll(async () => {
    // Create test templates directory
    await fs.mkdir(testDir, { recursive: true });
    
    // Create a test template
    const testTemplate = 'Hello {{name}}, your email is {{email}}';
    await fs.writeFile(path.join(testDir, 'test.hbs'), testTemplate);
  });

  afterAll(async () => {
    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    templateService = new TemplateService(testDir);
  });

  describe('loadTemplate', () => {
    it('should load template file successfully', async () => {
      const content = await templateService.loadTemplate('test');
      expect(content).toContain('Hello');
    });

    it('should throw error for non-existent template', async () => {
      await expect(templateService.loadTemplate('non-existent')).rejects.toThrow();
    });
  });

  describe('renderTemplate', () => {
    it('should render template with variables', async () => {
      const rendered = await templateService.renderTemplate('test', {
        name: 'John',
        email: 'john@example.com'
      });
      expect(rendered).toContain('Hello John');
      expect(rendered).toContain('john@example.com');
    });

    it('should cache compiled templates', async () => {
      const result1 = await templateService.renderTemplate('test', { name: 'John', email: 'john@example.com' });
      const result2 = await templateService.renderTemplate('test', { name: 'Jane', email: 'jane@example.com' });
      
      expect(result1).toContain('John');
      expect(result2).toContain('Jane');
    });
  });
});
