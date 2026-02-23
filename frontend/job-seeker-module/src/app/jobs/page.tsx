'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Job, JobFilters } from '../../types/job';

// Mock data for development
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Warsaw, Poland',
    salaryMin: 8000,
    salaryMax: 12000,
    employmentType: 'full-time',
    skills: ['React', 'TypeScript', 'Next.js'],
    description: 'We are looking for a skilled Frontend Developer...',
    postedAt: new Date('2026-02-20'),
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Krakow, Poland',
    salaryMin: 10000,
    salaryMax: 15000,
    employmentType: 'full-time',
    skills: ['Node.js', 'React', 'PostgreSQL'],
    description: 'Join our dynamic team as a Full Stack Engineer...',
    postedAt: new Date('2026-02-18'),
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Gdansk, Poland',
    salaryMin: 6000,
    salaryMax: 9000,
    employmentType: 'contract',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    description: 'Creative UI/UX Designer needed...',
    postedAt: new Date('2026-02-15'),
  },
];

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FiltersContainer = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 20px;
  }
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SalaryRange = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RangeInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ResultsCount = styled.span`
  color: #666;
  font-size: 14px;
`;

const JobGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const JobCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 5px 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CompanyName = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
`;

const JobDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;

  @media (max-width: 768px) {
    gap: 10px;
    font-size: 13px;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const SkillTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const ApplyButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? '#007bff' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${(props) => (props.active ? '#0056b3' : '#f8f9fa')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sortBy, setSortBy] = useState<string>('newest');

  const jobsPerPage = 10;

  useEffect(() => {
    loadJobs();
  }, [currentPage, filters, sortBy]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual tRPC call
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredJobs = [...mockJobs];

      // Apply filters
      if (filters.search) {
        filteredJobs = filteredJobs.filter(
          (job) =>
            job.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
            job.company.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.location) {
        filteredJobs = filteredJobs.filter((job) =>
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.employmentType) {
        filteredJobs = filteredJobs.filter((job) => job.employmentType === filters.employmentType);
      }

      if (filters.salaryMin) {
        filteredJobs = filteredJobs.filter(
          (job) => job.salaryMax && job.salaryMax >= filters.salaryMin!
        );
      }

      if (filters.salaryMax) {
        filteredJobs = filteredJobs.filter(
          (job) => job.salaryMin && job.salaryMin <= filters.salaryMax!
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'salary-desc':
          filteredJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
          break;
        case 'salary-asc':
          filteredJobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
          break;
        case 'oldest':
          filteredJobs.sort(
            (a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
          );
          break;
        default:
          filteredJobs.sort(
            (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
          );
      }

      // Pagination
      const startIndex = (currentPage - 1) * jobsPerPage;
      const endIndex = startIndex + jobsPerPage;
      const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

      setJobs(paginatedJobs);
      setTotalPages(Math.ceil(filteredJobs.length / jobsPerPage));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof JobFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to ${max?.toLocaleString()} PLN`;
    if (!max) return `From ${min?.toLocaleString()} PLN`;
    return `${min.toLocaleString()} - ${max.toLocaleString()} PLN`;
  };

  return (
    <Container>
      <Header>
        <Title>Job Opportunities</Title>
      </Header>

      <FiltersContainer>
        <FiltersRow>
          <SearchInput
            placeholder="Search jobs, companies..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <SearchInput
            placeholder="Location"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />

          <Select
            value={filters.employmentType || ''}
            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </Select>
        </FiltersRow>

        <SalaryRange>
          <RangeInput
            type="number"
            placeholder="Min Salary"
            value={filters.salaryMin || ''}
            onChange={(e) =>
              handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <span>-</span>
          <RangeInput
            type="number"
            placeholder="Max Salary"
            value={filters.salaryMax || ''}
            onChange={(e) =>
              handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </SalaryRange>
      </FiltersContainer>

      <SortContainer>
        <ResultsCount>{loading ? 'Loading...' : `${jobs.length} jobs found`}</ResultsCount>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary-desc">Highest Salary</option>
          <option value="salary-asc">Lowest Salary</option>
        </Select>
      </SortContainer>

      {loading ? (
        <LoadingSpinner>Loading jobs...</LoadingSpinner>
      ) : jobs.length === 0 ? (
        <EmptyState>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </EmptyState>
      ) : (
        <>
          <JobGrid>
            {jobs.map((job) => (
              <JobCard key={job.id}>
                <JobHeader>
                  <JobInfo>
                    <JobTitle>
                      <Link
                        href={`/jobs/${job.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {job.title}
                      </Link>
                    </JobTitle>
                    <CompanyName>{job.company}</CompanyName>
                  </JobInfo>
                  <ApplyButton as={Link} href={`/jobs/${job.id}`}>
                    View & Apply
                  </ApplyButton>
                </JobHeader>

                <JobDetails>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.employmentType}</span>
                  <span>💰 {formatSalary(job.salaryMin, job.salaryMax)}</span>
                </JobDetails>

                <SkillTags>
                  {job.skills.map((skill, index) => (
                    <SkillTag key={index}>{skill}</SkillTag>
                  ))}
                </SkillTags>
              </JobCard>
            ))}
          </JobGrid>

          <PaginationContainer>
            <PageButton
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PageButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageButton
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}

            <PageButton
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </PageButton>
          </PaginationContainer>
        </>
      )}
    </Container>
  );
}
