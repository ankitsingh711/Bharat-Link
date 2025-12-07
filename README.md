# BharatLink

BharatLink is a production-ready, Indian-focused LinkedIn-style social-professional platform.

## Features
- **Job Seeker**: Rich profiles, regional language support, job search, application tracking.
- **Recruiter**: Company verification (GST/CIN), job posting, applicant management.
- **India-Specific**: Government scheme integration, campus hiring, salary benchmarking by city.

## Quick Start
1. **Prerequisites**: Node.js 18+, Docker, AWS CLI, Terraform.
2. **Local Development**:
   ```bash
   make dev
   ```
   This will start the full stack locally using Docker Compose.

## Documentation
- [Architecture](./docs/architecture.md)
- [Security](./docs/security.md)
- [Operations](./docs/runbook.md)
- [Onboarding](./docs/onboarding.md)

## Deployment
See `.github/workflows` for CI/CD details.
Infra is managed via Terraform in `infrastructure/terraform`.
