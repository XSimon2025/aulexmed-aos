type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
};

export function getSupabaseAdminConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey
  };
}

export async function supabaseAdminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseAdminConfig();

  if (!config) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase admin request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();
  if (!text.trim()) {
    return null as T;
  }

  return JSON.parse(text) as T;
}
