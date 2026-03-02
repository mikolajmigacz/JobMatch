import { Application, EmployerJob } from '@/types/job';

export const MOCK_JOBS: EmployerJob[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    companyName: 'Acme Corp',
    location: 'Warsaw, Poland',
    employmentType: 'full-time',
    salaryMin: 8000,
    salaryMax: 12000,
    skills: ['React', 'TypeScript', 'Next.js'],
    description:
      'We are looking for a skilled Frontend Developer to join our growing team. You will work on cutting-edge web applications.',
    requirements:
      'At least 3 years of React experience. Strong TypeScript skills. Experience with Next.js and styled-components.',
    status: 'active',
    postedAt: new Date('2026-02-10'),
    applicationCount: 14,
    applicationsByStatus: { pending: 8, accepted: 3, rejected: 3 },
  },
  {
    id: '2',
    title: 'Backend Engineer',
    companyName: 'Acme Corp',
    location: 'Krakow, Poland',
    employmentType: 'full-time',
    salaryMin: 10000,
    salaryMax: 15000,
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    description:
      'Join our backend team and build high-performance APIs and microservices for millions of users worldwide.',
    requirements:
      'Strong Node.js and SQL skills. Experience with Docker and Kubernetes is a plus. REST and gRPC.',
    status: 'active',
    postedAt: new Date('2026-02-15'),
    applicationCount: 7,
    applicationsByStatus: { pending: 5, accepted: 1, rejected: 1 },
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    companyName: 'Acme Corp',
    location: 'Remote',
    employmentType: 'contract',
    salaryMin: 12000,
    salaryMax: 18000,
    skills: ['Kubernetes', 'AWS', 'Terraform'],
    description:
      'We are looking for a DevOps specialist to help us scale our infrastructure reliably and securely in AWS.',
    requirements:
      'Deep AWS knowledge (EKS, RDS, S3). Terraform or Pulumi. CI/CD pipeline experience with GitHub Actions.',
    status: 'closed',
    postedAt: new Date('2026-01-05'),
    closedAt: new Date('2026-02-01'),
    applicationCount: 22,
    applicationsByStatus: { pending: 0, accepted: 2, rejected: 20 },
  },
];

export const findMockJob = (id: string): EmployerJob | undefined =>
  MOCK_JOBS.find((j) => j.id === id);

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: '1',
    applicantName: 'Anna Kowalska',
    applicantEmail: 'anna.kowalska@email.com',
    appliedAt: new Date('2026-02-12'),
    status: 'pending',
    coverLetter:
      'I am a passionate Frontend Developer with 4 years of experience in React and TypeScript. I have built several large-scale applications and I am excited about this opportunity.',
    cvUrl: '/mock/cv-anna-kowalska.pdf',
  },
  {
    id: 'a2',
    jobId: '1',
    applicantName: 'Piotr Nowak',
    applicantEmail: 'piotr.nowak@email.com',
    appliedAt: new Date('2026-02-13'),
    status: 'pending',
    coverLetter:
      'As a senior frontend engineer with deep Next.js expertise, I believe I can bring significant value to your team. My experience includes working with micro-frontend architectures and complex state management.',
    cvUrl: '/mock/cv-piotr-nowak.pdf',
  },
  {
    id: 'a3',
    jobId: '1',
    applicantName: 'Marta Wiśniewska',
    applicantEmail: 'marta.wisniewska@email.com',
    appliedAt: new Date('2026-02-14'),
    status: 'accepted',
    coverLetter:
      'I specialize in building accessible, performant UIs. My portfolio includes e-commerce platforms with millions of daily users.',
    cvUrl: '/mock/cv-marta-wisniewska.pdf',
  },
  {
    id: 'a4',
    jobId: '1',
    applicantName: 'Tomasz Zając',
    applicantEmail: 'tomasz.zajac@email.com',
    appliedAt: new Date('2026-02-15'),
    status: 'rejected',
    coverLetter:
      "I am transitioning from backend to frontend development. I have completed several React courses and I'm eager to grow in this area.",
    cvUrl: '/mock/cv-tomasz-zajac.pdf',
  },
  {
    id: 'a5',
    jobId: '2',
    applicantName: 'Kamil Lewandowski',
    applicantEmail: 'kamil.lewandowski@email.com',
    appliedAt: new Date('2026-02-17'),
    status: 'pending',
    coverLetter:
      'With 5 years of backend experience in Node.js and PostgreSQL, I have designed and maintained APIs serving over 10M requests per day.',
    cvUrl: '/mock/cv-kamil-lewandowski.pdf',
  },
  {
    id: 'a6',
    jobId: '2',
    applicantName: 'Agnieszka Dąbrowska',
    applicantEmail: 'agnieszka.dabrowska@email.com',
    appliedAt: new Date('2026-02-18'),
    status: 'pending',
    coverLetter:
      'I am a backend engineer focused on microservices and distributed systems. I have extensive experience with Docker Compose and Kubernetes deployments.',
    cvUrl: '/mock/cv-agnieszka-dabrowska.pdf',
  },
];

export const findApplicationsByJobId = (jobId: string): Application[] =>
  MOCK_APPLICATIONS.filter((a) => a.jobId === jobId);
