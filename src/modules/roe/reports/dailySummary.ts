import type { ReviewCaseRecord, ReviewDailySummary, ReviewPlatform } from "../types.js";
import { supabaseGet } from "../../../infra/database/client.js";
import { createReviewDailySummary } from "../db/supabase.js";
import { logger } from "../../../core/logging/logger.js";

export async function generateDailySummary(
  platform: ReviewPlatform,
  date: string,
  dryRun: boolean,
): Promise<ReviewDailySummary | null> {
  const cases = await supabaseGet<ReviewCaseRecord>("review_cases", {
    platform: `eq.${platform}`,
    created_at: `gte.${date}T00:00:00Z`,
    limit: "1000",
  });

  const filtered = cases.filter(
    (c) => c.created_at.slice(0, 10) === date,
  );

  const stats = {
    total: filtered.length,
    by_rating: {} as Record<number, number>,
    by_sentiment: {} as Record<string, number>,
    high_risk: 0,
    needs_after_sales: 0,
  };

  for (const c of filtered) {
    if (c.star_rating) {
      stats.by_rating[c.star_rating] = (stats.by_rating[c.star_rating] ?? 0) + 1;
    }
    if (c.sentiment) {
      stats.by_sentiment[c.sentiment] = (stats.by_sentiment[c.sentiment] ?? 0) + 1;
    }
    if (c.risk_level === "high" || c.risk_level === "critical") stats.high_risk++;
    if (c.needs_after_sales_case) stats.needs_after_sales++;
  }

  const reportLines = [
    `# Daily Review Summary — ${platform.toUpperCase()}`,
    `Date: ${date}`,
    `Total reviews: ${stats.total}`,
    "",
    "## By Rating",
    ...Object.entries(stats.by_rating).map(([r, c]) => `- ${r}★: ${c}`),
    "",
    "## By Sentiment",
    ...Object.entries(stats.by_sentiment).map(([s, c]) => `- ${s}: ${c}`),
    "",
    `- High/Critical risk: ${stats.high_risk}`,
    `- Needs after-sales: ${stats.needs_after_sales}`,
  ];

  const summary: Omit<ReviewDailySummary, "id" | "created_at"> = {
    platform,
    date,
    stats,
    report_text: reportLines.join("\n"),
  };

  logger.info("Daily summary generated", { platform, date, total: stats.total });

  return createReviewDailySummary(summary, dryRun);
}
