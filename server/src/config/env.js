import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()).default('5000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()).default('100'),
  CONTACT_RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()).default('5')
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production') {
    if (!data.CORS_ORIGIN || data.CORS_ORIGIN.trim() === '*' || data.CORS_ORIGIN.includes('*')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CORS_ORIGIN cannot be wildcard "*" in production environment.',
        path: ['CORS_ORIGIN']
      });
    }
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('CRITICAL: Environment variable validation failed:');
  console.error(parsed.error.format());
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: 'development',
  PORT: 5000,
  CORS_ORIGIN: 'http://localhost:3000',
  RATE_LIMIT_MAX: 100,
  CONTACT_RATE_LIMIT_MAX: 5
};
