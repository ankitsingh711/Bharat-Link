# Security & Compliance

## Data Protection
- **Encryption**: All data at rest (RDS, S3, DynamoDB) encrypted via KMS. TLS 1.2+ for transit.
- **Privacy**: Compliant with Indian Digital Personal Data Protection Act (DPDP).

## Authentication
- AWS Cognito for Identity Management.
- MFA forced for Admin and Recruiter accounts.

## Verification
- **GST/CIN**: Manual/Automated verification flow for companies using public APIs (stubbed).
