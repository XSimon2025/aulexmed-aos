import { chat, extractJson } from "../../../infra/ai/client.js";
import type { ChatMessage } from "../../../infra/ai/types.js";
import { buildReviewAnalysisPrompt } from "../prompts/reviewAnalysisPrompt.js";
import { fallbackReviewAnalysis } from "./fallback.js";
import type { ReviewAnalysis, ReviewIssueType } from "../types.js";
import type { Result } from "../../../core/types/index.js";
import { ok } from "../../../core/types/index.js";
import { logger } from "../../../core/logging/logger.js";

interface RawAnalysis {
  sentiment: string;
  issue_type: string;
  summary_cn: string;
  summary_en: string;
  reply_draft_cn: string;
  reply_draft_en: string;
  private_reply_draft: string;
  needs_after_sales_case: boolean | string;
  needs_human_review: boolean | string;
  risk_level: string;
  ai_confidence: number | string;
}

export async function analyzeReview(
  review: {
    star_rating: number;
    review_text?: string;
    product_name?: string;
  },
): Promise<Result<ReviewAnalysis>> {
  try {
    const prompt = buildReviewAnalysisPrompt(review);
    const messages: ChatMessage[] = [
      { role: "system", content: prompt },
      { role: "user", content: review.review_text ?? "(no text)" },
    ];

    const response = await chat(messages, { temperature: 0.55, maxTokens: 1400 });
    const parsed = extractJson<RawAnalysis>(response.content);

    if (!parsed) {
      logger.warn("AI analysis returned non-JSON, using fallback", {
        starRating: review.star_rating,
      });
      return ok(fallbackReviewAnalysis(review.star_rating, review.review_text));
    }

    return ok(normalizeAnalysis(parsed, review.star_rating, review.review_text));
  } catch (error) {
    logger.warn("AI analysis failed, using fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
    return ok(fallbackReviewAnalysis(review.star_rating, review.review_text));
  }
}

function normalizeAnalysis(
  raw: RawAnalysis,
  starRating: number,
  reviewText?: string,
): ReviewAnalysis {
  const fallback = fallbackReviewAnalysis(starRating, reviewText);

  return {
    sentiment: isValidSentiment(raw.sentiment) ? raw.sentiment : fallback.sentiment,
    issue_type: isValidIssueType(raw.issue_type) ? raw.issue_type : fallback.issue_type,
    summary_cn: raw.summary_cn || fallback.summary_cn,
    summary_en: raw.summary_en || fallback.summary_en,
    reply_draft_cn: raw.reply_draft_cn || fallback.reply_draft_cn,
    reply_draft_en: raw.reply_draft_en || fallback.reply_draft_en,
    private_reply_draft: raw.private_reply_draft || fallback.private_reply_draft,
    needs_after_sales_case: normalizeBoolean(raw.needs_after_sales_case),
    needs_human_review: normalizeBoolean(raw.needs_human_review),
    risk_level: isValidRiskLevel(raw.risk_level) ? raw.risk_level : fallback.risk_level,
    ai_confidence: Number(raw.ai_confidence) || fallback.ai_confidence,
  };
}

function isValidSentiment(v: string): v is "positive" | "neutral" | "negative" | "mixed" {
  return ["positive", "neutral", "negative", "mixed"].includes(v);
}

function isValidIssueType(v: string): v is ReviewIssueType {
  return [
    "product_quality", "size_fit", "shipping", "packaging",
    "customer_service", "price", "product_damage", "missing_parts",
    "description_mismatch", "other", "none",
  ].includes(v);
}

function isValidRiskLevel(v: string): v is "low" | "medium" | "high" | "critical" {
  return ["low", "medium", "high", "critical"].includes(v);
}

function normalizeBoolean(v: boolean | string | undefined): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}
