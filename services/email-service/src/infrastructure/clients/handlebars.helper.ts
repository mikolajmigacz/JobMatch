import Handlebars from 'handlebars';

export class HandlebarsHelper {
  static register(): void {
    // Date formatting helper
    Handlebars.registerHelper('formatDate', function (date: Date | string): string {
      if (!date) return '';
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    // Currency formatting helper
    Handlebars.registerHelper('formatCurrency', function (amount: number, options?: any): string {
      if (!amount) return '';
      const currency = (options && options.hash && options.hash.currency) || 'USD';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    });

    // Lowercase helper
    Handlebars.registerHelper('lowercase', function (str: string): string {
      return str ? str.toLowerCase() : '';
    });

    // Uppercase helper
    Handlebars.registerHelper('uppercase', function (str: string): string {
      return str ? str.toUpperCase() : '';
    });

    // String truncate helper
    Handlebars.registerHelper('truncate', function (str: string, length: number): string {
      if (!str) return '';
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    });

    // Equals helper for conditionals
    Handlebars.registerHelper('eq', function (a: any, b: any): boolean {
      return a === b;
    });

    // Default value helper
    Handlebars.registerHelper('default', function (value: any, defaultValue: any): any {
      return value !== undefined && value !== null ? value : defaultValue;
    });
  }
}

export default HandlebarsHelper;
