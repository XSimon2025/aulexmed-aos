export type Platform = "tiktok" | "temu" | "amazon";

export type ModuleName = "roe" | "ads" | "content" | "knowledge" | "operator";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type Env = "development" | "staging" | "production";

export type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}
