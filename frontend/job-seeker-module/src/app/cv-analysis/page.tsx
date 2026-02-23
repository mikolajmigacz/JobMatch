'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { CVAnalysisResult } from '../../types/cv';
import { getCVAnalyses, saveCVAnalysis, mockAnalyze } from '../../utils/cvAnalysis';

// ─── Animations ─────────────────────────────────────────────────────────────
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const fillBar = keyframes`from { width: 0; } to { width: var(--target); }`;
const fadeUp = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;

// ─── Shared ──────────────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const BackLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 24px;
`;

// ─── Upload Area ─────────────────────────────────────────────────────────────
const DropZone = styled.div<{ dragging: boolean }>`
  border: 2px dashed ${(p) => (p.dragging ? '#007bff' : '#ccc')};
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  background: ${(p) => (p.dragging ? '#f0f7ff' : '#fafafa')};
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #007bff;
    background: #f0f7ff;
  }
`;

const DropIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const DropText = styled.p`
  color: #555;
  font-size: 16px;
  margin: 0 0 6px;
`;

const DropHint = styled.p`
  color: #aaa;
  font-size: 13px;
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  margin-top: 16px;
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 28px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const ErrorText = styled.p`
  color: #c62828;
  font-size: 13px;
  margin: 10px 0 0;
`;

// ─── Progress ────────────────────────────────────────────────────────────────
const ProgressWrap = styled.div`
  margin-top: 24px;
  animation: ${fadeUp} 0.3s ease;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
`;

const ProgressTrack = styled.div`
  background: #e0e0e0;
  border-radius: 8px;
  height: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ pct: number }>`
  --target: ${(p) => p.pct}%;
  height: 100%;
  background: #007bff;
  border-radius: 8px;
  animation: ${fillBar} 0.4s ease forwards;
  width: ${(p) => p.pct}%;
  transition: width 0.3s;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid #e0e0e0;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
