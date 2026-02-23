'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { z } from 'zod';

// ─── Types & Validation ───────────────────────────────────────────────────────
interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
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

// ─── Storage helpers ─────────────────────────────────────────────────────────
const PROFILE_KEY = 'jobmatch_profile';

const defaultProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: new Date('2026-01-01').toISOString(),
};

const loadProfile = (): UserProfile => {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') ?? defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const saveProfile = (p: UserProfile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(p));

// ─── Styles ───────────────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 720px;
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

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
`;

const Label = styled.span`
  font-weight: 600;
  min-width: 80px;
  color: #333;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${(p) => (p.hasError ? '#e53935' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorMsg = styled.div`
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const Btn = styled.button<{ variant?: 'danger' | 'outline' | 'ghost' }>`
  padding: 10px 22px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: ${(p) =>
    p.variant === 'outline'
      ? '1px solid #007bff'
      : p.variant === 'danger'
        ? '1px solid #e53935'
        : p.variant === 'ghost'
          ? '1px solid #ccc'
          : 'none'};
  background: ${(p) =>
    p.variant === 'outline' || p.variant === 'ghost'
      ? 'white'
      : p.variant === 'danger'
        ? '#e53935'
        : '#007bff'};
  color: ${(p) =>
    p.variant === 'outline'
      ? '#007bff'
      : p.variant === 'ghost'
        ? '#555'
        : p.variant === 'danger'
          ? 'white'
          : 'white'};
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Banner = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 12px;
  background: ${(p) => (p.type === 'success' ? '#e8f5e9' : '#ffebee')};
  color: ${(p) => (p.type === 'success' ? '#2e7d32' : '#c62828')};
  border: 1px solid ${(p) => (p.type === 'success' ? '#a5d6a7' : '#ef9a9a')};
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 10px;
  padding: 32px 28px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 10px;
`;

const ModalText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 24px;
`;

type FeedbackState = { type: 'success' | 'error'; msg: string } | null;

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [profileFb, setProfileFb] = useState<FeedbackState>(null);

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwFb, setPwFb] = useState<FeedbackState>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setForm({ name: p.name, email: p.email });
  }, []);

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // ── Profile edit ──────────────────────────────────────────────────────────
  const startEdit = () => {
    setForm({ name: profile.name, email: profile.email });
    setEditing(true);
    setProfileFb(null);
  };
  const cancelEdit = () => {
    setEditing(false);
    setFormErrors({});
  };

  const submitProfile = () => {
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        errs[e.path[0] as string] = e.message;
      });
      setFormErrors(errs);
      return;
    }
    const updated = { ...profile, ...form };
    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
    setFormErrors({});
    setProfileFb({ type: 'success', msg: 'Profile updated successfully.' });
  };

  // ── Password change ───────────────────────────────────────────────────────
  const submitPassword = () => {
    const result = passwordSchema.safeParse(pwForm);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        errs[e.path[0] as string] = e.message;
      });
      setPwErrors(errs);
      return;
    }
    // Mock: accept any current password
    setPwErrors({});
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwFb({ type: 'success', msg: 'Password changed successfully.' });
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const confirmDelete = () => {
    localStorage.removeItem(PROFILE_KEY);
    setShowDeleteModal(false);
    setDeleted(true);
  };

  if (deleted) {
    return (
      <Container>
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
          <h2 style={{ color: '#333', marginBottom: 8 }}>Account deleted</h2>
          <p style={{ color: '#666' }}>Your account has been removed.</p>
          <BackLink href="/">← Return Home</BackLink>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {showDeleteModal && (
        <Overlay>
          <Modal>
            <ModalTitle>Delete Account?</ModalTitle>
            <ModalText>
              This action is permanent and cannot be undone. All your data will be removed.
            </ModalText>
            <ButtonRow style={{ justifyContent: 'center' }}>
              <Btn variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Btn>
              <Btn variant="danger" onClick={confirmDelete}>
                Yes, Delete
              </Btn>
            </ButtonRow>
          </Modal>
        </Overlay>
      )}

      <BackLink href="/">← Home</BackLink>
      <h1 style={{ fontSize: '1.8rem', color: '#333', marginBottom: 24 }}>My Profile</h1>

      {/* ── Overview ── */}
      <Card>
        <CardTitle>Account Info</CardTitle>
        <Avatar>{initials}</Avatar>
        {!editing ? (
          <>
            <InfoRow>
              <Label>Name</Label>
              <span>{profile.name}</span>
            </InfoRow>
            <InfoRow>
              <Label>Email</Label>
              <span>{profile.email}</span>
            </InfoRow>
            <InfoRow>
              <Label>Member since</Label>
              <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
            </InfoRow>
            <ButtonRow style={{ marginTop: 16 }}>
              <Btn onClick={startEdit}>Edit Profile</Btn>
            </ButtonRow>
            {profileFb && <Banner type={profileFb.type}>{profileFb.msg}</Banner>}
          </>
        ) : (
          <>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={form.name}
                hasError={!!formErrors.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              {formErrors.name && <ErrorMsg>{formErrors.name}</ErrorMsg>}
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={form.email}
                hasError={!!formErrors.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              {formErrors.email && <ErrorMsg>{formErrors.email}</ErrorMsg>}
            </Field>
            <ButtonRow>
              <Btn onClick={submitProfile}>Save Changes</Btn>
              <Btn variant="ghost" onClick={cancelEdit}>
                Cancel
              </Btn>
            </ButtonRow>
          </>
        )}
      </Card>

      {/* ── Password ── */}
      <Card>
        <CardTitle>Change Password</CardTitle>
        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
          <Field key={field}>
            <FieldLabel>
              {field === 'currentPassword'
                ? 'Current Password'
                : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'}
            </FieldLabel>
            <Input
              type="password"
              value={pwForm[field]}
              hasError={!!pwErrors[field]}
              onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
            />
            {pwErrors[field] && <ErrorMsg>{pwErrors[field]}</ErrorMsg>}
          </Field>
        ))}
        <ButtonRow>
          <Btn onClick={submitPassword}>Change Password</Btn>
        </ButtonRow>
        {pwFb && <Banner type={pwFb.type}>{pwFb.msg}</Banner>}
      </Card>

      {/* ── Danger zone ── */}
      <Card>
        <CardTitle style={{ color: '#e53935' }}>Danger Zone</CardTitle>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          Permanently delete your account and all associated data.
        </p>
        <Btn variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </Btn>
      </Card>
    </Container>
  );
}
