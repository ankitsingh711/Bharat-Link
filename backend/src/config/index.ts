import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('4000'),
    DATABASE_URL: z.string(),
    AWS_REGION: z.string(),
    COGNITO_USER_POOL_ID: z.string(),
    COGNITO_CLIENT_ID: z.string(),
    S3_BUCKET_MEDIA: z.string(),
    DYNAMODB_TABLE_ACTIVITY: z.string(),
});

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        console.error('Invalid environment configuration:', error);
        process.exit(1);
    }
};

export const config = parseEnv();
