import { describe, it, expect, beforeEach } from 'vitest';
import { getCVAnalyses, saveCVAnalysis, mockAnalyze } from '../utils/cvAnalysis';

beforeEach(() => localStorage.clear());

describe('getCVAnalyses', () => {
  it('returns empty array when storage is empty', () => {
    expect(getCVAnalyses()).toEqual([]);
  });

  it('returns stored analyses', () => {
    const result = mockAnalyze('resume.pdf');
    saveCVAnalysis(result);
    expect(getCVAnalyses()).toHaveLength(1);
  });
});

describe('saveCVAnalysis', () => {
  it('stores analysis and prepends to list', () => {
    const first = mockAnalyze('first.pdf');
    const second = mockAnalyze('second.pdf');
    saveCVAnalysis(first);
    saveCVAnalysis(second);
    const list = getCVAnalyses();
    expect(list[0].fileName).toBe('second.pdf');
    expect(list[1].fileName).toBe('first.pdf');
  });

  it('keeps at most 10 results', () => {
    for (let i = 0; i < 12; i++) {
      saveCVAnalysis(mockAnalyze(`file${i}.pdf`));
    }
    expect(getCVAnalyses()).toHaveLength(10);
  });
});

describe('mockAnalyze', () => {
  it('returns result with correct fileName', () => {
    const result = mockAnalyze('my-cv.pdf');
    expect(result.fileName).toBe('my-cv.pdf');
  });

  it('returns score between 60 and 95', () => {
    for (let i = 0; i < 20; i++) {
      const { score } = mockAnalyze('test.pdf');
      expect(score).toBeGreaterThanOrEqual(60);
      expect(score).toBeLessThanOrEqual(95);
    }
  });

  it('returns non-empty strengths, improvements and suggestions', () => {
    const { strengths, improvements, suggestions } = mockAnalyze('cv.pdf');
    expect(strengths.length).toBeGreaterThan(0);
    expect(improvements.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('includes id and analyzedAt timestamps', () => {
    const result = mockAnalyze('cv.pdf');
    expect(result.id).toBeTruthy();
    expect(result.analyzedAt).toBeTruthy();
    expect(() => new Date(result.analyzedAt)).not.toThrow();
  });
});
