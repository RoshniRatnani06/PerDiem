import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables from root .env file (for local development)
// In Vercel, environment variables are automatically available in process.env
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

const envSchema = z.object({
    PORT: z.string().default('3002'),
    SQUARE_ACCESS_TOKEN: z.string(),
    SQUARE_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
});

export const env = envSchema.parse(process.env);
