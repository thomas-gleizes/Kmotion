import { z } from 'zod';
import { LogLevel } from '@nestjs/common';

export const validationSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'provision'])
    .default('development'),
  LOG_LEVEL: z
    .string()
    .default('log')
    .transform<LogLevel[]>((value) => value.split(',') as LogLevel[]),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().default('secret'),
  JWT_EXPIRATION_TIME: z.number().default(500000),
  PASSWORD_PAPER: z.string().default('PAPER'),
  CONVERTER_URL: z.url().default('http://localhost:3000'),
  CONVERTER_KEY: z.string().default('secret'),
});

export type Environment = z.infer<typeof validationSchema>;

export const environment = validationSchema.parse(process.env);
