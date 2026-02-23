/**
 * Module Federation Configuration
 * Defines remotes and shared dependencies for micro-frontend architecture
 */

export const MODULE_FEDERATION_CONFIG = {
  REMOTES: {
    jobSeeker: {
      name: 'jobSeeker',
      url: process.env.NEXT_PUBLIC_JOB_SEEKER_REMOTE,
      scope: 'jobSeeker',
    },
    employer: {
      name: 'employer',
      url: process.env.NEXT_PUBLIC_EMPLOYER_REMOTE,
      scope: 'employer',
    },
  },
  MODULES: {
    APP: './JobSeekerApp',
    JOBS_PAGE: './JobsPage',
    JOB_DETAIL_PAGE: './JobDetailPage',
    APPLICATIONS_PAGE: './ApplicationsPage',
    CV_ANALYSIS_PAGE: './CVAnalysisPage',
    PROFILE_PAGE: './ProfilePage',
  },
} as const;

export type RemoteKey = keyof typeof MODULE_FEDERATION_CONFIG.REMOTES;
export type ModuleKey = keyof typeof MODULE_FEDERATION_CONFIG.MODULES;
