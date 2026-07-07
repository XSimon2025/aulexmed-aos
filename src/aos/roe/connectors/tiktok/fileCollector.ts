import { readFileSync } from "node:fs";
import type { NormalizedReview, RawReviewInput } from "../../types/review.ts";
import { readJsonArray } from "../../utils/json.ts";
import { normalizeTikTokReview } from "./normalize.ts";

export function collectTikTokReviewsFromFile(path: string): NormalizedReview[] {
  const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
  const rows = readJsonArray<RawReviewInput>(raw);
  return rows.map(normalizeTikTokReview);
}

export function getTikTokManualTemplate() {
  return [
    {
      platform: "tiktok",
      shop_region: "US",
      star_rating: 5,
      review_content: "Great product and comfortable fit.",
      review_language: "en",
      review_date: new Date().toISOString(),
      username: "example_user",
      product_name: "AULEXMED Walking Boot",
      product_id: "example-product-id",
      order_id: "example-order-id",
      sku: "example-sku",
      size_model: "M",
      has_public_reply: false,
      public_reply_content: null,
      can_open_review_detail: true,
      can_open_order_detail: true
    }
  ];
}
