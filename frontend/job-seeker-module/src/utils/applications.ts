import { Application } from '../types/job';

const KEY = 'jobmatch_applications';

export const getApplications = (): Application[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export const hasApplied = (jobId: string): boolean =>
  getApplications().some((a) => a.jobId === jobId);

export const saveApplication = (app: Omit<Application, 'id'>): Application => {
  const applications = getApplications();
  const newApp: Application = { ...app, id: `${Date.now()}` };
  localStorage.setItem(KEY, JSON.stringify([...applications, newApp]));
  return newApp;
};

export const updateApplicationStatus = (id: string, status: Application['status']) => {
  const applications = getApplications().map((a) => (a.id === id ? { ...a, status } : a));
  localStorage.setItem(KEY, JSON.stringify(applications));
};
