# JobMatch

> A modern job matching platform built with microservices architecture and microfrontends, demonstrating enterprise-level full-stack development practices.

[![Under Development](https://img.shields.io/badge/status-under%20development-yellow)](https://github.com/yourusername/jobmatch)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

JobMatch is a full-featured job matching platform that connects job seekers with employers. Built as a portfolio project, it showcases modern software architecture, cloud-native development, and best practices in distributed systems.

**Key Features:**

- 🔍 Smart job search with advanced filtering
- 📄 AI-powered CV analysis (Google Gemini)
- 💼 Complete application management for both job seekers and employers
- 🎯 "It's a Match!" notification system
- 📧 Automated email notifications
- 🔐 Secure authentication and authorization

---

## 🎯 What This Project Demonstrates

This project showcases expertise in:

- **Microservices Architecture** – Independent, scalable services with clear boundaries
- **Microfrontend Pattern** – Module Federation for independently deployable UI components
- **Event-Driven Design** – Asynchronous communication using AWS SQS
- **Cloud Integration** – AWS services (S3, DynamoDB, SQS) via LocalStack
- **Type Safety** – End-to-end type safety with TypeScript, tRPC, and Zod
- **AI Integration** – CV analysis using Google Gemini API
- **DevOps Practices** – Docker containerization, CI/CD with GitHub Actions
- **Security** – JWT authentication, role-based access control, bcrypt encryption

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (tRPC)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┬────────────┐
    │            │            │              │            │
┌───▼────┐  ┌───▼────┐  ┌───▼─────┐  ┌─────▼────┐  ┌───▼──────┐
│  Auth  │  │  User  │  │   Job   │  │Application│  │CV Analysis│
│Service │  │Service │  │ Service │  │  Service  │  │  Service │
└────────┘  └────────┘  └─────────┘  └─────┬─────┘  └──────────┘
                                            │
                                    ┌───────▼────────┐
                                    │ Email Service  │
                                    │   (via SQS)    │
                                    └────────────────┘
```

### Technology Stack

#### Backend

- **NestJS** – Auth service with enterprise patterns
- **Express.js** – Lightweight microservices
- **tRPC** – Type-safe API communication
- **Zod** – Runtime validation and type inference
- **DynamoDB Toolbox** – Type-safe ORM for DynamoDB

#### Frontend

- **React 18** with TypeScript
- **Webpack 5 Module Federation** – Microfrontend architecture
- **TanStack Query** – Server state management
- **styled-components** – Component-scoped styling

#### Infrastructure

- **DynamoDB** – NoSQL database (via LocalStack)
- **AWS S3** – File storage for CVs and company logos
- **AWS SQS** – Message queue for async operations
- **Docker & Docker Compose** – Containerization
- **MailHog** – Email testing in development

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher
- Docker and Docker Compose

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jobmatch.git
cd jobmatch

# Install dependencies
pnpm install

# Start infrastructure (LocalStack, MailHog, databases)
docker-compose up -d

# Run all services in development mode
pnpm dev
```

### Access Points

- **Frontend (Job Seekers):** http://localhost:3001
- **Frontend (Employers):** http://localhost:3002
- **API Gateway:** http://localhost:4000
- **MailHog UI:** http://localhost:8025

---

## 📸 Screenshots & Demo

> **Note:** Screenshots and video demos will be added as the application reaches production-ready status.

---

## 🎨 Key Features in Detail

### For Job Seekers

- **Smart Job Search** – Filter by location, salary range, employment type, and required skills
- **One-Click Applications** – Apply to jobs with your stored profile
- **CV Upload & Analysis** – AI-powered CV parsing and skill extraction
- **Application Tracking** – Monitor application status in real-time
- **Match Notifications** – Get notified when employers accept your application

### For Employers

- **Job Posting Management** – Create, edit, and manage job listings
- **Applicant Review** – Review candidate profiles and CVs
- **Application Management** – Accept or reject applications
- **Automated Notifications** – Receive alerts for new applications
- **Company Branding** – Upload company logo and customize job postings

---

## 🧩 Microservices

| Service                 | Technology | Purpose                                    |
| ----------------------- | ---------- | ------------------------------------------ |
| **Auth Service**        | NestJS     | User authentication, JWT token management  |
| **User Service**        | Express.js | User profile management                    |
| **Job Service**         | Express.js | Job posting CRUD operations                |
| **Application Service** | Express.js | Job application workflows                  |
| **CV Analysis Service** | Express.js | AI-powered CV parsing (Gemini API)         |
| **Email Service**       | Express.js | Asynchronous email notifications via SQS   |
| **API Gateway**         | Express.js | Request routing, authentication middleware |

---

## 🔐 Security Features

- **JWT Authentication** – Secure token-based authentication
- **Role-Based Access Control (RBAC)** – Separate permissions for job seekers and employers
- **Password Encryption** – bcrypt hashing for secure password storage
- **Input Validation** – Zod schemas for request/response validation
- **CORS Configuration** – Controlled cross-origin requests
- **Rate Limiting** – Protection against abuse (planned)

---

## 🧪 Testing Strategy

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run integration tests
pnpm test:integration
```

- **Unit Tests** – Individual service logic testing
- **Integration Tests** – API endpoint and database interaction tests
- **Infrastructure Tests** – LocalStack connectivity validation
- **Type Safety** – Compile-time type checking with TypeScript

---

## 📦 Project Structure

```
jobmatch/
├── services/               # Backend microservices
│   ├── auth-service/      # NestJS authentication service
│   ├── user-service/      # User management
│   ├── job-service/       # Job postings
│   ├── application-service/ # Application workflows
│   ├── cv-analysis-service/ # AI CV parsing
│   ├── email-service/     # Email notifications
│   └── api-gateway/       # API routing
│
├── frontend/              # Microfrontend modules
│   ├── shell/            # Application shell
│   ├── job-seeker-module/ # Job seeker UI
│   └── employer-module/   # Employer UI
│
├── packages/             # Shared packages
│   └── shared/          # Common types, schemas, utilities
│
└── docker/              # Docker configurations
    └── localstack/      # AWS services emulation
```

---

## 🛠️ Development Tools

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Code formatting
pnpm format
pnpm format:check

# Clean build artifacts
pnpm clean
```

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# AWS LocalStack
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_ENDPOINT=http://localhost:4566
S3_ENDPOINT=http://localhost:4566
SQS_ENDPOINT=http://localhost:4566

# Google Gemini API
GEMINI_API_KEY=your_api_key_here

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Email (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
```

---

## 📚 Technical Deep Dive

### Why Microservices?

This architecture was chosen to demonstrate:

- **Scalability** – Individual services can be scaled independently
- **Maintainability** – Clear service boundaries and separation of concerns
- **Technology Flexibility** – Mix NestJS and Express.js based on service needs
- **Team Autonomy** – Services can be developed and deployed independently
- **Fault Isolation** – Service failures don't cascade

### Type Safety Implementation

**End-to-end type safety** is achieved through:

1. **Zod Schemas** – Define runtime-validated types once, use everywhere
2. **tRPC** – Automatically infer types from backend to frontend
3. **DynamoDB Toolbox** – Type-safe database operations
4. **Shared Package** – Common types across all services

```typescript
// Define once in @jobmatch/shared
export const JobSchema = z.object({
  jobId: z.string().uuid(),
  title: z.string().min(5).max(200),
  // ... more fields
});

// Use everywhere with full type safety
type Job = z.infer<typeof JobSchema>;
```

### Event-Driven Communication

Services communicate asynchronously via AWS SQS:

```
Application Service → SQS Queue → Email Service → SMTP
```

**Benefits:**

- Decoupled services
- Improved reliability (retry logic)
- Better performance (non-blocking operations)
- Scalable message processing

### AI Integration

CV Analysis Service uses **Google Gemini 1.5 Flash** for:

- Extracting candidate information from PDFs
- Identifying skills and experience
- Matching candidates to job requirements

---

## 🚀 Deployment (Planned)

This project is designed for cloud deployment with:

- **AWS ECS/EKS** – Container orchestration
- **AWS RDS** – Production database (DynamoDB)
- **AWS S3** – Production file storage
- **AWS SQS** – Production message queue
- **CloudFront** – CDN for frontend
- **GitHub Actions** – Automated CI/CD pipeline

---

## 📝 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced search with Elasticsearch
- [ ] Chat system between employers and candidates
- [ ] Video interview scheduling
- [ ] Analytics dashboard for employers
- [ ] Mobile applications (React Native)
- [ ] GraphQL API alternative
- [ ] Kubernetes deployment manifests

---

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

Built as a demonstration of modern full-stack development practices, incorporating industry-standard tools and architectural patterns.

**Technologies Used:**

- NestJS, Express.js, React, TypeScript
- AWS Services (via LocalStack)
- Google Gemini API
- Docker, GitHub Actions
- tRPC, Zod, TanStack Query

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

</div>
