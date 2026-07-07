import type {
  NormalizedReview,
  ReviewActionType,
  ReviewAnalysis,
  ReviewCaseRecord,
  ReviewDailySummary,
  ReviewPlatform
} from "../types/review.ts";
import { optionalEnv } from "../utils/env.ts";

type RequestOptions = RequestInit & {
  allowMissingEnv?: boolean;
};

function getConfig() {
  const url = optionalEnv("SUPABASE_URL", optionalEnv("NEXT_PUBLIC_SUPABASE_URL")).replace(/\/$/, "");
  const serviceRoleKey = optionalEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function encode(value: string) {
  return encodeURIComponent(value);
}

export function hasSupabaseConfig() {
  return Boolean(getConfig());
}

export async function supabaseRequest<T>(path: string, init: RequestOptions = {}): Promise<T | null> {
  const config = getConfig();
  if (!config) {
    if (init.allowMissingEnv) return null;
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text.trim() ? (JSON.parse(text) as T) : null;
}

export async function findReviewCaseBySource(platform: ReviewPlatform, sourceKey: string) {
  const rows = await supabaseRequest<ReviewCaseRecord[]>(
    `review_cases?platform=eq.${encode(platform)}&source_key=eq.${encode(sourceKey)}&select=*&limit=1`,
    { allowMissingEnv: true }
  );
  return rows?.[0] ?? null;
}

export async function upsertReviewCase(review: NormalizedReview) {
  const rows = await supabaseRequest<ReviewCaseRecord[]>("review_cases?on_conflict=platform,source_key", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(review),
    allowMissingEnv: true
  });

  return rows?.[0] ?? null;
}

export async function updateReviewCaseAnalysis(
  caseId: string,
  analysis: ReviewAnalysis,
  aiSource: "deepseek" | "fallback"
) {
  const status = analysis.needs_after_sales_case ? "needs_human_review" : "ready_to_reply";
  const rows = await supabaseRequest<ReviewCaseRecord[]>(`review_cases?id=eq.${encode(caseId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...analysis,
      status,
      ai_source: aiSource
    }),
    allowMissingEnv: true
  });

  return rows?.[0] ?? null;
}

export async function createReviewAction(input: {
  review_case_id?: string | null;
  action_type: ReviewActionType;
  actor?: string;
  action_payload?: Record<string, unknown>;
  dry_run?: boolean;
}) {
  const rows = await supabaseRequest<Array<{ id: string }>>("review_case_actions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      review_case_id: input.review_case_id ?? null,
      action_type: input.action_type,
      actor: input.actor || "aos-roe",
      action_payload: input.action_payload ?? {},
      dry_run: input.dry_run ?? true
    }),
    allowMissingEnv: true
  });
  return rows?.[0] ?? null;
}

export async function createReviewMessage(input: {
  review_case_id?: string | null;
  message_type: "public_reply_draft" | "private_message_draft" | "internal_note";
  language?: string | null;
  body: string;
  status?: string;
}) {
  const rows = await supabaseRequest<Array<{ id: string }>>("review_case_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      review_case_id: input.review_case_id ?? null,
      message_type: input.message_type,
      language: input.language ?? null,
      body: input.body,
      status: input.status || "draft"
    }),
    allowMissingEnv: true
  });
  return rows?.[0] ?? null;
}

export async function createReviewDailySummary(summary: ReviewDailySummary) {
  const rows = await supabaseRequest<ReviewDailySummary[]>(
    "review_daily_summaries?on_conflict=summary_date,platform,shop_region",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ ...summary, shop_region: summary.shop_region ?? "" }),
      allowMissingEnv: true
    }
  );
  return rows?.[0] ?? null;
}
