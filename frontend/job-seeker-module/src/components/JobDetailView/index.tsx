'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { z } from 'zod';
import { Job } from '../../types/job';
import { hasApplied, saveApplication } from '../../utils/applications';

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    companyDescription:
      'TechCorp is a leading software house specializing in enterprise web solutions.',
    location: 'Warsaw, Poland',
    salaryMin: 8000,
    salaryMax: 12000,
    employmentType: 'full-time',
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'GraphQL'],
    requirements: [
      '3+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with Next.js and SSR',
      'Knowledge of REST and GraphQL APIs',
    ],
    description:
      'We are looking for a skilled Frontend Developer to join our growing team. You will be responsible for building responsive web applications and collaborating with design and backend teams.',
    postedAt: new Date('2026-02-20'),
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    companyDescription: 'StartupXYZ is building the future of fintech in Central Europe.',
    location: 'Krakow, Poland',
    salaryMin: 10000,
    salaryMax: 15000,
    employmentType: 'full-time',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    requirements: [
      '5+ years of full-stack experience',
      'Proficiency in Node.js and React',
      'Experience with relational databases',
      'Docker and CI/CD knowledge',
    ],
    description:
      'Join our dynamic team as a Full Stack Engineer. You will help us build scalable microservices and a modern React frontend.',
    postedAt: new Date('2026-02-18'),
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    companyDescription: 'DesignStudio creates award-winning digital experiences for global brands.',
    location: 'Gdansk, Poland',
    salaryMin: 6000,
    salaryMax: 9000,
    employmentType: 'contract',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    requirements: [
      'Portfolio demonstrating UI/UX work',
      'Proficiency in Figma',
      'Understanding of accessibility standards',
    ],
    description:
      'Creative UI/UX Designer needed to lead product design for multiple client projects.',
    postedAt: new Date('2026-02-15'),
  },
];

