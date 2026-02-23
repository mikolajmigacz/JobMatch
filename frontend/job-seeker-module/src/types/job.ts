export interface Job {
  id: string;
  title: string;
  company: string;
  companyDescription?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  skills: string[];
  requirements?: string[];
  description: string;
  postedAt: Date;
  applicationUrl?: string;
}

export interface ApplyFormData {
  coverLetter?: string;
  cvFile?: File;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  appliedAt: string;
  status: ApplicationStatus;
  coverLetter?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
}

export interface JobListParams {
  page: number;
  limit: number;
  sort?: 'newest' | 'oldest' | 'salary-desc' | 'salary-asc';
  filters?: JobFilters;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}
