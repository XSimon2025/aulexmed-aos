import "dotenv/config";
import { envSchema, type EnvConfig } from "./schema.js";
import { AppError, ErrorCode } from "../errors/AppError.js";

let _config: EnvConfig | null = null;

export function loadConfig(): EnvConfig {
  if (_config) return _config;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new AppError(
      ErrorCode.CONFIG_MISSING,
      `Missing or invalid environment variables: ${missing}`,
      result.error.issues,
    );
  }

  _config = result.data;
  return _config;
}

export function getConfig(): EnvConfig {
  if (!_config) return loadConfig();
  return _config;
}

export function resetConfig(): void {
  _config = null;
}
