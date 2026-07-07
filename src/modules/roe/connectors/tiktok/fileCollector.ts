import { readFileSync } from "node:fs";
import { normalizeReview } from "./normalize.js";
import type { NormalizedReview, RawReviewInput } from "../../types.js";
import { logger } from "../../../../core/logging/logger.js";

export function collectFromFile(
  filePath: string,
  platform: string,
): NormalizedReview[] {
  logger.info("Reading review file", { filePath, platform });
  const raw = readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const items: RawReviewInput[] = Array.isArray(data) ? data : [data];

  return items.map((item) => normalizeReview(platform, item as Record<string, unknown>));
}

export function getTemplate(): string {
  return JSON.stringify(
    [
      {
        platform: "tiktok",
        reviewer_name: "",
        star_rating: 5,
        review_text: "",
        order_id: "",
        product_sku: "",
        review_date_raw: new Date().toISOString(),
      },
    ],
    null,
    2,
  );
}
