import type { NormalizedReview } from "../../types.js";

const PLATFORM_FIELDS: Record<string, string[]> = {
  tiktok: ["order_id", "sku_id", "product_id", "review_id"],
  temu: ["order_id", "parent_order_id", "sku_id"],
  amazon: ["order_id", "asin"],
};

export function buildSourceKey(
  platform: string,
  review: Record<string, unknown>,
): string {
  const fields = PLATFORM_FIELDS[platform] ?? ["order_id"];
  const parts = fields
    .map((f) => String(review[f] ?? "").toLowerCase().trim())
    .filter(Boolean);

  if (parts.length === 0 && review.review_text) {
    const text = String(review.review_text).toLowerCase().trim().slice(0, 80);
    if (text) parts.push(text);
  }

  return `${platform}:${parts.join("|") || "unknown"}`;
}

export function normalizeDate(raw: unknown): string | undefined {
  if (!raw) return undefined;
  const d = new Date(String(raw));
  if (Number.isNaN(d.getTime())) return String(raw);
  return d.toISOString();
}

export function normalizeStarRating(raw: unknown): number {
  const n = Number(raw);
  if (n >= 1 && n <= 5) return Math.round(n);
  return 3;
}

export function clean(value: unknown): string | undefined {
  const s = String(value ?? "").trim();
  return s || undefined;
}

export function normalizeReview(
  platform: string,
  input: Record<string, unknown>,
): NormalizedReview {
  const starRating = normalizeStarRating(
    input.star_rating ?? input.rating ?? input.score ?? 3,
  );

  if (starRating < 1 || starRating > 5) {
    throw new Error(`Invalid star rating: ${starRating}`);
  }

  return {
    platform: platform as NormalizedReview["platform"],
    source_key: buildSourceKey(platform, input),
    reviewer_name:
      clean(input.reviewer_name) ??
      clean(input.user_name) ??
      clean(input.author),
    star_rating: starRating,
    review_text:
      clean(input.review_text) ??
      clean(input.content) ??
      clean(input.comment),
    review_url: clean(input.review_url) ?? clean(input.url),
    reviewer_avatar: clean(input.reviewer_avatar) ?? clean(input.avatar),
    order_id:
      clean(input.order_id) ??
      clean(input.parent_order_id) ??
      clean(input.oid),
    product_sku: clean(input.product_sku) ?? clean(input.sku) ?? clean(input.sku_id),
    product_name: clean(input.product_name) ?? clean(input.product_title),
    review_date_raw: clean(input.review_date_raw) ?? clean(input.review_time),
    review_date: normalizeDate(
      input.review_date_raw ?? input.review_time ?? input.created_at,
    ),
    raw_payload: (input.raw_payload as Record<string, unknown>) ?? input,
  };
}
