import { TemplateService } from '@domain/services/template.service';
import path from 'path';

describe('Email Templates', () => {
  let templateService: TemplateService;
  const templatesDir = path.join(process.cwd(), 'src', 'infrastructure', 'templates');

  beforeEach(() => {
    templateService = new TemplateService(templatesDir);
  });

  describe('Application Created Template', () => {
    it('should render application-created template with valid HTML', async () => {
      const html = await templateService.renderTemplate('application-created', {
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
        coverLetter: 'I am excited about this opportunity.',
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('JobMatch');
      expect(html).toContain('Senior Developer');
      expect(html).toContain('Jane Smith');
      expect(html).toContain('jane@example.com');
      expect(html).toContain('I am excited about this opportunity.');
      expect(html).toContain('</html>');
    });

    it('should handle missing cover letter gracefully', async () => {
      const html = await templateService.renderTemplate('application-created', {
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      });

      expect(html).toContain('Jane Smith');
      expect(html).toContain('</html>');
    });

    it('should have responsive styles', async () => {
      const html = await templateService.renderTemplate('application-created', {
        employerName: 'John Doe',
        jobTitle: 'Senior Developer',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane@example.com',
      });

      expect(html).toContain('viewport');
      expect(html).toContain('max-width');
    });
  });

  describe('Application Accepted Template', () => {
    it('should render application-accepted template with valid HTML', async () => {
      const html = await templateService.renderTemplate('application-accepted', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
        companyLogoUrl: 'https://example.com/logo.png',
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('JobMatch');
      expect(html).toContain('Congratulations');
      expect(html).toContain('Jane Smith');
      expect(html).toContain('Senior Developer');
      expect(html).toContain('Tech Corp');
      expect(html).toContain('https://example.com/logo.png');
      expect(html).toContain('</html>');
    });

    it('should have success styling (green color)', async () => {
      const html = await templateService.renderTemplate('application-accepted', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(html).toContain('#28a745');
      expect(html).toContain('#d4edda');
    });

    it('should handle missing company logo', async () => {
      const html = await templateService.renderTemplate('application-accepted', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(html).toContain('Jane Smith');
      expect(html).not.toContain('<img');
      expect(html).toContain('</html>');
    });
  });

  describe('Application Rejected Template', () => {
    it('should render application-rejected template with valid HTML', async () => {
      const html = await templateService.renderTemplate('application-rejected', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('JobMatch');
      expect(html).toContain('Hi');
      expect(html).toContain('Jane Smith');
      expect(html).toContain('Senior Developer');
      expect(html).toContain('Tech Corp');
      expect(html).toContain('</html>');
    });

    it('should have rejection styling (yellow/warning color)', async () => {
      const html = await templateService.renderTemplate('application-rejected', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(html).toContain('#ffc107');
      expect(html).toContain('#fff3cd');
    });

    it('should contain encouraging message for continued job search', async () => {
      const html = await templateService.renderTemplate('application-rejected', {
        jobSeekerName: 'Jane Smith',
        jobTitle: 'Senior Developer',
        companyName: 'Tech Corp',
      });

      expect(html).toContain('continue exploring');
      expect(html).toContain('opportunities');
      expect(html).toContain('luck with your job search');
    });
  });

  describe('Template Caching', () => {
    it('should compile templates and cache them', async () => {
      const html1 = await templateService.renderTemplate('application-created', {
        employerName: 'John',
        jobTitle: 'Developer',
        applicantName: 'Jane',
        applicantEmail: 'jane@example.com',
      });

      const html2 = await templateService.renderTemplate('application-created', {
        employerName: 'Bob',
        jobTitle: 'Manager',
        applicantName: 'Alice',
        applicantEmail: 'alice@example.com',
      });

      expect(html1).toContain('Jane');
      expect(html2).toContain('Alice');
      expect(html1).not.toEqual(html2);
    });

    it('should clear template cache', async () => {
      await templateService.renderTemplate('application-created', {
        employerName: 'John',
        jobTitle: 'Developer',
        applicantName: 'Jane',
        applicantEmail: 'jane@example.com',
      });

      templateService.clearCache('application-created');

      const html = await templateService.renderTemplate('application-created', {
        employerName: 'John',
        jobTitle: 'Developer',
        applicantName: 'Jane',
        applicantEmail: 'jane@example.com',
      });

      expect(html).toContain('Jane');
    });
  });

  describe('Template HTML Validation', () => {
    it('all templates should have proper HTML structure', async () => {
      const templates = [
        {
          name: 'application-created',
          vars: {
            employerName: 'John',
            jobTitle: 'Dev',
            applicantName: 'Jane',
            applicantEmail: 'jane@example.com',
          },
        },
        {
          name: 'application-accepted',
          vars: { jobSeekerName: 'Jane', jobTitle: 'Dev', companyName: 'Corp' },
        },
        {
          name: 'application-rejected',
          vars: { jobSeekerName: 'Jane', jobTitle: 'Dev', companyName: 'Corp' },
        },
      ];

      for (const template of templates) {
        const html = await templateService.renderTemplate(template.name, template.vars);

        expect(html).toMatch(/<!DOCTYPE html>/i, `${template.name} should have DOCTYPE`);
        expect(html).toMatch(/<html/i, `${template.name} should have html tag`);
        expect(html).toContain('</html>', `${template.name} should have closing html tag`);
        expect(html).toMatch(/charset=['"]UTF-8['"]/, `${template.name} should have charset meta`);
        expect(html).toContain('viewport', `${template.name} should have viewport meta`);
        expect(html).toContain('<body>', `${template.name} should have body tag`);
        expect(html).toContain('</body>', `${template.name} should have closing body tag`);
      }
    });

    it('all templates should be responsive', async () => {
      const templates = [
        {
          name: 'application-created',
          vars: {
            employerName: 'John',
            jobTitle: 'Dev',
            applicantName: 'Jane',
            applicantEmail: 'jane@example.com',
          },
        },
        {
          name: 'application-accepted',
          vars: { jobSeekerName: 'Jane', jobTitle: 'Dev', companyName: 'Corp' },
        },
        {
          name: 'application-rejected',
          vars: { jobSeekerName: 'Jane', jobTitle: 'Dev', companyName: 'Corp' },
        },
      ];

      for (const template of templates) {
        const html = await templateService.renderTemplate(template.name, template.vars);

        expect(html).toContain('max-width: 600px', `${template.name} should have responsive width`);
        expect(html).toContain('font-family', `${template.name} should have font family`);
        expect(html).toContain('line-height', `${template.name} should have line height`);
      }
    });
  });
});
