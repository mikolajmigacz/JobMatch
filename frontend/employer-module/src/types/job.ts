export type JobStatus = 'active' | 'closed' | 'draft';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type SortOption = 'newest' | 'oldest' | 'applications';

export interface EmployerJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  description: string;
  requirements: string;
  status: JobStatus;
  postedAt: Date;
  closedAt?: Date;
  applicationCount: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
}

export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  appliedAt: Date;
  status: ApplicationStatus;
  coverLetter: string;
  cvUrl: string;
}

export interface JobFilters {
  search?: string;
  status?: JobStatus | 'all';
  sort?: SortOption;
}
