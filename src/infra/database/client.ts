import { AppError, ErrorCode } from "../../core/errors/AppError.js";
import { getConfig } from "../../core/config/env.js";
import { logger } from "../../core/logging/logger.js";
import type { SupabaseResponse, RequestOptions } from "./types.js";

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const config = getConfig();
  const url = new URL(`/rest/v1/${path}`, config.SUPABASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function supabaseRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<SupabaseResponse<T>> {
  const config = getConfig();
  const url = buildUrl(path, options.params);

  const headers: Record<string, string> = {
    apikey: config.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
    ...(options.headers ?? {}),
  };

  if (options.body !== undefined && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  logger.debug("Supabase request", { method: options.method ?? "GET", url });

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new AppError(
      ErrorCode.DATABASE_ERROR,
      `Supabase request failed: ${response.status} ${response.statusText}`,
      { url, status: response.status, body },
    );
  }

  const data = (await response.json()) as T[];
  return data;
}

export async function supabaseGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T[]> {
  return supabaseRequest<T>(path, { method: "GET", params });
}

export async function supabasePost<T>(path: string, body: unknown): Promise<T[]> {
  return supabaseRequest<T>(path, { method: "POST", body });
}

export async function supabasePatch<T>(path: string, body: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T[]> {
  return supabaseRequest<T>(path, { method: "PATCH", body, params });
}

export async function supabaseDelete<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T[]> {
  return supabaseRequest<T>(path, { method: "DELETE", params });
}
