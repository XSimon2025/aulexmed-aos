import type { ReviewAnalysis, ReviewDailySummary, ReviewPlatform } from "../types/review.ts";

type AnalyzedReview = {
  star_rating: number;
  shop_region?: string | null;
  analysis: ReviewAnalysis;
};

export function buildDailySummary(input: {
  date?: string;
  platform?: ReviewPlatform;
  reviews: AnalyzedReview[];
}): ReviewDailySummary {
  const summaryDate = input.date || new Date().toISOString().slice(0, 10);
  const issueCounts = new Map<string, number>();

  for (const item of input.reviews) {
    const issue = item.analysis.issue_type || "none";
    if (issue !== "none") issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
  }

  const topIssues = Array.from(issueCounts.entries())
    .map(([issue_type, count]) => ({ issue_type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    summary_date: summaryDate,
    platform: input.platform || "tiktok",
    shop_region: input.reviews.find((item) => item.shop_region)?.shop_region || null,
    total_reviews: input.reviews.length,
    five_star_reply_count: input.reviews.filter((item) => item.star_rating === 5).length,
    four_star_reply_count: input.reviews.filter((item) => item.star_rating === 4).length,
    low_star_case_count: input.reviews.filter((item) => item.star_rating <= 3).length,
    public_reply_draft_count: input.reviews.filter((item) => item.analysis.needs_public_reply).length,
    private_message_draft_count: input.reviews.filter((item) => item.analysis.needs_private_message).length,
    pending_follow_up_count: input.reviews.filter((item) => item.analysis.needs_after_sales_case).length,
    top_issues: topIssues,
    content_team_suggestions:
      topIssues.length > 0
        ? topIssues.map((issue) => `Create clearer TikTok after-sales content for ${issue.issue_type}.`)
        : ["Collect more review data before changing content strategy."],
    product_knowledge_suggestions:
      topIssues.length > 0
        ? topIssues.map((issue) => `Add support knowledge entries for ${issue.issue_type} review patterns.`)
        : ["No repeated product issue detected in this run."]
  };
}
