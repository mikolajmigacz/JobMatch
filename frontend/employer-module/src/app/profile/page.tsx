'use client';

import { useState, useRef, useCallback, useEffect, DragEvent } from 'react';
import styled from 'styled-components';
import { z } from 'zod';

// ─── Schemas ──────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Types ────────────────────────────────────────────────────────────────────
interface CompanyProfile {
  companyName: string;
  email: string;
  logoUrl: string | null;
  memberSince: string;
}

type ProfileErrors = Partial<Record<keyof z.infer<typeof profileSchema>, string>>;
type PasswordErrors = Partial<
  Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>
>;

// ─── Storage ──────────────────────────────────────────────────────────────────
const KEY = 'employer_profile';
const DEFAULT: CompanyProfile = {
  companyName: 'Acme Corp',
  email: 'admin@acmecorp.com',
  logoUrl: null,
  memberSince: '2026-01-01',
};
const load = (): CompanyProfile => {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') ?? DEFAULT;
  } catch {
    return DEFAULT;
  }
};
const save = (p: CompanyProfile) => localStorage.setItem(KEY, JSON.stringify(p));

// ─── Styles ───────────────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 28px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f3f4f6;
`;

// Logo
const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const LogoPreview = styled.div<{ $hasImage: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: ${(p) => (p.$hasImage ? 'transparent' : '#6366f1')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
`;

const LogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DropZone = styled.div<{ $dragging: boolean }>`
  flex: 1;
  min-width: 200px;
  border: 2px dashed ${(p) => (p.$dragging ? '#6366f1' : '#d1d5db')};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
  background: ${(p) => (p.$dragging ? '#f0f0ff' : 'transparent')};
  &:hover {
    border-color: #6366f1;
    background: #f5f5ff;
  }
`;

const DropText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 6px;
`;

const DropHint = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
`;

const FileInput = styled.input`
  display: none;
`;

// Form
const Field = styled.div`
  margin-bottom: 18px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${(p) => (p.$error ? '#ef4444' : '#d1d5db')};
  border-radius: 8px;
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const ErrorMsg = styled.div`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' }>`
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  border: ${(p) =>
    p.$variant === 'ghost'
      ? '1px solid #d1d5db'
      : p.$variant === 'danger'
        ? '1px solid #ef4444'
        : 'none'};
  background: ${(p) =>
    p.$variant === 'ghost' ? 'white' : p.$variant === 'danger' ? '#ef4444' : '#111'};
  color: ${(p) => (p.$variant === 'ghost' ? '#374151' : 'white')};
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Banner = styled.div<{ $type: 'success' | 'error' }>`
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.8125rem;
  margin-top: 12px;
  background: ${(p) => (p.$type === 'success' ? '#dcfce7' : '#fee2e2')};
  color: ${(p) => (p.$type === 'success' ? '#15803d' : '#b91c1c')};
  border: 1px solid ${(p) => (p.$type === 'success' ? '#86efac' : '#fca5a5')};
`;

const InfoRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 6px;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  min-width: 100px;
  color: #374151;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 28px;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 10px;