`;

// ─── Score ────────────────────────────────────────────────────────────────────
const ResultCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px;
  margin-top: 28px;
  animation: ${fadeUp} 0.4s ease;
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  color: #333;
  margin: 0 0 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ScoreCircle = styled.div<{ score: number }>`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 6px solid ${(p) => (p.score >= 80 ? '#43a047' : p.score >= 60 ? '#fb8c00' : '#e53935')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ScoreNumber = styled.span<{ score: number }>`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(p) => (p.score >= 80 ? '#43a047' : p.score >= 60 ? '#fb8c00' : '#e53935')};
`;

const ScoreMeta = styled.div``;

const ScoreTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ScoreSub = styled.div`
  font-size: 13px;
  color: #888;
`;

const ScoreBar = styled.div`
  flex: 1;
  min-width: 160px;
  background: #e0e0e0;
  border-radius: 8px;
  height: 12px;
  overflow: hidden;
`;

const ScoreBarFill = styled.div<{ score: number }>`
  --target: ${(p) => p.score}%;
  height: 100%;
  background: ${(p) => (p.score >= 80 ? '#43a047' : p.score >= 60 ? '#fb8c00' : '#e53935')};
  border-radius: 8px;
  animation: ${fillBar} 0.8s 0.2s ease forwards;
  width: 0;
`;

const ListSection = styled.div`
  margin-bottom: 20px;
`;

const ListTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px;
`;

const ItemRow = styled.li<{ type: 'strength' | 'improvement' | 'suggestion' }>`
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
  padding-left: 6px;
  border-left: 3px solid
    ${(p) => (p.type === 'strength' ? '#43a047' : p.type === 'improvement' ? '#e53935' : '#1976d2')};
  line-height: 1.5;
  list-style: none;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const Btn = styled.button<{ variant?: 'outline' }>`
  padding: 9px 22px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: ${(p) => (p.variant === 'outline' ? '1px solid #007bff' : 'none')};
  background: ${(p) => (p.variant === 'outline' ? 'white' : '#007bff')};
  color: ${(p) => (p.variant === 'outline' ? '#007bff' : 'white')};
  &:hover {
    opacity: 0.85;
  }
`;

// ─── History ──────────────────────────────────────────────────────────────────
const HistorySection = styled.div`
  margin-top: 36px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  cursor: pointer;
  &:hover {
    background: #f8f9fa;
  }
`;

const HistoryLeft = styled.div``;
const HistoryFileName = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;
const HistoryDate = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
`;

const HistoryScore = styled.div<{ score: number }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${(p) => (p.score >= 80 ? '#43a047' : p.score >= 60 ? '#fb8c00' : '#e53935')};
`;

const scoreLabel = (s: number) => (s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : 'Needs work');

// ─── Component ───────────────────────────────────────────────────────────────
export default function CVAnalysisPage() {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [history, setHistory] = useState<CVAnalysisResult[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getCVAnalyses());
  }, []);

  const validate = (file: File): string => {
    if (file.type !== 'application/pdf') return 'Only PDF files are allowed.';
    if (file.size > 5 * 1024 * 1024) return 'File size cannot exceed 5 MB.';
    return '';
  };

  const runAnalysis = async (file: File) => {
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setAnalyzing(true);
    setResult(null);

    // Simulate progress
    for (let p = 0; p <= 90; p += 10) {
      await new Promise((r) => setTimeout(r, 120));
      setProgress(p);
    }
    await new Promise((r) => setTimeout(r, 400));
    setProgress(100);

    const analysis = mockAnalyze(file.name);
    saveCVAnalysis(analysis);
    setHistory(getCVAnalyses());
    setResult(analysis);
    setAnalyzing(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) runAnalysis(f);
    e.target.value = '';
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) runAnalysis(f);
  }, []);

  const downloadResult = (r: CVAnalysisResult) => {
    const text = [
      `CV Analysis Report — ${r.fileName}`,
      `Date: ${new Date(r.analyzedAt).toLocaleString()}`,
      `Score: ${r.score}/100 (${scoreLabel(r.score)})`,
      '',
      'STRENGTHS',
      ...r.strengths.map((s) => `• ${s}`),
      '',
      'IMPROVEMENTS',
      ...r.improvements.map((s) => `• ${s}`),
      '',
      'SUGGESTIONS',
      ...r.suggestions.map((s) => `• ${s}`),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-analysis-${r.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderResult = (r: CVAnalysisResult) => (
    <ResultCard key={r.id}>
      <SectionTitle>Analysis: {r.fileName}</SectionTitle>

      <ScoreRow>
        <ScoreCircle score={r.score}>
          <ScoreNumber score={r.score}>{r.score}</ScoreNumber>
        </ScoreCircle>
        <ScoreMeta>
          <ScoreTitle>{scoreLabel(r.score)}</ScoreTitle>
          <ScoreSub>{new Date(r.analyzedAt).toLocaleString()}</ScoreSub>
        </ScoreMeta>
        <ScoreBar>
          <ScoreBarFill score={r.score} />
        </ScoreBar>
      </ScoreRow>

      <ListSection>
        <ListTitle>✅ Strengths</ListTitle>
        <ul style={{ margin: 0, padding: 0 }}>
          {r.strengths.map((s, i) => (
            <ItemRow key={i} type="strength">
              {s}
            </ItemRow>
          ))}
        </ul>
      </ListSection>

      <ListSection>
        <ListTitle>⚠️ Areas to Improve</ListTitle>
        <ul style={{ margin: 0, padding: 0 }}>
          {r.improvements.map((s, i) => (
            <ItemRow key={i} type="improvement">
              {s}
            </ItemRow>
          ))}
        </ul>
      </ListSection>

      <ListSection>
        <ListTitle>💡 Suggestions</ListTitle>
        <ul style={{ margin: 0, padding: 0 }}>
          {r.suggestions.map((s, i) => (
            <ItemRow key={i} type="suggestion">
              {s}
            </ItemRow>
          ))}
        </ul>
      </ListSection>

      <ActionRow>
        <Btn onClick={() => downloadResult(r)}>⬇ Download Report</Btn>
        <Btn variant="outline" onClick={() => fileRef.current?.click()}>
          Analyze Another CV
        </Btn>
      </ActionRow>
    </ResultCard>
  );

  return (
    <Container>
      <BackLink href="/">← Home</BackLink>
      <Title>CV Analysis</Title>

      <DropZone
        dragging={dragging}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <DropIcon>📄</DropIcon>
        <DropText>Drag & drop your CV here, or click to browse</DropText>
        <DropHint>PDF only · Max 5 MB</DropHint>
        <UploadButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          Choose File
        </UploadButton>
        {error && <ErrorText onClick={(e) => e.stopPropagation()}>{error}</ErrorText>}
      </DropZone>

      <HiddenInput ref={fileRef} type="file" accept="application/pdf" onChange={onFileChange} />

      {analyzing && (
        <ProgressWrap>
          <ProgressLabel>
            <span>
              <Spinner />
              Analyzing CV…
            </span>
            <span>{progress}%</span>
          </ProgressLabel>
          <ProgressTrack>
            <ProgressFill pct={progress} />
          </ProgressTrack>
        </ProgressWrap>
      )}

      {result && renderResult(result)}

      {history.length > 0 && (
        <HistorySection>
          <SectionTitle style={{ border: 'none', paddingBottom: 0 }}>Analysis History</SectionTitle>
          {history.map((h) => (
            <HistoryItem key={h.id} onClick={() => setResult(h)}>
              <HistoryLeft>
                <HistoryFileName>{h.fileName}</HistoryFileName>
                <HistoryDate>{new Date(h.analyzedAt).toLocaleString()}</HistoryDate>
              </HistoryLeft>
              <HistoryScore score={h.score}>{h.score}/100</HistoryScore>
            </HistoryItem>
          ))}
        </HistorySection>
      )}
    </Container>
  );
}
