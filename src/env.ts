import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Schémas de validation réutilisables
const jwtSchema = z
  .string()
  .min(32)
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);

const urlSchema = z.string().url();
const portSchema = z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1).max(65535));

export const env = createEnv({
  server: {
    // Base de données
    POSTGRES_PASSWORD: z.string().min(8),
    DATABASE_URL: z.string().url(),

    // Authentication
    JWT_SECRET: z.string().min(32),
    OPERATOR_TOKEN: z.string().min(32),

    // Supabase
    ANON_KEY: jwtSchema,
    SERVICE_ROLE_KEY: jwtSchema,
    PROJECT_REF: z.string().min(1),

    // Environment
    NODE_ENV: z.enum(["development", "production", "test"]),

    // Email (optionnel)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: portSchema.optional(),
    SMTP_USER: z.string().email().optional(),
    SMTP_PASS: z.string().min(8).optional(),
    SMTP_SENDER: z.string().email().optional(),

    // Storage
    STORAGE_BACKEND: z.enum(["file", "s3"]).default("file"),
    STORAGE_FILE_BACKEND_PATH: z.string().min(1),

    // Redis (optionnel)
    REDIS_URL: urlSchema.optional(),
  },

  client: {
    NEXT_PUBLIC_SUPABASE_URL: urlSchema,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: jwtSchema,
  },

  runtimeEnv: {
    // Base de données
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,

    // Authentication
    JWT_SECRET: process.env.JWT_SECRET,
    OPERATOR_TOKEN: process.env.OPERATOR_TOKEN,

    // Supabase
    ANON_KEY: process.env.ANON_KEY,
    SERVICE_ROLE_KEY: process.env.SERVICE_ROLE_KEY,
    PROJECT_REF: process.env.PROJECT_REF,

    // Environment
    NODE_ENV: process.env.NODE_ENV,

    // Email
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SENDER: process.env.SMTP_SENDER,

    // Storage
    STORAGE_BACKEND: process.env.STORAGE_BACKEND,
    STORAGE_FILE_BACKEND_PATH: process.env.STORAGE_FILE_BACKEND_PATH,

    // Redis
    REDIS_URL: process.env.REDIS_URL,

    // Client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