`;

const ModalText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 20px;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT);
  const [mounted, setMounted] = useState(false);

  // profile form
  const [profileForm, setProfileForm] = useState({ companyName: '', email: '' });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [profileBanner, setProfileBanner] = useState<'success' | 'error' | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  // password form
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwErrors, setPwErrors] = useState<PasswordErrors>({});
  const [pwBanner, setPwBanner] = useState<'success' | 'error' | null>(null);

  // logo
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const p = load();
    setProfile(p);
    setProfileForm({ companyName: p.companyName, email: p.email });
    setMounted(true);
  }, []);

  // ── Logo upload ──
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setProfile((prev) => {
        const updated = { ...prev, logoUrl: url };
        save(updated);
        return updated;
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  // ── Profile save ──
  const saveProfileForm = () => {
    const result = profileSchema.safeParse(profileForm);
    if (!result.success) {
      const errs: ProfileErrors = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof ProfileErrors] = i.message;
      });
      setProfileErrors(errs);
      return;
    }
    setProfileErrors({});
    const updated = { ...profile, ...result.data };
    setProfile(updated);
    save(updated);
    setEditingProfile(false);
    setProfileBanner('success');
    setTimeout(() => setProfileBanner(null), 3000);
  };

  // ── Password change ──
  const changePassword = () => {
    const result = passwordSchema.safeParse(pwForm);
    if (!result.success) {
      const errs: PasswordErrors = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof PasswordErrors] = i.message;
      });
      setPwErrors(errs);
      return;
    }
    setPwErrors({});
    // TODO: trpc.auth.changePassword.mutate(...)
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwBanner('success');
    setTimeout(() => setPwBanner(null), 3000);
  };

  if (!mounted) return null;

  const initials = profile.companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Container>
      <PageTitle>Company Profile</PageTitle>

      {/* ── Logo ── */}
      <Card>
        <CardTitle>Company Logo</CardTitle>
        <LogoArea>
          <LogoPreview $hasImage={!!profile.logoUrl}>
            {profile.logoUrl ? <LogoImg src={profile.logoUrl} alt="logo" /> : initials}
          </LogoPreview>
          <DropZone
            $dragging={dragging}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <DropText>Drag & drop an image, or click to browse</DropText>
            <DropHint>PNG, JPG, SVG up to 2 MB</DropHint>
          </DropZone>
          <FileInput
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />
        </LogoArea>
        {profile.logoUrl && (
          <Btn
            $variant="ghost"
            style={{ marginTop: 10, fontSize: '0.8125rem' }}
            onClick={() => {
              const updated = { ...profile, logoUrl: null };
              setProfile(updated);
              save(updated);
            }}
          >
            Remove logo
          </Btn>
        )}
      </Card>

      {/* ── Company Info ── */}
      <Card>
        <CardTitle>Company Information</CardTitle>
        {!editingProfile ? (
          <>
            <InfoRow>
              <InfoLabel>Company</InfoLabel>
              {profile.companyName}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email</InfoLabel>
              {profile.email}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Member since</InfoLabel>
              {new Date(profile.memberSince).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </InfoRow>
            <ButtonRow style={{ marginTop: 16 }}>
              <Btn
                onClick={() => {
                  setProfileForm({ companyName: profile.companyName, email: profile.email });
                  setEditingProfile(true);
                }}
              >
                Edit
              </Btn>
            </ButtonRow>
            {profileBanner && <Banner $type={profileBanner}>Profile updated successfully!</Banner>}
          </>
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor="companyName">Company Name *</FieldLabel>
              <Input
                id="companyName"
                value={profileForm.companyName}
                $error={!!profileErrors.companyName}
                onChange={(e) => setProfileForm((p) => ({ ...p, companyName: e.target.value }))}
              />
              {profileErrors.companyName && <ErrorMsg>{profileErrors.companyName}</ErrorMsg>}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email *</FieldLabel>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                $error={!!profileErrors.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
              />
              {profileErrors.email && <ErrorMsg>{profileErrors.email}</ErrorMsg>}
            </Field>
            <ButtonRow>
              <Btn onClick={saveProfileForm}>Save Changes</Btn>
              <Btn
                $variant="ghost"
                onClick={() => {
                  setEditingProfile(false);
                  setProfileErrors({});
                }}
              >
                Cancel
              </Btn>
            </ButtonRow>
          </>
        )}
      </Card>

      {/* ── Password ── */}
      <Card>
        <CardTitle>Change Password</CardTitle>
        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password *</FieldLabel>
          <Input
            id="currentPassword"
            type="password"
            value={pwForm.currentPassword}
            $error={!!pwErrors.currentPassword}
            onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
          />
          {pwErrors.currentPassword && <ErrorMsg>{pwErrors.currentPassword}</ErrorMsg>}
        </Field>
        <Field>
          <FieldLabel htmlFor="newPassword">New Password *</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            value={pwForm.newPassword}
            $error={!!pwErrors.newPassword}
            onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
          />
          {pwErrors.newPassword && <ErrorMsg>{pwErrors.newPassword}</ErrorMsg>}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm New Password *</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={pwForm.confirmPassword}
            $error={!!pwErrors.confirmPassword}
            onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
          {pwErrors.confirmPassword && <ErrorMsg>{pwErrors.confirmPassword}</ErrorMsg>}
        </Field>
        <ButtonRow>
          <Btn onClick={changePassword}>Change Password</Btn>
        </ButtonRow>
        {pwBanner === 'success' && <Banner $type="success">Password changed successfully!</Banner>}
      </Card>

      {/* ── Danger zone ── */}
      <Card>
        <CardTitle>Account Actions</CardTitle>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 16px' }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Btn $variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </Btn>
      </Card>

      {/* ── Delete confirmation modal ── */}
      {showDeleteModal && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Account</ModalTitle>
            <ModalText>
              Are you sure you want to delete your account? All company data, job postings, and
              applications will be permanently removed.
            </ModalText>
            <ButtonRow>
              <Btn
                $variant="danger"
                onClick={() => {
                  /* TODO: trpc.auth.deleteAccount.mutate() */ setShowDeleteModal(false);
                }}
              >
                Yes, Delete
              </Btn>
              <Btn $variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Btn>
            </ButtonRow>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}
