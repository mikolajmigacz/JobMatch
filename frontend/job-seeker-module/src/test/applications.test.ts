import { describe, it, expect, beforeEach } from 'vitest';
import {
  getApplications,
  hasApplied,
  saveApplication,
  updateApplicationStatus,
} from '../utils/applications';

beforeEach(() => localStorage.clear());

describe('getApplications', () => {
  it('returns empty array when storage is empty', () => {
    expect(getApplications()).toEqual([]);
  });

  it('returns stored applications', () => {
    saveApplication({
      jobId: '1',
      jobTitle: 'Dev',
      company: 'Corp',
      location: 'Warsaw',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    expect(getApplications()).toHaveLength(1);
  });
});

describe('hasApplied', () => {
  it('returns false when not applied', () => {
    expect(hasApplied('99')).toBe(false);
  });

  it('returns true after applying', () => {
    saveApplication({
      jobId: '42',
      jobTitle: 'Engineer',
      company: 'Inc',
      location: 'Remote',
      employmentType: 'contract',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    expect(hasApplied('42')).toBe(true);
  });
});

describe('saveApplication', () => {
  it('assigns a unique id and stores application', () => {
    const app = saveApplication({
      jobId: '5',
      jobTitle: 'Designer',
      company: 'Studio',
      location: 'Gdansk',
      employmentType: 'part-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    expect(app.id).toBeTruthy();
    expect(getApplications()).toHaveLength(1);
  });
});

describe('updateApplicationStatus', () => {
  it('updates status of existing application', () => {
    const app = saveApplication({
      jobId: '7',
      jobTitle: 'PM',
      company: 'Co',
      location: 'Krakow',
      employmentType: 'full-time',
      appliedAt: new Date().toISOString(),
      status: 'pending',
    });
    updateApplicationStatus(app.id, 'accepted');
    const updated = getApplications().find((a) => a.id === app.id);
    expect(updated?.status).toBe('accepted');
  });
});
