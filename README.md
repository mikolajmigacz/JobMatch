# JobMatch

> A production-grade job matching platform demonstrating modern microservices architecture, microfrontends, and enterprise-level full-stack development practices.

[![Status](https://img.shields.io/badge/status-under%20development-yellow?style=flat-square)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## 🎯 Quick Overview

JobMatch connects **job seekers** with **employers** through a modern, scalable platform. Job seekers browse positions and apply with their CV; employers manage job postings and review candidates. The system includes AI-powered CV analysis, smart notifications, and role-based access control.

**Core Features:**

- ✅ Smart job search with filters (location, salary, skills, employment type)
- ✅ AI-powered CV analysis using Google Gemini API
- ✅ Complete application tracking for both users and employers
- ✅ Automated email notifications on important events
- ✅ Secure JWT-based authentication with role separation
- ✅ Real-time "It's a Match!" notifications for accepted applications

---

## 🏗️ Architecture at a Glance

**Microservices Backend** – 7 independent services handling authentication, jobs, applications, CV analysis, and email notifications

**Microfrontend Frontend** – Webpack 5 Module Federation for independently deployable UI components (Job Seeker & Employer modules)

**AWS Integration** – DynamoDB for data, S3 for file storage, SQS for async messaging (via LocalStack in dev)

**Type Safety** – End-to-end type safety with TypeScript, tRPC, Zod, and DynamoDB Toolbox

---

## 🚀 Getting Started

### Prerequisites

```
Node.js 20.x | pnpm 8.x | Docker & Docker Compose
```

### Installation & Running

```bash
# Clone and install
git clone https://github.com/yourusername/jobmatch.git
cd jobmatch
pnpm install

# Start infrastructure (LocalStack, MailHog, databases)
docker-compose up -d

# Run all services in development mode
pnpm dev
```

**Access Points:**

- Frontend (Job Seekers): http://localhost:4001
- Frontend (Employers): http://localhost:4002
- API Gateway: http://localhost:3000
- MailHog UI: http://localhost:8025

---

## 📚 Want to Dive Deeper?

### [Architecture & Design](#architecture--design-principles)

Learn about the microservices design, DDD patterns, and why each architectural decision was made.

### [Technology Stack](#technology-stack)

Detailed breakdown of backend, frontend, database, and infrastructure technologies.

### [Development Guide](#development-guide)

Setup, testing, code quality, and contribution guidelines.

---

## 🏗️ Architecture & Design Principles

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Module Federation)          │
├────────────────┬─────────────────────────────┬──────────────────┤
│  Job Seeker UI │  Shell (Layout & Routing)   │  Employer UI     │
│  (Port 4001)   │  (Port 4000)                │  (Port 4002)     │
└────────────────┴──────────────────┬──────────┴──────────────────┘
                                    │
                      ┌─────────────▼──────────────┐
                      │   API Gateway (NestJS)     │
                      │   - JWT Validation         │
                      │   - Rate Limiting          │
                      │   - Request Routing        │
                      └────────────┬───────────────┘
                                   │
        ┌──────────────┬───────────┼──────────┬─────────────┐
        │              │           │          │             │
    ┌───▼────┐   ┌────▼────┐ ┌───▼────┐ ┌──▼────┐  ┌──────▼──────┐
    │ Auth   │   │  User   │ │  Job   │ │ App  │  │ CV Analysis│
    │Service │   │ Service │ │Service │ │Service│  │ Service    │
    │ (3001) │   │ (3002)  │ │(3003)  │ │(3004)│  │  (3006)    │
    └────────┘   └─────────┘ └────────┘ └──────┘  └──────┬──────┘
                                                          │
                                        ┌─────────────────▼────────────┐
                                        │ AWS SQS Queue (LocalStack)   │
                                        │ - Application Events        │
                                        │ - Email Notifications       │
                                        └─────────────────┬────────────┘
                                                          │
                                        ┌─────────────────▼────────────┐
                                        │  Email Service (3005)        │
                                        │  - Nodemailer + MailHog      │
                                        │  - Email Templates           │
                                        └──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                 AWS SERVICES (LocalStack in Development)             │
├──────────────────┬──────────────────┬──────────────────┐             │
│   DynamoDB       │      S3          │      SQS         │             │
│  - Users         │  - CV PDFs       │  - Email Queue   │             │
│  - Jobs          │  - Logos         │                  │             │
│  - Applications  │                  │                  │             │
│  - CV Analysis   │                  │                  │             │
└──────────────────┴──────────────────┴──────────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

### Design Principles

**Microservices**: Each service has a single responsibility and can be scaled independently.

**Event-Driven**: Services communicate asynchronously via SQS, reducing tight coupling.

**Type Safety**: End-to-end type safety from database to UI using TypeScript, tRPC, and Zod.

**Domain-Driven Design**: Services organized into Domain, Application, Infrastructure, and UI layers.

**Scalability**: Stateless services designed for horizontal scaling.

---

## 🛠️ Technology Stack

#### Backend

| Layer          | Technology         | Purpose                          |
| -------------- | ------------------ | -------------------------------- |
| **Services**   | NestJS, Express.js | Microservice implementations     |
| **API**        | tRPC               | Type-safe RPC communication      |
| **Database**   | DynamoDB, Toolbox  | Type-safe NoSQL queries          |
| **Validation** | Zod                | Runtime schema validation        |
| **Auth**       | JWT, bcrypt        | Token-based authentication       |
| **Messaging**  | AWS SQS            | Event-driven async communication |

#### Frontend

| Layer          | Technology        | Purpose                         |
| -------------- | ----------------- | ------------------------------- |
| **Framework**  | React 18          | UI components                   |
| **Module Fed** | Webpack 5         | Microfrontend architecture      |
| **Routing**    | React Router v6   | Client-side navigation          |
| **State**      | TanStack Query    | Server state management         |
| **API**        | tRPC Client       | Type-safe backend communication |
| **Styling**    | styled-components | Component-scoped CSS            |

#### Infrastructure

| Component            | Technology          | Purpose                        |
| -------------------- | ------------------- | ------------------------------ |
| **Database**         | DynamoDB            | NoSQL primary datastore        |
| **File Storage**     | AWS S3              | CVs, company logos             |
| **Message Queue**    | AWS SQS             | Email notifications            |
| **Email**            | Nodemailer, MailHog | SMTP server (dev)              |
| **Containerization** | Docker, Compose     | Local development environment  |
| **Cloud Emulation**  | LocalStack          | AWS services in development    |
| **CI/CD**            | GitHub Actions      | Automated testing & deployment |

---

## 🔐 Security & Type Safety

### Authentication & Authorization

- **JWT Tokens**: Stateless, signed authentication tokens
- **Role-Based Access Control (RBAC)**: Separate permissions for job seekers and employers
- **Password Security**: bcrypt hashing with salt rounds
- **Protected Routes**: Middleware validation on all protected endpoints

### Type Safety Strategy

**Single Source of Truth**: Define data schemas once in Zod, generate TypeScript types automatically.

```typescript
// Shared schema (packages/shared)
export const JobSchema = z.object({
  jobId: z.string().uuid(),
  title: z.string().min(5).max(200),
  location: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  // ... more fields
});

// Auto-generated TypeScript types
type Job = z.infer<typeof JobSchema>;

// Used in backend (validation) and frontend (form)
```

**Benefits:**

- ✅ Runtime validation on input/output
- ✅ Compile-time type checking
- ✅ No duplicated type definitions
- ✅ Automatic error messages
- ✅ Full IDE autocomplete

---

## 📦 Microservices Overview

| Service                 | Tech       | Port | Responsibility                                 |
| ----------------------- | ---------- | ---- | ---------------------------------------------- |
| **Auth Service**        | NestJS     | 3001 | User registration, login, JWT token management |
| **User Service**        | Express.js | 3002 | User profile management, company logos         |
| **Job Service**         | Express.js | 3003 | Job CRUD, search with filters                  |
| **Application Service** | Express.js | 3004 | Job applications, acceptance/rejection         |
| **CV Analysis Service** | Express.js | 3006 | AI-powered CV parsing, Gemini integration      |
| **Email Service**       | Express.js | 3005 | Async email notifications via SQS              |
| **API Gateway**         | NestJS     | 3000 | Request routing, auth validation, rate limit   |

**Each service has:**

- Independent database schema (DynamoDB tables)
- Complete separation of concerns
- tRPC procedures for type-safe endpoints
- Can be deployed and scaled separately

---

## 📋 Use Cases

### Job Seeker Flow

1. **Register** → Login with email/password
2. **Search** → Find jobs with filters (location, salary, skills)
3. **Apply** → Submit application with optional cover letter
4. **Upload CV** → Get AI-powered analysis and feedback
5. **Track** → Monitor application status
6. **Match Notification** → Receive email when employer accepts

### Employer Flow

1. **Register** → Setup company profile with logo
2. **Post Jobs** → Create job listings with requirements
3. **Review Apps** → See candidate profiles and CVs
4. **Accept/Reject** → Approve candidates for next steps
5. **Notifications** → Get alerted on new applications
6. **Match Alert** → Notify candidate when accepted

---

## 🚀 Development Guide

### Setup

```bash
# Install dependencies
pnpm install

# Start infrastructure (LocalStack)
docker-compose up -d

# Run all services
pnpm dev

# Run specific service
pnpm --filter auth-service dev
```

### Commands

```bash
# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check

# Testing
pnpm test
pnpm test:integration

# Code formatting
pnpm format
pnpm format:check

# Clean build artifacts
pnpm clean
```

---

## 🧪 Testing

The project includes unit and integration tests for all services:

```bash
# Run all tests
pnpm test

# Run tests for specific service
pnpm --filter api-gateway test

# Run integration tests
pnpm --filter job-service test:integration

# Watch mode
pnpm test:watch
```

**CI/CD Pipeline** automatically runs tests on every commit via GitHub Actions.

---

## 📂 Project Structure

```
jobmatch/
├── services/
│   ├── auth-service/          # Authentication & JWT validation
│   ├── user-service/          # User profile management
│   ├── job-service/           # Job postings & search
│   ├── application-service/   # Application workflows & notifications
│   ├── cv-analysis-service/   # AI-powered CV parsing
│   ├── email-service/         # Email notifications via SQS
│   └── api-gateway/           # Request routing & rate limiting
│
├── frontend/
│   ├── shell/                 # App shell (layout, routing)
│   ├── job-seeker-module/     # Remote module for job seekers
│   └── employer-module/       # Remote module for employers
│
├── packages/shared/           # Shared types, schemas, utilities
│
└── docker/localstack/         # LocalStack configuration for local AWS
```

---

## 🛠️ Architecture Highlights

### Type Safety End-to-End

```typescript
// Define once with Zod
export const JobSchema = z.object({
  jobId: z.string().uuid(),
  title: z.string().min(5).max(200),
  salary: z.number().positive(),
});

// Use everywhere with full type inference
type Job = z.infer<typeof JobSchema>;
```

- Zod for runtime validation
- tRPC for automatic type inference from backend to frontend
- TypeScript strict mode enforced
- ESLint + Prettier for code consistency

### Event-Driven Communication

```
Application Service → SQS Queue → Email Service → SMTP
```

Services communicate asynchronously via AWS SQS, enabling:

- Decoupled architecture
- Improved resilience (automatic retries)
- Better scalability (batch processing)

### Microservices Benefits

| Feature                    | Benefit                                            |
| -------------------------- | -------------------------------------------------- |
| **Independent Scaling**    | Each service scales based on its load              |
| **Technology Flexibility** | Mix NestJS (CPU-intensive) and Express (I/O-heavy) |
| **Clear Boundaries**       | Each service owns its data                         |
| **Fault Isolation**        | Service outages don't cascade                      |
| **Team Autonomy**          | Teams develop independently                        |

---

## 🌍 Deployment

### Local Development

Uses **LocalStack** to emulate AWS services:

- DynamoDB for data persistence
- S3 for file storage
- SQS for message queues
- All running in Docker

```bash
docker-compose up -d
```

### Production Deployment

The project is cloud-ready. Switch to production by:

1. Replace LocalStack with real AWS services
2. Update environment variables
3. Configure GitHub Actions secrets
4. Deploy via GitHub Actions or manual Docker push

Recommended platforms:

- **AWS ECS** – Managed container orchestration
- **AWS EKS** – Kubernetes for complex deployments
- **AWS App Runner** – Simplified container deployment

---

## 🔄 How Data Flows

### Request Flow

```
User → API Gateway (auth) → Service → Database
          ↓
      (JWT validation, rate limiting, routing)
```

### Async Notifications

```
Employer accepts candidate → Application Service
→ SQS message → Email Service
→ SMTP → Candidate inbox
```

---

## ✨ Key Features

- **JWT Authentication** – Secure token-based auth with role-based access
- **AI CV Analysis** – Google Gemini extracts skills and matches jobs
- **Async Email Notifications** – Decoupled via SQS
- **Microservices** – Independent, scalable services
- **Type Safe** – TypeScript + Zod throughout
- **Production Ready** – Docker, GitHub Actions CI/CD, comprehensive tests

---

## 📋 Future Enhancements

- Real-time notifications with WebSockets
- Advanced search with Elasticsearch
- Chat system between employers and candidates
- Video interview scheduling
- Analytics dashboard for employers
- Mobile applications (React Native)

---

## 🤝 Contributing

This is an open-source portfolio project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with modern full-stack technologies | Type-safe from frontend to database**

</div>
