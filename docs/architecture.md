# BharatLink Architecture

## high-Level Overview
BharatLink follows a microservices-ready modular monolith architecture on the backend, with a Next.js frontend.

### Components
1. **Frontend**: Next.js (App Router) hosted on CloudFront (Static) + Lambda/Fargate (SSR).
2. **Backend**: Node.js (Express) on AWS ECS Fargate.
3. **Database**: RDS Postgres for core data, DynamoDB for logs/activity.
4. **Search**: OpenSearch.
5. **Caching**: Redis.
6. **Queue**: SQS + Lambda consumers for background tasks.
7. **Auth**: AWS Cognito.

## Cost & Scaling
- **Low Cost (Dev/Stage)**: Single low-tier RDS, NAT Gateway cost optimization, shared ALB.
- **High Scale**: Read replicas for RDS, DynamoDB On-Demand, multiple ECS tasks.
