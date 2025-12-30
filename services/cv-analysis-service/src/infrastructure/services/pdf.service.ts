import pdf from 'pdf-parse';

export class PDFService {
  private readonly maxSizeBytes = 10 * 1024 * 1024;
  private readonly minSizeBytes = 100;

  async extractText(buffer: Buffer): Promise<string> {
    await this.validatePDF(buffer);

    try {
      const data = await pdf(buffer);
      const rawText = data.text;
      return this.cleanText(rawText);
    } catch (error) {
      throw new Error(
        `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async validatePDF(buffer: Buffer): Promise<void> {
    if (!buffer || buffer.length === 0) {
      throw new Error('PDF buffer is empty');
    }

    if (buffer.length < this.minSizeBytes) {
      throw new Error(`PDF file too small: ${buffer.length} bytes`);
    }

    if (buffer.length > this.maxSizeBytes) {
      throw new Error(`PDF file too large: ${buffer.length} bytes (max: ${this.maxSizeBytes})`);
    }

    const header = buffer.toString('utf-8', 0, 5);
    if (header !== '%PDF-') {
      throw new Error('Invalid PDF format: missing PDF header');
    }
  }

  cleanText(text: string): string {
    if (!text) {
      return '';
    }

    return (
      text
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/^ +| +$/gm, '')
        .trim()
    );
  }
}
