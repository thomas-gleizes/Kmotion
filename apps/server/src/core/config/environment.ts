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

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_NAME: z.string().default('kmotion'),
  DB_USER: z.string().default('kmotion'),
  DB_PASSWORD: z.string().default(''),

  JWT_SECRET: z.string().default('secret'),
  JWT_EXPIRATION_TIME: z.coerce.number().nonnegative().int().default(500000),

  PASSWORD_PAPER: z.string().default('PAPER'),

  CONVERTER_URL: z.url().default('http://localhost:3000'),
  CONVERTER_KEY: z.string().default(''),
});

export type Environment = z.infer<typeof validationSchema>;

export const environment = validationSchema.parse(process.env);
