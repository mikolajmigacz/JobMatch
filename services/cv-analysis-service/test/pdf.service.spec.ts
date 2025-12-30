import { PDFService } from '@infrastructure/services/pdf.service';

describe('PDFService', () => {
  let pdfService: PDFService;

  beforeEach(() => {
    pdfService = new PDFService();
  });

  describe('validatePDF', () => {
    it('should throw error for empty buffer', async () => {
      const emptyBuffer = Buffer.from('');
      await expect(pdfService.validatePDF(emptyBuffer)).rejects.toThrow('PDF buffer is empty');
    });

    it('should throw error for too small file', async () => {
      const smallBuffer = Buffer.from('test');
      await expect(pdfService.validatePDF(smallBuffer)).rejects.toThrow('PDF file too small');
    });

    it('should throw error for invalid PDF format', async () => {
      const invalidBuffer = Buffer.alloc(200, 'a');
      await expect(pdfService.validatePDF(invalidBuffer)).rejects.toThrow('Invalid PDF format');
    });

    it('should pass validation for valid PDF header', async () => {
      const validBuffer = Buffer.concat([Buffer.from('%PDF-1.4'), Buffer.alloc(200, 'a')]);
      await expect(pdfService.validatePDF(validBuffer)).resolves.not.toThrow();
    });
  });

  describe('cleanText', () => {
    it('should remove control characters', () => {
      const dirtyText = 'Hello\x00World\x08Test';
      const cleaned = pdfService.cleanText(dirtyText);
      expect(cleaned).toBe('HelloWorldTest');
    });

    it('should normalize line breaks', () => {
      const text = 'Line1\r\nLine2\rLine3\nLine4';
      const cleaned = pdfService.cleanText(text);
      expect(cleaned).toBe('Line1\nLine2\nLine3\nLine4');
    });

    it('should collapse multiple newlines', () => {
      const text = 'Para1\n\n\n\nPara2';
      const cleaned = pdfService.cleanText(text);
      expect(cleaned).toBe('Para1\n\nPara2');
    });

    it('should normalize whitespace', () => {
      const text = 'Text   with    multiple     spaces';
      const cleaned = pdfService.cleanText(text);
      expect(cleaned).toBe('Text with multiple spaces');
    });

    it('should trim leading and trailing whitespace per line', () => {
      const text = '  Line1  \n  Line2  ';
      const cleaned = pdfService.cleanText(text);
      expect(cleaned).toBe('Line1\nLine2');
    });

    it('should handle empty text', () => {
      expect(pdfService.cleanText('')).toBe('');
      expect(pdfService.cleanText(null as any)).toBe('');
    });
  });

  describe('extractText', () => {
    it('should throw error for corrupted PDF', async () => {
      const corruptedBuffer = Buffer.concat([
        Buffer.from('%PDF-1.4'),
        Buffer.alloc(200, 'corrupted'),
      ]);
      await expect(pdfService.extractText(corruptedBuffer)).rejects.toThrow(
        'Failed to extract text from PDF'
      );
    });

    it('should validate before extracting', async () => {
      const invalidBuffer = Buffer.from('not a pdf');
      await expect(pdfService.extractText(invalidBuffer)).rejects.toThrow();
    });
  });
});
