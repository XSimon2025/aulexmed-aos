import type { NormalizedReview, RawReviewInput } from "../../types/review.ts";

function clean(value?: string | null) {
  return value?.toString().trim() || null;
}

function normalizeDate(value?: string | null) {
  const cleaned = clean(value);
  if (!cleaned) return null;
  const parsed = new Date(cleaned);
  return Number.isNaN(parsed.getTime()) ? cleaned : parsed.toISOString();
}

export function buildTikTokSourceKey(input: RawReviewInput) {
  const stableParts = [
    input.platform || "tiktok",
    input.external_review_id,
    input.order_id,
    input.product_id,
    input.review_date,
    input.username,
    input.star_rating,
    input.review_content?.slice(0, 80)
  ].filter(Boolean);

  return stableParts.join("|").toLowerCase();
}

export function normalizeTikTokReview(input: RawReviewInput): NormalizedReview {
  const rating = Number(input.star_rating);

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error(`Invalid TikTok review star rating: ${input.star_rating}`);
  }

  return {
    platform: "tiktok",
    shop_region: clean(input.shop_region),
    star_rating: Math.round(rating),
    review_content: clean(input.review_content),
    review_language: clean(input.review_language),
    review_date: normalizeDate(input.review_date),
    username: clean(input.username),
    product_name: clean(input.product_name),
    product_id: clean(input.product_id),
    order_id: clean(input.order_id),
    sku: clean(input.sku),
    size_model: clean(input.size_model),
    has_public_reply: Boolean(input.has_public_reply),
    public_reply_content: clean(input.public_reply_content),
    can_open_review_detail: Boolean(input.can_open_review_detail),
    can_open_order_detail: Boolean(input.can_open_order_detail),
    needs_private_message: Boolean(input.needs_private_message),
    external_review_id: clean(input.external_review_id),
    source_url: clean(input.source_url),
    raw_payload: input.raw_payload ?? input,
    source_key: buildTikTokSourceKey(input)
  };
}
