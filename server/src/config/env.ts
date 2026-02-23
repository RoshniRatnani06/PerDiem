import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3002'),
    SQUARE_ACCESS_TOKEN: z.string(),
    SQUARE_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
});

export const env = envSchema.parse(process.env);
