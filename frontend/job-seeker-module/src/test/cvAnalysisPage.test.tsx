import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CVAnalysisPage from '../app/cv-analysis/page';
import { saveCVAnalysis, mockAnalyze } from '../utils/cvAnalysis';

beforeEach(() => localStorage.clear());

describe('CVAnalysisPage', () => {
  it('renders the page title', async () => {
    render(<CVAnalysisPage />);
    await waitFor(() => expect(screen.getByText('CV Analysis')).toBeInTheDocument());
  });

  it('renders the drop zone instruction text', async () => {
    render(<CVAnalysisPage />);
    await waitFor(() => expect(screen.getByText(/Drag & drop your CV here/i)).toBeInTheDocument());
  });

  it('renders the "Choose File" button', async () => {
    render(<CVAnalysisPage />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Choose File/i })).toBeInTheDocument()
    );
  });

  it('shows PDF only hint', async () => {
    render(<CVAnalysisPage />);
    await waitFor(() => expect(screen.getByText(/PDF only/i)).toBeInTheDocument());
  });

  it('shows error when non-PDF file is selected', async () => {
    render(<CVAnalysisPage />);
    await waitFor(() => screen.getByText(/Drag & drop/i));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const textFile = new File(['content'], 'document.txt', {
      type: 'text/plain',
    });
    fireEvent.change(fileInput, { target: { files: [textFile] } });

    await waitFor(() =>
      expect(screen.getByText(/Only PDF files are allowed/i)).toBeInTheDocument()
    );
  });

  it('renders analysis history section when history exists', async () => {
    saveCVAnalysis(mockAnalyze('old-resume.pdf'));
    render(<CVAnalysisPage />);
    await waitFor(() => expect(screen.getByText('Analysis History')).toBeInTheDocument());
  });

  it('shows previous file name in history', async () => {
    saveCVAnalysis(mockAnalyze('my-resume.pdf'));
    render(<CVAnalysisPage />);
    await waitFor(() => expect(screen.getByText('my-resume.pdf')).toBeInTheDocument());
  });
});
