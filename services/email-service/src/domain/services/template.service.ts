import path from 'path';
import fs from 'fs/promises';
import Handlebars from 'handlebars';
import logger from '@jobmatch/shared/logger';
import { HandlebarsHelper } from '@infrastructure/clients/handlebars.helper';

export interface TemplateServiceInterface {
  loadTemplate(templateName: string): Promise<string>;
  renderTemplate(templateName: string, variables: Record<string, any>): Promise<string>;
}

export class TemplateService implements TemplateServiceInterface {
  private templatesDir: string;
  private compiledTemplates: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor(templatesDir: string = path.join(process.cwd(), 'src', 'infrastructure', 'templates')) {
    this.templatesDir = templatesDir;
    HandlebarsHelper.register();
  }

  async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      logger.error(`Failed to load template ${templateName}: ${error}`);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  async renderTemplate(templateName: string, variables: Record<string, any>): Promise<string> {
    try {
      if (!this.compiledTemplates.has(templateName)) {
        const templateContent = await this.loadTemplate(templateName);
        const compiled = Handlebars.compile(templateContent);
        this.compiledTemplates.set(templateName, compiled);
      }

      const compiled = this.compiledTemplates.get(templateName)!;
      return compiled(variables);
    } catch (error) {
      logger.error(`Failed to render template ${templateName}: ${error}`);
      throw error;
    }
  }

  clearCache(templateName?: string): void {
    if (templateName) {
      this.compiledTemplates.delete(templateName);
    } else {
      this.compiledTemplates.clear();
    }
  }
}

export default TemplateService;
