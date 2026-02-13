// Test file to verify Module Federation can load the remote
// This would be used by the Shell app to import from job-seeker-module

export const REMOTE_CONFIG = {
  name: 'jobSeeker',
  url: 'http://localhost:4001',
  remoteEntryUrl: 'http://localhost:4001/remoteEntry.js',
  exposes: ['./JobSeekerApp', './JobList', './MyApplications', './CVAnalysis'],
};
