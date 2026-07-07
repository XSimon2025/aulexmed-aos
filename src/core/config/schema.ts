import { z } from "zod";

export const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DEEPSEEK_API_KEY: z.string().min(1),
  DEEPSEEK_MODEL: z.string().default("deepseek-v4-pro"),
  FEISHU_WEBHOOK_URL: z.string().url(),
  AOS_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  AOS_ENV: z.enum(["development", "staging", "production"]).default("development"),
});

export type EnvConfig = z.infer<typeof envSchema>;