const applySchema = z.object({
  coverLetter: z.string().max(2000, 'Cover letter cannot exceed 2000 characters').optional(),
  cvFile: z
    .custom<File>()
    .refine((f) => !f || f.type === 'application/pdf', 'Only PDF files are allowed')
    .refine((f) => !f || f.size <= 5 * 1024 * 1024, 'File size cannot exceed 5MB')
    .optional(),
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
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

const JobHeaderCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const JobTitle = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 8px 0;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const CompanyName = styled.div`
  font-size: 1.1rem;
  color: #007bff;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
`;

const Section = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.7;
  margin: 0;
`;

const RequirementList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #555;
  line-height: 1.8;
`;

const AlreadyAppliedBanner = styled.div`
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  padding: 16px 20px;
  color: #2e7d32;
  font-size: 15px;
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
`;

const OptionalBadge = styled.span`
  color: #999;
  font-weight: 400;
  font-size: 12px;
  margin-left: 6px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const CharCount = styled.div<{ $over?: boolean }>`
  text-align: right;
  font-size: 12px;
  color: ${(p) => (p.$over ? '#d32f2f' : '#999')};
  margin-top: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.button`
  display: inline-block;
  padding: 10px 16px;
  border: 1px dashed #007bff;
  border-radius: 6px;
  background: #f0f7ff;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #e3f0ff;
  }
`;

const FileName = styled.span`
  font-size: 13px;
  color: #555;
  margin-left: 10px;
`;

const RemoveFileBtn = styled.button`
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  font-size: 13px;
  margin-left: 8px;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 13px;
  margin-top: 6px;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  &:hover {
    background: #0056b3;
  }
  &:disabled {
    background: #90caf9;
    cursor: not-allowed;
  }
`;

const SuccessBanner = styled.div`
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  border-radius: 8px;
  padding: 16px 20px;
  color: #2e7d32;
  font-size: 15px;
  margin-top: 16px;
`;

const ErrorBanner = styled.div`
  background: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 8px;
  padding: 16px 20px;
  color: #c62828;
  font-size: 15px;
  margin-top: 16px;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

// ─── Component ────────────────────────────────────────────────────────────────

interface JobDetailViewProps {
  jobId: string;
}

export default function JobDetailView({ jobId }: JobDetailViewProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const found = mockJobs.find((j) => j.id === jobId) || null;
    setJob(found);
    if (found) {
      setAlreadyApplied(hasApplied(found.id));
    }
  }, [jobId]);

  const validate = () => {
    const result = applySchema.safeParse({ coverLetter: coverLetter || undefined, cvFile });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        const key = e.path[0] as string;
        fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCvFile(file);
    if (file) {
      const result = applySchema.shape.cvFile.safeParse(file);
      if (!result.success) {
        setErrors((prev) => ({ ...prev, cvFile: result.error.errors[0].message }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.cvFile;
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      saveApplication({
        jobId: job!.id,
        jobTitle: job!.title,
        company: job!.company,
        location: job!.location,
        employmentType: job!.employmentType,
        salaryMin: job!.salaryMin,
        salaryMax: job!.salaryMax,
        appliedAt: new Date().toISOString(),
        status: 'pending',
        coverLetter: coverLetter || undefined,
      });
      setAlreadyApplied(true);
      setSubmitStatus('success');
      setCoverLetter('');
      setCvFile(undefined);
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to ${max?.toLocaleString()} PLN`;
    if (!max) return `From ${min?.toLocaleString()} PLN`;
    return `${min.toLocaleString()} – ${max.toLocaleString()} PLN`;
  };

  if (!job) {
    return (
      <Container>
        <BackLink href="/jobs">← Back to Jobs</BackLink>
        <NotFound>
          <h2>Job not found</h2>
          <p>This position may have been removed or the link is incorrect.</p>
        </NotFound>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink href="/jobs">← Back to Jobs</BackLink>

      <JobHeaderCard>
        <JobTitle>{job.title}</JobTitle>
        <CompanyName>{job.company}</CompanyName>
        <MetaRow>
          <span>📍 {job.location}</span>
          <span>💼 {job.employmentType}</span>
          <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
          <span>📅 {new Date(job.postedAt).toLocaleDateString()}</span>
        </MetaRow>
        <SkillTags>
          {job.skills.map((skill) => (
            <SkillTag key={skill}>{skill}</SkillTag>
          ))}
        </SkillTags>
      </JobHeaderCard>

      <Section>
        <SectionTitle>About the Role</SectionTitle>
        <Description>{job.description}</Description>
      </Section>

      {job.requirements && job.requirements.length > 0 && (
        <Section>
          <SectionTitle>Requirements</SectionTitle>
          <RequirementList>
            {job.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </RequirementList>
        </Section>
      )}

      {job.companyDescription && (
        <Section>
          <SectionTitle>About {job.company}</SectionTitle>
          <Description>{job.companyDescription}</Description>
        </Section>
      )}

      {alreadyApplied && submitStatus !== 'success' && (
        <AlreadyAppliedBanner>✅ You have already applied to this position.</AlreadyAppliedBanner>
      )}

      {!alreadyApplied && (
        <Section>
          <SectionTitle>Apply for this Position</SectionTitle>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <FormLabel>
                Cover Letter <OptionalBadge>(optional)</OptionalBadge>
              </FormLabel>
              <Textarea
                placeholder="Tell us why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <CharCount $over={coverLetter.length > 2000}>{coverLetter.length} / 2000</CharCount>
              {errors.coverLetter && <ErrorText>{errors.coverLetter}</ErrorText>}
            </div>

            <div style={{ marginBottom: 8 }}>
              <FormLabel>
                CV / Resume <OptionalBadge>(optional, PDF only, max 5MB)</OptionalBadge>
              </FormLabel>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <FileButton type="button" onClick={() => fileInputRef.current?.click()}>
                  📎 Upload PDF
                </FileButton>
                <FileInput
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                {cvFile && (
                  <>
                    <FileName>{cvFile.name}</FileName>
                    <RemoveFileBtn
                      type="button"
                      onClick={() => {
                        setCvFile(undefined);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      Remove
                    </RemoveFileBtn>
                  </>
                )}
              </div>
              {errors.cvFile && <ErrorText>{errors.cvFile}</ErrorText>}
            </div>

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </SubmitButton>
          </form>

          {submitStatus === 'success' && (
            <SuccessBanner>
              🎉 Application submitted successfully! You will hear back from us soon.
            </SuccessBanner>
          )}
          {submitStatus === 'error' && (
            <ErrorBanner>Something went wrong. Please try again later.</ErrorBanner>
          )}
        </Section>
      )}
    </Container>
  );
}
