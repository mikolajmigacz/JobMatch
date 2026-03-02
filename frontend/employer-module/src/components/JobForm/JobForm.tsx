'use client';

import { useState, KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { EmploymentType } from '@/types/job';
import { JobFormSchema, JobFormValues } from './schema';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
export const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 28px 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

export const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${({ $error }) => ($error ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  &:focus {
    outline: 2px solid #0070f3;
    border-color: transparent;
  }
`;

const Textarea = styled.textarea<{ $error?: boolean }>`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${({ $error }) => ($error ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  &:focus {
    outline: 2px solid #0070f3;
    border-color: transparent;
  }
`;

const SelectInput = styled.select<{ $error?: boolean }>`
  width: 100%;
  padding: 9px 12px;
  border: 1px solid ${({ $error }) => ($error ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  font-size: 0.9rem;
  background: #fff;
  box-sizing: border-box;
  &:focus {
    outline: 2px solid #0070f3;
    border-color: transparent;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMsg = styled.p`
  font-size: 0.78rem;
  color: #ef4444;
  margin: 4px 0 0;
`;

const TagsContainer = styled.div<{ $error?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border: 1px solid ${({ $error }) => ($error ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  min-height: 42px;
  background: #fff;
  &:focus-within {
    outline: 2px solid #0070f3;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1d4ed8;
  line-height: 1;
  padding: 0;
  &:hover {
    color: #ef4444;
  }
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.875rem;
  flex: 1;
  min-width: 100px;
`;

const Hint = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 4px 0 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 28px;
`;

export const Button = styled.button<{ variant?: 'secondary' | 'danger' }>`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${({ variant }) =>
    variant === 'secondary' ? '#f3f4f6' : variant === 'danger' ? '#fee2e2' : '#0070f3'};
  color: ${({ variant }) =>
    variant === 'secondary' ? '#374151' : variant === 'danger' ? '#b91c1c' : '#fff'};
  &:hover {
    background: ${({ variant }) =>
      variant === 'secondary' ? '#e5e7eb' : variant === 'danger' ? '#fecaca' : '#0051a2'};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const WarningBanner = styled.div`
  padding: 12px 16px;
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 8px;
  color: #854d0e;
  font-size: 0.875rem;
  margin-bottom: 20px;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface JobFormProps {
  defaultValues?: Partial<JobFormValues>;
  onSubmit: (data: JobFormValues) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
  warning?: string;
}

export function JobForm({ defaultValues, onSubmit, submitLabel, onCancel, warning }: JobFormProps) {
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: { skills: [], companyName: '', ...defaultValues },
  });

  const skills = watch('skills') ?? [];

  const addSkill = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 20) return;
    setValue('skills', [...skills, trimmed], { shouldValidate: true });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === 'Backspace' && !skillInput && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {warning && <WarningBanner>{warning}</WarningBanner>}

      <Card>
        <Section>
          <Label htmlFor="title">Job Title *</Label>
          <Input id="title" $error={!!errors.title} {...register('title')} />
          {errors.title && <ErrorMsg>{errors.title.message}</ErrorMsg>}
        </Section>

        <Row>
          <Section>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input id="companyName" $error={!!errors.companyName} {...register('companyName')} />
            {errors.companyName && <ErrorMsg>{errors.companyName.message}</ErrorMsg>}
          </Section>
          <Section>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. Warsaw, Remote"
              $error={!!errors.location}
              {...register('location')}
            />
            {errors.location && <ErrorMsg>{errors.location.message}</ErrorMsg>}
          </Section>
        </Row>

        <Section>
          <Label htmlFor="employmentType">Employment Type *</Label>
          <SelectInput
            id="employmentType"
            $error={!!errors.employmentType}
            {...register('employmentType')}
          >
            <option value="">Select type…</option>
            {(['full-time', 'part-time', 'contract', 'internship'] as EmploymentType[]).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
          {errors.employmentType && <ErrorMsg>{errors.employmentType.message}</ErrorMsg>}
        </Section>

        <Row>
          <Section>
            <Label htmlFor="salaryMin">Salary Min (PLN, optional)</Label>
            <Input
              id="salaryMin"
              type="number"
              min={0}
              $error={!!errors.salaryMin}
              {...register('salaryMin', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            />
            {errors.salaryMin && <ErrorMsg>{errors.salaryMin.message}</ErrorMsg>}
          </Section>
          <Section>
            <Label htmlFor="salaryMax">Salary Max (PLN, optional)</Label>
            <Input
              id="salaryMax"
              type="number"
              min={0}
              $error={!!errors.salaryMax}
              {...register('salaryMax', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
            />
            {errors.salaryMax && <ErrorMsg>{errors.salaryMax.message}</ErrorMsg>}
          </Section>
        </Row>

        <Section>
          <Label>Skills * (press Enter or comma to add)</Label>
          <Controller
            name="skills"
            control={control}
            render={() => (
              <TagsContainer $error={!!errors.skills}>
                {skills.map((s) => (
                  <Tag key={s}>
                    {s}
                    <TagRemove type="button" onClick={() => removeSkill(s)}>
                      ×
                    </TagRemove>
                  </Tag>
                ))}
                <TagInput
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={onSkillKeyDown}
                  onBlur={() => addSkill(skillInput)}
                  placeholder={skills.length === 0 ? 'e.g. React, TypeScript…' : ''}
                />
              </TagsContainer>
            )}
          />
          {errors.skills && <ErrorMsg>{(errors.skills as { message?: string }).message}</ErrorMsg>}
          <Hint>{skills.length}/20 skills added</Hint>
        </Section>

        <Section>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            rows={6}
            $error={!!errors.description}
            {...register('description')}
          />
          {errors.description && <ErrorMsg>{errors.description.message}</ErrorMsg>}
          <Hint>Min 50 characters. {watch('description')?.length ?? 0} / 5000</Hint>
        </Section>

        <Section>
          <Label htmlFor="requirements">Requirements *</Label>
          <Textarea
            id="requirements"
            rows={5}
            $error={!!errors.requirements}
            {...register('requirements')}
          />
          {errors.requirements && <ErrorMsg>{errors.requirements.message}</ErrorMsg>}
          <Hint>Min 20 characters. {watch('requirements')?.length ?? 0} / 3000</Hint>
        </Section>
      </Card>

      <ButtonRow>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </ButtonRow>
    </form>
  );
}
